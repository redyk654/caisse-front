import React, { useEffect, useState, useRef, Fragment } from 'react';
import FacturePharmacie from './FacturePharmacie';
import './Pharmacie.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';
import RecettePharmcie from './RecettePharmacie';

const customStyles1 = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
    },
};

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '50%',
    marginTop: '15px',
    fontSize: '15px',
}

export default function GestionFactures(props) {

    const componentRef = useRef();
    const componentRef2 = useRef();
    const btn = useRef();

    let date_select1 = useRef();
    let date_select2 = useRef();

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [montantVerse, setmontantVerse] = useState('');
    const [verse, setverse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [filtrer, setFiltrer] = useState(true);
    const [manquantTotal, setManquantTotal] = useState(0);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [supp, setSupp] =  useState(true);
    const [modalReussi, setModalReussi] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(0);
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        setFactures([])
        setfactureSauvegarde([]);
        setdetailsFacture([]);
        reinitialsation();
        setfactureSelectionne([]);
        document.querySelector('.recherche-patient').value = '';
        
        const req = new XMLHttpRequest();
        if (filtrer) {
            req.open('GET', `http://serveur/backend-cma/factures_pharmacie.php?filtrer=oui&caissier=${props.nomConnecte}`);
            const req2 = new XMLHttpRequest();
            req2.open('GET', 'http://serveur/backend-cma/factures_pharmacie.php?filtrer=oui&manquant');
            req2.addEventListener('load', () => {
                setMessageErreur('');
                const result = JSON.parse(req2.responseText);
                setManquantTotal(result[0].manquant);
            })

            req2.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });

            req2.send();

        } else {
            req.open('GET', 'http://serveur/backend-cma/factures_pharmacie.php');
        }
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                setMessageErreur('');
                const result = JSON.parse(req.responseText);
                setFactures(result);
                setfactureSauvegarde(result);

            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, [filtrer, effet])

    useEffect(() => {

        const d = new Date();
        let dateD;
        let dateF;

        if (dateDepart.length === 10) {
            dateD = dateDepart;
            dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier);
    
            const req = new XMLHttpRequest();
            if (dateD === dateF) {
                req.open('POST', `http://serveur/backend-cma/recette_pharmacie.php?moment=jour`);
            } else {
                req.open('POST', `http://serveur/backend-cma/recette_pharmacie.php?moment=nuit`);
            }
    
            req.addEventListener('load', () => {
                setMessageErreur('');
                const result = JSON.parse(req.responseText);
                if (isNaN(result[0].recette)) {
                    setRecetteTotal(0);
                } else {
                    setRecetteTotal(result[0].recette);
                }
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier]);

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            const req = new XMLHttpRequest();
    
            req.open('GET', `http://serveur/backend-cma/factures_pharmacie.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                setMessageErreur('');
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    

            req.send();
        }

    }, [effet2]);

    const afficherInfos = (e) => {
        // Affichage des informations de la facture selectionnée
        reinitialsation();
        setfactureSelectionne(factures.filter(item => (item.id == e.target.id)))
        seteffet2(!effet2);
    }

    const mettreAjourData = () => {
        if (montantVerse.length > 0 && factureSelectionne[0].a_payer) {
            setverse(montantVerse);

            if (parseInt(factureSelectionne[0].a_payer) < parseInt(montantVerse)) {
                setrelicat(parseInt(montantVerse) - parseInt(factureSelectionne[0].a_payer));
                setresteaPayer(0)
            } else {
                setresteaPayer(parseInt(factureSelectionne[0].a_payer - parseInt(montantVerse)));
                setrelicat(0)
            }

            setmontantVerse('')
        }
     }



    const reglerFacture = (e) => {
        if (parseInt(verse) >= parseInt(factureSelectionne[0].reste_a_payer)) {
            e.target.disabled = true;
             // Règlement de la facture

            const data = new FormData();
            let newMontantVerse = parseInt(factureSelectionne[0].montant_verse) + parseInt(verse);

            data.append('id', factureSelectionne[0].id);
            data.append('montant_verse', newMontantVerse);
            data.append('reste_a_payer', resteaPayer);
            data.append('relicat', relicat);
            data.append('caissier', props.nomConnecte);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/factures_pharmacie.php')

            req.addEventListener('load', () => {
                // Mise à jour des stocks des médicaments vendus
                let i = 0;
                setMessageErreur('');
                detailsFacture.map(item => {
                    const data1 = new FormData();
                    data1.append('produit', JSON.stringify(item));
                    data1.append('caissier', props.nomConnecte);

                    const req1 = new XMLHttpRequest();
                    req1.open('POST', 'http://serveur/backend-cma/maj_medocs.php');

                    req1.addEventListener("load", function () {
                        if (req1.status >= 200 && req1.status < 400) {
                            setMessageErreur('');
                            i++;
                            if (i === detailsFacture.length) {
                                enregistrerAssurance()
                                setSupp(false);
                                setModalReussi(true);
                            }
                        }
                    });

                    req1.addEventListener("error", function () {
                        // La requête n'a pas réussi à atteindre le serveur
                        setMessageErreur('Erreur réseau');
                    });
            

                    req1.send(data1);
                });
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    

            req.send(data);
        }
    }

    const enregistrerAssurance = () => {
        if(factureSelectionne.length > 0 && detailsFacture.length > 0 && factureSelectionne[0].assurance !== "aucune") {

            detailsFacture.map(item => {
                const data = new FormData();
    
                data.append('categorie', 'pharmacie');
                data.append('id_facture', factureSelectionne[0].id);
                data.append('patient', factureSelectionne[0].patient);
                data.append('designation', item.designation);
                data.append('quantite', item.quantite);
                data.append('prix_total', item.prix_total);

                
                const req = new XMLHttpRequest();
                req.open('POST', 'http://serveur/backend-cma/data_assurance.php');
                
                req.send(data);
                
                req.addEventListener("load", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('');
                });
                
                req.addEventListener("error", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('Erreur réseau');
                });
            })
        }
    }

    const reinitialsation = () => {
        setverse(0);
        setrelicat(0);
        setresteaPayer(0);
     }

    const filtrerListe = (e) => {
        
        const req = new XMLHttpRequest();

        if (filtrer) {
            req.open('GET', `http://serveur/backend-cma/rechercher_facture_phar.php?str=${e.target.value}&caissier=${props.nomConnecte}`);
        } else {
            req.open('GET', `http://serveur/backend-cma/rechercher_facture_phar.php?str=${e.target.value}`);
        }

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setFactures(result);
            }
        });

        req.send();
    }

    const supprimerFacture = () => {
        // Suppression d'une facture
        document.querySelector('.valider').disabled = true;
        document.querySelector('.supp').disabled = true;

        const req2 = new XMLHttpRequest();
        req2.open('GET', `http://serveur/backend-cma/supprimer_facture.php?id=${factureSelectionne[0].id}`);
        req2.addEventListener('load', () => {
            fermerModalConfirmation();
            setSupp(true);
            setModalReussi(true);
        });

        req2.send();

    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value);
        setdateFin(date_select2.current.value);
        setCaissier(props.nomConnecte);
    }

    const fermerModalReussi = () => {
        btn.current.disabled = false;
        document.querySelector('.recherche-patient').value = '';
        setModalReussi(false);
        seteffet(!effet);
        reinitialsation();
        setfactureSelectionne([]);
        setdetailsFacture([]);
        setFiltrer(false);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const mois = (str) => {

        switch(parseInt(str.substring(3, 5))) {
            case 1:
                return str.substring(0, 2) + " janvier " + str.substring(6, 10);
            case 2:
                return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
            case 3:
                return str.substring(0, 2) + " mars " + str.substring(6, 10);
            case 4:
                return str.substring(0, 2) + " avril " +  str.substring(6, 10);
            case 5:
                return str.substring(0, 2) + " mai " + str.substring(6, 10);
            case 6:
                return str.substring(0, 2) + " juin " + str.substring(6, 10);
            case 7:
                return str.substring(0, 2) + " juillet " + str.substring(6, 10);
            case 8:
                return str.substring(0, 2) + " août " + str.substring(6, 10);
            case 9:
                return str.substring(0, 2) + " septembre " + str.substring(6, 10);
            case 10:
                return str.substring(0, 2) + " octobre " + str.substring(6, 10);
            case 11:
                return str.substring(0, 2) + " novembre " + str.substring(6, 10);
            case 12:
                return str.substring(0, 2) + " décembre " + str.substring(6, 10);
        }
    }

    return (
        <div className="container-facture">
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                {
                    supp ? 
                    (<h2 style={{color: '#fff',}}>Facture supprimé ✔ !</h2>) :
                    (
                    <Fragment>
                        <h2 style={{color: '#fff', marginBottom: '5px'}}>Facture réglé !</h2>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#000', height: '5vh', width: '65%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </Fragment>
                    )
                }
                <button style={{width: '45%', height: '5vh', cursor: 'pointer', fontSize: 'large', marginTop: '9px'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>Annuler une facture entraine sa suppression. Voulez-vous continuer ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button className='supp' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>NON</button>
                    <button className="valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={supprimerFacture}>OUI</button>
                </div>
            </Modal>
            <div className="liste-medoc">
                <p>
                    <label htmlFor="">Du : </label>
                    <input type="date" ref={date_select1} />
                </p>
                <p>
                    <label htmlFor="">Au : </label>
                    <input type="date" ref={date_select2} />
                </p>
                <p>
                    <button onClick={rechercherHistorique}>rechercher</button>
                </p>
                <p>
                    recette du jour : <strong>{reccetteTotal ? reccetteTotal + ' Fcfa' : '0 Fcfa'}</strong>
                        {/* <ReactToPrint
                            trigger={() => <button style={{color: '#f1f1f1', height: '5vh', width: '30%', cursor: 'pointer', fontSize: 'medium', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef2.current}
                        /> */}
                </p>
                <p className="search-zone">
                    <input type="text" placeholder="Nom du patient" className="recherche-patient" onChange={filtrerListe} />
                </p>
                <p>
                    <label htmlFor="" style={{marginRight: 5, fontWeight: 700}}>Non réglés</label>
                    <input type="checkbox" name="non_regle" id="non_regle" checked={filtrer} onChange={() => setFiltrer(!filtrer)} />
                </p>
                {/* <div>
                    {filtrer ? (
                        <div>Total non réglés: <span style={{fontWeight: 700}}>{manquantTotal == null ? '0 Fcfa' : manquantTotal + ' Fcfa'}</span></div>
                    ) : null}
                </div> */}
                <h3>{filtrer ? 'Factures non réglés' : 'Factures'}</h3>
                <ul>
                    {factures.length > 0 ? factures.map(item => (
                        <li id={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.patient}</li>
                    )) : null}
                </ul>
            </div>
            <div className="details">
                <h3>Détails facture</h3>
                <div className='erreur-message'>{messageErreur}</div>
                <div style={{textAlign: 'center', paddingTop: 10}}>
                    <div>
                        <div>Facture N°<span style={{color: '#0e771a', fontWeight: 700}}>{factureSelectionne.length > 0 && factureSelectionne[0].id}</span></div>
                    </div>
                    <div>
                        <div>Le <strong>{factureSelectionne.length > 0 && mois(factureSelectionne[0].date_heure.substring(0, 11))}</strong> à <strong>{factureSelectionne.length > 0 && factureSelectionne[0].date_heure.substring(11, )}</strong></div>
                    </div>
                    <div style={{marginTop: 5}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].patient}</span></div>
                    {factureSelectionne.length > 0 && factureSelectionne[0].assurance !== "aucune" ? <div>couvert par : <strong>{factureSelectionne[0].assurance.toUpperCase()}</strong></div> : null}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%'}}>
                        <table style={table_styles}>
                            <thead>
                                <th style={table_styles1}>Désignation</th>
                                <th style={table_styles2}>Pu</th>
                                <th style={table_styles2}>Qte</th>
                                <th style={table_styles2}>Total</th>
                            </thead>
                            <tbody>
                                {detailsFacture.map(item => (
                                    <tr>
                                        <td style={table_styles1}>{item.designation}</td>
                                        <td style={table_styles2}>{parseInt(item.prix_total) / parseInt(item.quantite)}</td>
                                        <td style={table_styles2}>{item.quantite}</td>
                                        <td style={table_styles2}>{item.prix_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{marginTop: 15}}>
                        <div style={{fontWeight: 700}}>Status: {factureSelectionne.length > 0 && parseInt(factureSelectionne[0].reste_a_payer) > 0 ? '❌' : '✔️'}</div>
                    </div>
                    <div>
                        <div>Net à payer <span style={{fontWeight: 700, color: '#0e771a'}}>{factureSelectionne.length > 0 && factureSelectionne[0].a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div>
                        <div>Reste à payer <span style={{fontWeight: 700, color: '#0e771a'}}>{factureSelectionne.length > 0 && factureSelectionne[0].reste_a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div style={{display: `${filtrer ? 'none' : 'block'}`}}>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                    <div style={{display: `${!filtrer ? 'none' : 'inline'}`}}>
                        <button style={{width: '20%', height: '5vh', marginLeft: '15px', backgroundColor: '#e14046'}} onClick={() => {if(detailsFacture.length > 0 && parseInt(factureSelectionne[0].reste_a_payer) > 0) setModalConfirmation(true)}}>Annuler</button>
                    </div>
                    <h3 style={{marginTop: 5, display: `${filtrer ? 'block' : 'none'}`}}>Régler la facture</h3>
                    {filtrer ? (
                        <div style={{marginTop: 13}}>
                            <p>
                                <label htmlFor="">Montant versé: </label>
                                <input style={{height: '4vh', width: '15%'}} type="text" value={montantVerse} onChange={(e) => !isNaN(e.target.value) && setmontantVerse(e.target.value)} />
                                <button style={{width: '5%', marginLeft: 5}} onClick={mettreAjourData}>ok</button>
                            </p>
                            <p>
                                Montant versé: <span style={{fontWeight: 'bold'}}>{verse + ' Fcfa'}</span>
                            </p>
                            <p>
                                Relicat: <span style={{fontWeight: 'bold'}}>{relicat + ' Fcfa'}</span>
                            </p>
                            <p>
                                Reste à payer: <span style={{fontWeight: 'bold'}}>{resteaPayer + ' Fcfa'}</span>
                            </p>
                        </div>
                    ) : null}
                    <button ref={btn} style={{display: `${filtrer ? 'inline' : 'none'}`}} onClick={(e) => {if(filtrer && detailsFacture.length > 0) {reglerFacture(e)} else {}}}>Régler</button>
                    <div>
                        {factureSelectionne.length > 0 && (
                            <div style={{display: 'none'}}>
                                <FacturePharmacie
                                    ref={componentRef}
                                    medocCommandes={detailsFacture}
                                    idFacture={factureSelectionne[0].id}
                                    patient={factureSelectionne[0].patient}
                                    prixTotal={factureSelectionne[0].prix_total}
                                    reduction={factureSelectionne[0].reduction}
                                    aPayer={factureSelectionne[0].a_payer}
                                    montantVerse={verse}
                                    relicat={relicat}
                                    resteaPayer={resteaPayer}
                                    date={factureSelectionne[0].date_heure}
                                    caissier={props.nomConnecte}
                                    assurance={factureSelectionne[0].assurance}
                                />
                            </div>
                        )}
                        <div style={{display: 'none'}}>
                            <RecettePharmcie
                                ref={componentRef2}
                                recetteTotal={reccetteTotal}
                                nomConnecte={props.nomConnecte}
                                dateDepart={dateDepart}
                                dateFin={dateFin}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
