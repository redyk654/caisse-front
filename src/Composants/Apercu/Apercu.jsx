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

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(false);
    const [montantFrais, setMontantFrais] = useState(0);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');
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
        startChargement();

        const d = new Date();
        let dateD;
        let dateF;

        if (dateDepart.length === 10) {
            dateD = dateDepart;
            dateF = dateFin;
        } else {
            dateD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            dateF = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            setdateJour(d.toLocaleString().substr(0, 10));
        }

        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);
        data.append('caissier', caissier);

        const req = new XMLHttpRequest();
        // Récupération des frais matériel
        const req2 = new XMLHttpRequest();

        if (dateD === dateF) {
            req.open('POST', `http://serveur/backend-cma/apercu.php?moment=jour`);
            req2.open('POST', `http://serveur/backend-cma/frais.php?moment=jour`);
        } else {
            req.open('POST', `http://serveur/backend-cma/apercu.php?moment=nuit`);
            req2.open('POST', `http://serveur/backend-cma/frais.php?moment=nuit`);
        }

        req.addEventListener('load', () => {
            setMessageErreur('');
            const result = JSON.parse(req.responseText);
            resetCategorie();
            sethistorique(result);
            stopChargement();
            let recette = 0;
            if (result.length > 0) {
                result.map(item => {
                    recette += parseInt(item.prix_total);
                })
                setRecetteTotal(recette);
            } else {
                setRecetteTotal(0);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req2.addEventListener('load', () => {
            if(req2.status >= 200 && req2.status < 400) {
                setMessageErreur('');
                let result2 = JSON.parse(req2.responseText);

                let t = 0;
                result2.map(item2 => {
                    t += parseInt(item2.frais);
                })
                setMontantFrais(t);
            }
        });

        req2.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req2.send(data);
        req.send(data);

    }, [dateDepart, dateFin, caissier]);

    useEffect(() => {
        if(historique.length > 0) {
            calculerRecetteParCategorie(historique)
        }
    }, [historique]);

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

    const resetCategorie = () => {
        setLabo(0);
        setRadio(0);
        setChr(0);
        setMater(0);
        setConsul(0);
        setEcho(0);
        setUpec(0);
        setMed(0);
    }

    const calculerRecetteParCategorie = (acte) => {
        const codes = ['RX', 'LAB', 'MA', 'MED', 'CHR', 'CO', 'UPEC', 'ECHO'];
        let lab = 0, rx = 0, ma = 0, me = 0, ch = 0, co = 0, up = 0, ec = 0;

        acte.map(item => {
            if (item.designation.toUpperCase().indexOf(codes[0]) === 0) {
                rx += parseInt(item.prix_total);
                setRadio(rx);
            } else if (item.designation.toUpperCase().indexOf(codes[1]) === 0) {
                lab += parseInt(item.prix_total);
                setLabo(lab);
            } else if (item.designation.toUpperCase().indexOf(codes[2]) === 0) {
                ma += parseInt(item.prix_total);
                setMater(ma);
            } else if (item.designation.toUpperCase().indexOf(codes[3]) === 0) {
                me += parseInt(item.prix_total);
                setMed(me);
            } else if (item.designation.toUpperCase().indexOf(codes[4]) === 0) {
                ch += parseInt(item.prix_total);
                setChr(ch);
            } else if (item.designation.toUpperCase().indexOf(codes[5]) === 0) {
                co += parseInt(item.prix_total);
                setConsul(co);
            } else if (item.designation.toUpperCase().indexOf(codes[6]) === 0) {
                up += parseInt(item.prix_total);
                setUpec(up);
            } else if (item.designation.toUpperCase().indexOf(codes[7]) === 0) {
                ec += parseInt(item.prix_total);
                setEcho(ec);
            }
        });
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value);
        setdateFin(date_select2.current.value);
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
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input type="date" ref={date_select2} />
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
                        <div>Recette : <span style={{fontWeight: '700'}}>{reccetteTotal ? reccetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Frais matériel : <span style={{fontWeight: '700'}}>{reccetteTotal ? montantFrais + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Total : <span style={{fontWeight: '700'}}>{reccetteTotal ? (reccetteTotal + montantFrais) + ' Fcfa' : '0 Fcfa'}</span></div>
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
                                <tr>
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
                    montantFrais={montantFrais}
                    nomConnecte={props.nomConnecte}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                />
            </div>
        </section>
    )
}
