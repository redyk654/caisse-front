import React, { useEffect, useState, useRef } from 'react';
import Facture from '../Facture/Facture';
import './GestionFactures.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';

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
    fontSize: '15px'
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
            req.open('GET', 'http://serveur/backend-cma/gestion_factures.php?filtrer=oui');
            const req2 = new XMLHttpRequest();
            req2.open('GET', 'http://serveur/backend-cma/gestion_factures.php?filtrer=oui&manquant');
            req2.addEventListener('load', () => {
                const result = JSON.parse(req2.responseText);
                setManquantTotal(result[0].manquant);
            })
            req2.send();

        } else {
            req.open('GET', 'http://serveur/backend-cma/gestion_factures.php');
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
    
            req.open('GET', `http://serveur/backend-cma/gestion_factures.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
                fermerModalConfirmation();
            });

            req.send()
        }

    }, [effet2])

    const afficherInfos = (e) => {
        // Affichage des informations de la facture selectionnée
        reinitialsation();
        setfactureSelectionne(factures.filter(item => (item.id == e.target.id)))
        seteffet2(!effet2);
    }

    const mettreAjourData = () => {
        if (montantVerse.length > 0 && factureSelectionne[0].reste_a_payer) {
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

     const reglerFacture = () => {
         if (factureSelectionne.length > 0) {
             if (verse >= factureSelectionne[0].a_payer) {
                 // Règlement de la facture
    
                const data = new FormData();
                let newMontantVerse = parseInt(factureSelectionne[0].montant_verse) + parseInt(verse);
    
                data.append('id', factureSelectionne[0].id);
                data.append('montant_verse', newMontantVerse);
                data.append('reste_a_payer', resteaPayer);
                data.append('relicat', relicat);
    
                const req = new XMLHttpRequest();
                req.open('POST', 'http://serveur/backend-cma/gestion_factures.php')
    
                req.addEventListener('load', () => {
                    setSupp(false);
                    setModalReussi(true);
                });
    
                req.send(data);
            }
         }
     }

     const reinitialsation = () => {
         setverse(0);
         setrelicat(0);
         setresteaPayer(0);
     }

    const filtrerListe = (e) => {
        setFactures(factureSauvegarde.filter(item => (item.id.indexOf(e.target.value.trim()) !== -1)));
    }

    const supprimerFacture = () => {
        document.querySelector('.valider').disabled = true;
        document.querySelector('.supp').disabled = true;
        // Suppression d'une facture
        const data = new FormData();
        data.append('id', factureSelectionne[0].id);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/supprimer_facture.php');
        
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setModalConfirmation(false);
                setSupp(true);
                setModalReussi(true);
            }
        });

        req.send(data);
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

    const extraireCode = (designation) => {
        const codes = ['RX', 'LAB', 'MA', 'MED', 'CHR', 'CO', 'UPEC', 'SP', 'CA'];
        let designation_extrait = '';
        
        codes.forEach(item => {
            if(designation.toUpperCase().indexOf(item) === 0) {
                designation_extrait =  designation.slice(item.length + 1);
            } else if (designation.toUpperCase().indexOf('ECHO') === 0)  {
                designation_extrait = designation;
            }
        });

        if (designation_extrait === '') designation_extrait = designation;

        return designation_extrait;
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
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>Annuler une facture entraine sa suppression. Voulez-vous continuer ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button className="supp" style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>NON</button>
                    <button className="valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={supprimerFacture}>OUI</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                {
                    supp ? 
                    (<h2 style={{color: '#fff'}}>Facture supprimé ✔ !</h2>) :
                    (<h2 style={{color: '#fff'}}>Service effectué !</h2>)
                }
                <button style={{width: '30%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <div className="liste-medoc">

                <p className="search-zone">
                    <input type="text" placeholder="N° facture" onChange={filtrerListe} />
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
                        <li id={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.id}</li>
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
                        <div>Le <strong>{factureSelectionne.length > 0 && mois(factureSelectionne[0].date_heure.substring(0, 10))}</strong> à <strong>{factureSelectionne.length > 0 && factureSelectionne[0].date_heure.substring(11, )}</strong></div>
                    </div>
                    <div style={{marginTop: 5}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].patient}</span></div>
                    {factureSelectionne.length > 0 && factureSelectionne[0].assurance !== "aucune" ? <div>couvert par : <strong>{factureSelectionne[0].assurance.toUpperCase()}</strong></div> : null}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%'}}>
                        <table style={table_styles}>
                            <thead>
                                <th style={table_styles1}>Désignation</th>
                                <th style={table_styles2}>Prix</th>
                            </thead>
                            <tbody>
                                {detailsFacture.map(item => (
                                    <tr>
                                        <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                        <td style={table_styles2}>{item.prix}</td>
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
                    <div>                        
                    <div style={{display: `${filtrer ? 'none' : 'inline'}`}}>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                    <div style={{display: ' none'}}>
                        <button style={{width: '20%', height: '5vh', marginLeft: '15px', backgroundColor: '#e14046'}} onClick={() => {if(detailsFacture.length > 0) setModalConfirmation(true)}}>Annuler</button>
                    </div>
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
                                Restant à payer: <span style={{fontWeight: 'bold'}}>{resteaPayer + ' Fcfa'}</span>
                            </p>
                        </div>
                    ) : null}
                    <button onClick={reglerFacture}>Régler</button>
                    <div>
                        {factureSelectionne.length > 0 && (
                            <div style={{display: 'none'}}>
                                <Facture 
                                ref={componentRef}
                                medocCommandes={detailsFacture}
                                idFacture={factureSelectionne[0].id}
                                patient={factureSelectionne[0].patient}
                                prixTotal={factureSelectionne[0].prix_total}
                                reduction={factureSelectionne[0].reduction}
                                aPayer={factureSelectionne[0].a_payer}
                                montantVerse={factureSelectionne[0].montant_verse}
                                relicat={factureSelectionne[0].relicat}
                                assurance={factureSelectionne[0].assurance}
                                resteaPayer={factureSelectionne[0].reste_a_payer}
                                date={factureSelectionne[0].date_heure}
                                nomConnecte={factureSelectionne[0].caissier}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
