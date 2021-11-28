import React, { useEffect, useState, useContext, useRef } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Historique(props) {

    let date_select = useRef();
    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([])
    const [dateJour, setdateJour] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(false);
    const [dateRecherche, setdateRecherche] = useState('');
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);

    useEffect(() => {

        if (dateDepart.length > 0 && dateFin.length > 0) {
            startChargement();
            let dateD = dateDepart;
            let dateF = dateFin;

            const req = new XMLHttpRequest();
            req.open('GET', `http://serveur/backend-cma/recuperer_services_fait.php?dateD=${dateD}&dateF=${dateF}`);

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                console.log(req.responseText);
                sethistorique(result);
                stopChargement();

                const req2 = new XMLHttpRequest();
                req2.open('GET', `http://serveur/backend-cma/recuperer_services_fait.php?dateD=${dateD}&dateF=${dateF}&recette=oui`);
                req2.onload = () => {setRecetteTotal(JSON.parse(req2.responseText)[0].recette);}
                req2.send();

            });

            req.send();
        }

    }, [dateDepart, dateFin, search]);

    const rechercherHistorique = () => {
        setSearch(!search);
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
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
            <h1>Historique des services médicaux</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
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
                        <button onClick={rechercherHistorique}>rechercher</button>
                        <div>Recette total : <span style={{fontWeight: '700'}}>{reccetteTotal ? reccetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Prix</td>
                                <td>Par</td>
                                <td>Le</td>
                                <td>À</td>
                                <td>Patient</td>
                                <td>Reduction</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr key={item.id}>
                                    <td>{extraireCode(item.designation)}</td>
                                    <td>{item.prix}</td>
                                    <td>{item.caissier}</td>
                                    <td>{mois(item.date_fait)}</td>
                                    <td>{item.heure_fait}</td>
                                    <td>{item.patient}</td>
                                    <td style={{fontWeight: '700'}}>{parseInt(item.reduction) > 0 ? '-' + item.reduction + ' %': 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
