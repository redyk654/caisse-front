import React, { useEffect, useState, useRef, Fragment } from 'react';
import FacturePharmacie from './FacturePharmacie';
import './Pharmacie.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';

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

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [montantVerse, setmontantVerse] = useState('');
    const [verse, setverse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [filtrer, setFiltrer] = useState(false);
    const [manquantTotal, setManquantTotal] = useState(0);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [supp, setSupp] =  useState(true);
    const [modalReussi, setModalReussi] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);

    useEffect(() => {
        setFactures([])
        setfactureSauvegarde([]);
        const req = new XMLHttpRequest();
        if (filtrer) {
            req.open('GET', 'http://serveur/backend-cma/factures_pharmacie.php?filtrer=oui');
            const req2 = new XMLHttpRequest();
            req2.open('GET', 'http://serveur/backend-cma/factures_pharmacie.php?filtrer=oui&manquant');
            req2.addEventListener('load', () => {
                const result = JSON.parse(req2.responseText);
                setManquantTotal(result[0].manquant);
            })
            req2.send();

        } else {
            req.open('GET', 'http://serveur/backend-cma/factures_pharmacie.php');
        }
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
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
            console.error("Erreur réseau");
        });

        req.send();
    }, [filtrer, effet])

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            const req = new XMLHttpRequest();
    
            req.open('GET', `http://serveur/backend-cma/factures_pharmacie.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
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

    //  const miseAjourFicheStock = () => {
    //     let i = 0;
    //     medocCommandes.map(item => {

    //         const data2 = new FormData();
    //         data2.append('produit', JSON.stringify(item));

    //         // Envoi des données
    //         const req2 = new XMLHttpRequest();
    //         req2.open('POST', 'http://serveur/backend-cma/gestion_stock.php?remarque=sortie');
            
    //         // Une fois la requête charger on vide tout les états
    //         req2.addEventListener('load', () => {
    //             if (req2.status >= 200 && req2.status < 400) {
    //                 i++
    //                 if (i === medocCommandes.length) {

    //                 }
    //             }
    //         });
    //         req2.send(data2);
    //     });
    // }

     const reglerFacture = () => {
         if (parseInt(verse) >= parseInt(factureSelectionne[0].reste_a_payer)) {
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
                detailsFacture.map(item => {
                    const data1 = new FormData();
                    data1.append('produit', JSON.stringify(item));

                    const req1 = new XMLHttpRequest();
                    req1.open('POST', 'http://serveur/backend-cma/maj_medocs.php');

                    req1.addEventListener("load", function () {
                        if (req1.status >= 200 && req1.status < 400) {
                            console.log(req1.responseText);
                            i++;
                            if (i === detailsFacture.length) {
                                setSupp(false);
                                setModalReussi(true);
                            }
                        }
                    });

                    req1.send(data1);
                });
            });

            req.send(data);
        }
     }

     const reinitialsation = () => {
         setverse(0);
         setrelicat(0);
         setresteaPayer(0);
     }

    const filtrerListe = (e) => {
        // const medocFilter = factureSauvegarde.filter(item => (item.id.indexOf(e.target.value) !== -1));
        setFactures(factureSauvegarde.filter(item => (item.patient.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1)));
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

    const fermerModalReussi = () => {
        setModalReussi(false);
        seteffet(!effet);
        reinitialsation();
        setfactureSelectionne([]);
        setdetailsFacture([]);
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

                <p className="search-zone">
                    <input type="text" placeholder="Nom du patient" onChange={filtrerListe} />
                </p>
                <p>
                    <label htmlFor="" style={{marginRight: 5, fontWeight: 700}}>Non réglés</label>
                    <input type="checkbox" name="non_regle" id="non_regle" checked={filtrer} onChange={() => setFiltrer(!filtrer)} />
                </p>
                <div>
                    {filtrer ? (
                        <div>Total non réglés: <span style={{fontWeight: 700}}>{manquantTotal == null ? '0 Fcfa' : manquantTotal + ' Fcfa'}</span></div>
                    ) : null}
                </div>
                <h3>{filtrer ? 'Factures non réglés' : 'Factures'}</h3>
                <ul>
                    {factures.length > 0 ? factures.map(item => (
                        <li id={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.patient}</li>
                    )) : null}
                </ul>
            </div>
            <div className="details">
                <h3>Détails facture</h3>
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
                    <div style={{display: `${filtrer ? 'none' : 'none'}`}}>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                    <div style={{display: `${!filtrer ? 'none' : 'inline'}`}}>
                        <button style={{width: '20%', height: '5vh', marginLeft: '15px', backgroundColor: '#e14046'}} onClick={() => {if(detailsFacture.length > 0 && parseInt(factureSelectionne[0].reste_a_payer) > 0) setModalConfirmation(true)}}>Annuler</button>
                    </div>
                    <h3 style={{marginTop: 5}}>Régler la facture</h3>
                    {factureSelectionne.length > 0 && factureSelectionne[0].reste_a_payer > 0 ? (
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
                    <button onClick={reglerFacture}>Régler</button>
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
                                    patient={factureSelectionne[0].patient}
                                    assurance={factureSelectionne[0].assurance}
                                />
                            </div>
                        )}
                    </div>
                    {/* <div>
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
                                    montantVerse={factureSelectionne[0].montant_verse}
                                    relicat={factureSelectionne[0].relicat}
                                    resteaPayer={factureSelectionne[0].reste_a_payer}
                                    date={factureSelectionne[0].date_heure}
                                    caissier={factureSelectionne[0].caissier}
                                    patient={factureSelectionne[0].patient}
                                    assurance={factureSelectionne[0].assurance}
                                />
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    )
}
