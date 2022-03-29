import React, { useEffect, useState, useContext, useRef } from 'react';
import './Apercu.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import ImprimerHistorique from '../ImprimerHistorique/ImprimerHistorique';


export default function Apercu(props) {

    const componentRef = useRef();


    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [total, setTotal] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(false);
    const [montantFrais, setMontantFrais] = useState(0);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');
    const [assurance, setAssurance] = useState('non');
    const [labo, setLabo] = useState(0);
    const [radio, setRadio] = useState(0);
    const [consul, setConsul] = useState(0);
    const [echo, setEcho] = useState(0);
    const [mater, setMater] = useState(0);
    const [chr, setChr] = useState(0);
    const [med, setMed] = useState(0);
    const [upec, setUpec] = useState(0);
    const [messageErreur, setMessageErreur] = useState('');


    useEffect(() => {

        if (dateDepart.length > 0 && dateFin.length > 0) {
            
            startChargement();
    
            let dateD = dateDepart;
            let dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier);
            data.append('assurance', assurance);
    
            const req = new XMLHttpRequest();
    
            req.open('POST', `http://serveur/backend-cma/apercu.php`);
    
            req.addEventListener('load', () => {
                setMessageErreur('');
                recupererRecetteTotal(data);
                const result = JSON.parse(req.responseText);
                sethistorique(result);

                let t = 0;
                result.forEach(item => {
                    t += parseInt(item.prix_total);
                })

                setTotal(t);

                stopChargement();
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier, assurance]);

    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/recuperer_caissier.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "caissier"))
                setListeComptes(result);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/recuperer_recette.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);

                if (props.role === "caissier") {
                    result = result.filter(item => (item.caissier === props.nomConnecte));
                } else {
                    result = result.filter(item => (item.caissier === caissier));
                }
                
                let recette = 0, frais = 0;
                if (assurance === "non") {
                    result.forEach(item => {
                        if (item.assurance === "aucune") {
                            recette += parseInt(item.a_payer);
                            frais += parseInt(item.frais);
                        }
                    });
                } else {
                    result.forEach(item => {
                        if (item.assurance !== "aucune") {
                            recette += parseInt(item.a_payer);
                            frais += parseInt(item.frais);
                        }
                    });
                }
                setRecetteTotal(recette);
                setMontantFrais(frais);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x100000000);        
    }

    const recuperationFrais = () => {

        let dateD = dateDepart;
        let dateF = dateFin;

        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);
        data.append('caissier', caissier);
        data.append('assurance', assurance);

        const req = new XMLHttpRequest();
        // Récupération des frais matériel
        req.open('POST', `http://serveur/backend-cma/frais.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result2 = JSON.parse(req.responseText);
                setMontantFrais(parseInt(result2[0].frais));
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);

    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        setCaissier(document.getElementById('caissier').value);
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

    return (
        <section className="historique">
            <h1>Historique des actes</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                        <div className='erreur-message'>{messageErreur}</div>
                        <div>
                            <p>
                                <label htmlFor="">Du : </label>
                                <input type="date" ref={date_select1} />
                                <input type="time" ref={heure_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input type="date" ref={date_select2} />
                                <input type="time" ref={heure_select2} />
                            </p>
                            <p>
                                <label htmlFor="assure">Categorie : </label>
                                <select name="" id="assure" onChange={(e) => setAssurance(e.target.value)}>
                                    <option value="non">non assuré</option>
                                    <option value="oui">assuré</option>
                                </select>
                            </p>
                            <p>
                                <label htmlFor="">Caissier : </label>
                                <select name="caissier" id="caissier">
                                    {props.role === "caissier" ? 
                                    <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> :
                                    listeComptes.map(item => (
                                        <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                    ))                               }
                                </select>
                            </p>
                        </div>
                        <button onClick={rechercherHistorique}>rechercher</button>
                        <div>Total : <span style={{fontWeight: '700'}}>{total ? (total + montantFrais) + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Matériel : <span style={{fontWeight: '700'}}>{montantFrais ? montantFrais + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Recette : <span style={{fontWeight: '700'}}>{reccetteTotal ? reccetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div style={{display: 'none',}}>
                            <div style={{width: '50%'}}>Laboratoire : <span style={{fontWeight: '700'}}>{reccetteTotal ? labo + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Radiologie : <span style={{fontWeight: '700'}}>{reccetteTotal ? radio + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Médécine : <span style={{fontWeight: '700'}}>{reccetteTotal ? med + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Maternité : <span style={{fontWeight: '700'}}>{reccetteTotal ? mater + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Petite chirurgie : <span style={{fontWeight: '700'}}>{reccetteTotal ? chr + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Consultation : <span style={{fontWeight: '700'}}>{reccetteTotal ? consul + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Echographie : <span style={{fontWeight: '700'}}>{reccetteTotal ? echo + ' Fcfa' : '0 Fcfa'}</span></div>
                            <div style={{width: '50%'}}>Upec : <span style={{fontWeight: '700'}}>{reccetteTotal ? upec + ' Fcfa' : '0 Fcfa'}</span></div>
                        </div>

                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr key={item.id}>
                                    <td>{extraireCode(item.designation)}</td>
                                    <td>{item.prix_total + ' Fcfa'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {historique.length > 0 && (
                    <div style={{textAlign: 'center'}}>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                )}
            </div>
            <div style={{display: 'none'}}>
                <ImprimerHistorique
                    ref={componentRef}
                    historique={historique}
                    recetteTotal={reccetteTotal}
                    listing={assurance}
                    total={total}
                    montantFrais={montantFrais}
                    nomConnecte={props.nomConnecte}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                />
            </div>
        </section>
    )
}
