import React, { useEffect, useRef, useState } from 'react';
import './VueRecettes.css';
import ReactToPrint from 'react-to-print';
import ImprimerRecette from '../ImprimerRecette/ImprimerRecette';

export default function VueRecettes(props) {

    const componentRef = useRef();

    const [listeRecettes, setListeRecettes] = useState([]);
    const [listeRecettesSauvegarde, setListeRecettesSauvegarde] = useState([]);
    const [infoRecette, setInfoRecette] = useState(false);
    const [detailsRecette, setDetailsRecette] = useState([]);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/gestion_pourcentage.php?recuperer');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setListeRecettesSauvegarde(result);
                setListeRecettes(result);
            }
        });

        req.send();
    }, []);

    const filtrerListe = (e) => {
        setListeRecettes(listeRecettesSauvegarde.filter(item => (item.date_heure.indexOf(e.target.value) !== -1)));
    }

    const afficherRecettes = (e) => {
        // Récupération des détails d'une recette
        setInfoRecette(listeRecettesSauvegarde.filter(item => (item.id_recette.indexOf(e.target.id) !== -1)));
        // console.log(listeRecettesSauvegarde.filter(item => (item.id_recette.indexOf(e.target.id) !== -1)));
        const req = new XMLHttpRequest();
        req.open('GET', `http://serveur/backend-cma/gestion_pourcentage.php?id_recette=${e.target.id}`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText)
                setDetailsRecette(result);
            }
        })

        req.send();
    }


    return (
        <div className="container-vue">
            <h1>Liste de toutes les recettes</h1>
            <div className="container-gestion">
                <div className="box-1">
                    <p className="search-zone">
                        <input type="text" placeholder="entrez une date" onChange={filtrerListe} autoComplete='off' />
                    </p>
                    <h1>Recettes</h1>
                    <ul>
                        {listeRecettes.length > 0 && listeRecettes.map(item => (
                        <li id={item.id_recette} onClick={afficherRecettes}>{"recette du " + item.date_heure}</li>
                        ))}
                    </ul>
                </div>
                <div className="box-2">
                    <h1>Détails de la recette</h1>
                    <div className="btn-container" style={{textAlign: 'center'}}>
                        <div>recette du : <span>{infoRecette && infoRecette[0].date_heure}</span> </div>
                        <div>caissier : <span>{infoRecette && infoRecette[0].caissier}</span></div>
                        {props.role === "admin" && (<div>Regisseur : <span>{infoRecette && infoRecette[0].regisseur}</span></div>)}
                    </div>
                    <table>
                        <thead>
                            <th>Services</th>
                            <th style={{textAlign: 'left'}}>Recettes</th>
                        </thead>
                        <tbody>
                            {detailsRecette.map(item => (
                                <tr>
                                    <td>{item.categorie}</td>
                                    <td style={{color: '#0e771a', fontWeight: '600', textAlign: 'left'}}>{item.recette_restante}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{marginTop: '50px', textAlign: 'center'}}>
                        <div>
                            Recette Total : <span style={{fontWeight: '600'}}>{ infoRecette ? infoRecette[0].recette_restante + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                    </div>
                    <div className="btn-valid-annul" style={{textAlign: 'center', marginTop: '10px',}}>
                        <ReactToPrint
                            trigger={() => <button style={{padding: '5px', cursor: 'pointer', marginLeft: '10px'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                </div>
            </div>
            <div style={{display: 'none'}}>
                <ImprimerRecette
                    ref={componentRef}
                    detailsRecette={detailsRecette}
                    infoRecette={infoRecette}
                />
            </div>
        </div>
    )
}
