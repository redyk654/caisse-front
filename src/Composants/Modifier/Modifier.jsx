import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import '../Commande/Commande.css';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
// Styles pour les fenêtres modales
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

const styleBtnAutre = {
    height: '4vh',
    width: '38%',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

export default function Modifier(props) {

    const componentRef = useRef();
    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [listeMedocSauvegarde2, setListeMedocSauvegarde2] = useState([]);
    const [medocSelect, setMedoSelect] = useState(false);
    const [categorie, setCategorie]= useState('');
    const [messageErreur, setMessageErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalPatient, setModalPatient] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [statePourRerender, setStatePourRerender] = useState(true);
    const [state, setState] = useState(false);
    const [renrender, setRerender] = useState(true);


    useEffect(() => {
        const d = new Date();
        let urgence;

        if (renrender) {
            // Etat d'urgence entre 17h et 8h et les weekends
            
            if (d.getHours() >= 17 || d.getHours() <= 7 || (d.getDay() === 0 || d.getDay() === 6)) {
                urgence = true;
            } else {
                urgence = false;
            }

            setRerender(false);
            // Récupération des médicaments dans la base via une requête Ajax
            const req = new XMLHttpRequest();
            if (urgence) {
                req.open('GET', 'http://serveur/backend-cma/recuperer_services.php?urgence=oui');
            } else {
                req.open('GET', 'http://serveur/backend-cma/recuperer_services.php');
            }
            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                    const result = JSON.parse(req.responseText);
    
                    // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                    setListeMedoc(result.filter(item => item.categorie.toLowerCase() === "maternité"));
                    setListeMedocSauvegarde(result.filter(item => item.categorie.toLowerCase() === "maternité"));
                    setListeMedocSauvegarde2(result);
    
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
        }
    }, [renrender]);

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
        setListeMedoc(medocFilter);
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
        })

        if (designation_extrait === '') designation_extrait = designation;

        return designation_extrait;
    }

    const changerCategorie = (e) => {
        setListeMedoc(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value));
        setListeMedocSauvegarde(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value));
    }

    const supprimer = () => {
        if (medocSelect) {
            const req = new XMLHttpRequest();
            req.open('GET', `http://serveur/backend-cma/gestion_services.php?id=${medocSelect[0].id}`);

            req.addEventListener('load', () => {
                setRerender(!renrender);
                setMedoSelect(false);
            });
    
            req.send();
        }
    }

    const modifierService = () => {
        if (medocSelect) {
            const data = new FormData();
            data.append('categorie', categorie);
            data.append('id', medocSelect[0].id);
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/gestion_services.php');

            req.addEventListener('load', () => {
                fermerModalConfirmation();
                setRerender(!renrender);
                setMedoSelect(false);
            });
    
            req.send(data);
        }
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    return (
        <section className="commande">
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                onRequestClose={fermerModalConfirmation}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>Modifier la catégorie</h2>
                <div style={{margin: 10}}>
                    <select name="categorie" id="categorie" onChange={(e) => setCategorie(e.target.value)}>
                        <option value="maternité">Maternité</option>
                        <option value="imagerie">Imagerie</option>
                        <option value="laboratoire">Laboratoire</option>
                        <option value="carnet">Carnet</option>
                        <option value="medecine">Medecine</option>
                        <option value="chirurgie">Chirurgie</option>
                        <option value="upec">Upec</option>
                        <option value="consultation spécialiste">Consultation Spécialiste</option>
                    </select>
                </div>
                <button style={styleBtnAutre} onClick={modifierService}>Enregistrer</button>
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" className="recherche" placeholder="recherchez un service" onChange={filtrerListe} autoComplete='off' />
                </p>
                <div>
                    <label htmlFor="categorie">Catégorie : </label>
                    <select name="categorie" id="categorie" onChange={changerCategorie}>
                        <option value="maternité">Maternité</option>
                        <option value="imagerie">Imagerie</option>
                        <option value="laboratoire">Laboratoire</option>
                        <option value="carnet">Carnet</option>
                        <option value="medecine">Medecine</option>
                        <option value="chirurgie">Chirurgie</option>
                        <option value="upec">Upec</option>
                        <option value="consultation spécialiste">Consultation Spécialiste</option>
                    </select>
                </div>
                <div className="liste-medoc">
                    <h1>Services</h1>
                    <ul>
                        {listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos}>{extraireCode(item.designation)}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="right-side">
                <h1>{medocSelect ? "Détails du service" : "Selectionnez un service pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                        <div className="service">
                            <div>
                                <p>Designation</p>
                                <p style={{fontWeight: '700'}}>{extraireCode(item.designation)}</p>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <p>Prix</p>
                                <p style={{fontWeight: '700'}}>{item.prix + ' Fcfa'}</p>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <p>Catégorie</p>
                                <p style={{fontWeight: '700'}}>{item.categorie}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="details-commande">
                        <div className="valider-annuler">
                            <button onClick={supprimer}>Supprimer</button>
                            <button onClick={() => setModalConfirmation(true)}>Modifier</button>

                        </div>
                    </div>
            </div>
        </section>
    )
}
