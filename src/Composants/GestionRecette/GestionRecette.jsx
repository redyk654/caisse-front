import React, { Fragment, useEffect, useState, useRef } from 'react';
import './GestionRecette.css';
import Modal from "react-modal";
import ReactToPrint from 'react-to-print';
import ImprimerRecette from '../ImprimerRecette/ImprimerRecette';

const customStyles1 = {
    content: {
      top: '42%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
      width: '29%'
    },
};

const ulBox = {
    border: '1px solid gray',
    overflowY: 'auto',
    position: 'relative',
    height: '60vh',
    background: '#f1f1f1',
}

const styleBtnAutre = {
    backgroundColor: '#6d6f94',
    color: '#fff',
    height: '4vh',
    width: '35%',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

const searchInput = {
    width: '90%',
    height: '5vh',
    outline: 'none',
    borderRadius: '5px',
    color: '#0e771a',
    fontSize: '17px',
    marginBottom: '5px',
}

export default function GestionRecette(props) {

    const detail = {code: '', designation: '', prix: 0}

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const componentRef = useRef();

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [recetteTotal, setRecetteTotal] = useState(0);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [services, setServices] = useState([]);
    const [servicesSauvegarde, setServicesSauvegarde] = useState([]);
    const [categorie, setCategorie]= useState('');
    const [recetteRestante, setrecetteRestante] = useState(0);
    const [frais, setFrais] = useState(0);
    const [montantRetire, setmontantRetire] = useState(0);
    const [caissier, setCaissier] = useState('');
    const [rerender, setRerender] = useState(false);
    const [modalContenu, setModalContenu] = useState(true);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalValidation, setmodalValidation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [valeur, setValeur] = useState('');
    const [generalites, setGeneralites] = useState([]);
    const [totalGeneralites, setTotalGeneralites] = useState(0);
    const [itemPourcentage, setitemPourcentage] = useState('');
    const [detailsState, setDetailsState] = useState([detail]);
    const [detailsSauvegarde, setDetailsSauvegarde] = useState([]);
    const [state, setState] = useState(false);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', 'http://localhost/backend-cma/recuperer_caissier.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.nom_user != props.nomConnecte && item.rol !== "admin" && item.rol !== "regisseur"))
                setListeComptes(result);
            }
        });

        req.send();

    }, [services]);

    useEffect(() => {
        if (dateDepart.length > 0 && dateFin.length > 0) {

            let dateD = dateDepart;
            let dateF = dateFin;
    
            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier);
    
            const req = new XMLHttpRequest();
            req.open('POST', `http://localhost/backend-cma/gestion_pourcentage.php`);
    
            req.addEventListener('load', () => {
                fetchDetails();
                recupererRecetteTotal(data);
                const result = JSON.parse(req.responseText);
                sethistorique(result);
            });
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier]);

    useEffect(() => {
        setrecetteRestante(recetteTotal - montantRetire);
    }, [montantRetire]);

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/recuperer_recette.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.caissier === caissier));
                
                let recette = 0;
                result.forEach(item => {
                    recette += parseInt(item.a_payer);
                });
                setRecetteTotal(recette);
            }
        });
        req.send(data);
    }


    const fetchDetails = () => {
        let dateD = dateDepart;
        let dateF = dateFin;

        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);
        data.append('caissier', caissier);

        const req = new XMLHttpRequest();
        req.open('POST', `http://localhost/backend-cma/gestion_pourcentage.php?details=oui`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setServices(result);
            setServicesSauvegarde(result);
        });

        req.send(data)
    }

    const changerCategorie = (e) => {
        setServices(servicesSauvegarde.filter(item => item.categorie.toLowerCase() === e.target.value));
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        setCaissier(document.getElementById('caissier').value);
    }

    const changerContenuModal = () => {
        return modalContenu ?
        (
            <Fragment>
                <h2 style={{color: '#fff', textAlign: 'center', marginBottom: '10px'}}>{itemPourcentage}</h2>
                <div style={{color: '#fff', textAlign: 'center',}}>Entrez le pourcentage</div>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <input type="text"value={valeur} onChange={(e) => {if (!isNaN(e.target.value)) {setValeur(e.target.value)}}} style={{width: '40%', height: '3vh', marginBottom: '6px'}} />
                    <button 
                        id='confirmer' 
                        className='btn-confirmation' 
                        style={{width: '15%', height: '3vh', cursor: 'pointer', marginLeft: '5px'}} 
                        onClick={appliquerPourcentage}>
                        OK
                    </button>
                </div>
                <p>
                    <input style={searchInput} type="text" placeholder="recherchez..." autoComplete='off' />
                </p>
                <div>
                    <table>
                        <thead>
                            <th>Services</th>
                            <th>Total</th>
                        </thead>
                        <tbody>
                            {services.length > 0 && services.map(item => (
                                <tr>
                                    <td>{item.designation}</td>
                                    <td style={{color: '#0e771a', fontWeight: '600'}}>{item.prix_total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        ) : 
        (
            <Fragment>
                <h2 style={{color: '#fff', textAlign: 'center'}}></h2>
                <div style={{margin: 10}}>
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
                <div>
                    <ul style={ulBox}>
                        {services.length > 0 && services.map(item => (
                            <li style={{padding: '5px',}}>{extraireCode(item.designation) + ' (' + item.prix_total + ')       ' + item.nb}</li>
                        ))}
                    </ul>
                </div>
            </Fragment>
        )
    }

    const appliquerGeneralite = (e) => {
        // On retire les généralités de la liste des détails et on fait la soustraction sur le montant de la recette
        services.map(item => {
            if(item.code === detailsState[0].code) {
                item.detailsServices = item.detailsServices.filter(item2 => (item2.designation !== e.target.id));
                setDetailsSauvegarde(detailsSauvegarde.filter(item2 => (item2.designation !== e.target.id)));
                setGeneralites([...generalites, {designation: e.target.id, prix: e.target.value}]);
                item.recetteRestante = (parseInt(item.recetteRestante) - parseInt(e.target.value));
                setrecetteRestante(parseInt(recetteRestante) - parseInt(e.target.value));
                setState(!state);
            }
        });

    }

    const appliquerPourcentage = () => {
        // Application du pourcentage sur un service
        if (valeur.length > 0 && !isNaN(valeur)) {
            const item = services.filter(item => (item.service === itemPourcentage));
            item[0].pourcentage = parseInt(valeur);
            item[0].recetteRestante = parseInt(item[0].recetteRestante) - parseInt(item[0].recetteRestante) * (item[0].pourcentage / 100);

            // On met à jour la recette restante
            let recetteT = 0
            services.map(item => {recetteT += parseInt(item.recetteRestante)});
            setrecetteRestante(recetteT);

            setValeur('');
            fermerModalConfirmation();
        }
        
    }

    const genererId = () => {
        // Fonction pour générer un identifiant unique pour une commande
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) + recetteTotal;
    }

    // const enregitrerDetails = (id_recette) => {
    //     // On enregistre les détails de la recette
    //     let i = 0
    //     services.map(item => {
    //         const data = new FormData();
    //         data.append('id_recette', id_recette);
    //         data.append('categorie', item.service);
    //         data.append('recette', item.recette);
    //         data.append('pourcentage', item.pourcentage);
    //         data.append('recette_restante', item.recetteRestante);

    //         const req = new XMLHttpRequest();
    //         req.open('POST', 'http://localhost/backend-cma/gestion_pourcentage.php');

    //         req.addEventListener('load', () => {
    //             i++
    //             if (services.length === i) {
    //                 fermerModaValidation();
    //             }
    //         });

    //         req.send(data);
    //     })
    // }

    const terminer = () => {
        // Enregistrement de la recette et de tous les détails
        const id_recette = genererId();

        const data = new FormData();
        data.append('id_recette', id_recette);
        data.append('recette_total', recetteTotal);
        data.append('montant_retire', montantRetire);
        data.append('recette_restante', recetteRestante);
        data.append('caissier', caissier);
        data.append('regisseur', props.nomConnecte);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/gestion_pourcentage.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                fermerModaValidation();
                annuler()
            }
        })

        req.send(data);

    }

    const annuler = () => {
        setmontantRetire(0);
        setrecetteRestante(0);
        setRecetteTotal(0);
        sethistorique([]);
        setServices([]);
        document.getElementById('retire').value = "";
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setServices(servicesSauvegarde);
    }

    const fermerModaValidation = () => {
        setmodalValidation(false);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        annuler();
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
        <div className="gestion-recette">
            <Modal
                isOpen={modalReussi}
                style={customStyles1}
                contentLabel=""
            >
                <div style={{color: '#fff'}}>
                    <h3>Recette enregistré !</h3>
                    <button style={{padding: '5px', cursor: 'pointer'}} onClick={fermerModalReussi}>Fermer</button>
                    <ReactToPrint
                        trigger={() => <button style={{padding: '5px', cursor: 'pointer', marginLeft: '10px'}}>Imprimer</button>}
                        content={() => componentRef.current}
                    />
                </div>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                {changerContenuModal()}
            </Modal>
            <Modal
                isOpen={modalValidation}
                style={customStyles1}
                contentLabel=""
            >
                <div style={{color: '#fff'}}>
                    <h2>
                        Vous allez valider cette recette voulez-vous continuer ?
                    </h2>
                    <div style={{textAlign: 'center'}}>
                        <button style={{padding: '6px', cursor: 'pointer', margin: '8px'}} onClick={() => setmodalValidation(false)}>NON</button>
                        <button id="oui" style={{padding: '6px', cursor: 'pointer', margin: '8px'}} onClick={terminer}>OUI</button>
                    </div>
                </div>
            </Modal>
            <h1>Gestions des recettes</h1>

            <div className="container-gestion">
                <div className="box-1">
                    <h1>Options</h1>
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
                    <div style={{paddingLeft: '20px'}}>
                        <button style={styleBtnAutre} onClick={rechercherHistorique}>rechercher</button>
                    </div>
                </div>
                <div className="box-2">
                    <div className="btn-container" style={{textAlign: 'center'}}>
                        <button onClick={() => {setModalContenu(false); setModalConfirmation(true);}}>Généralités</button>
                    </div>
                    <table>
                        <thead>
                            <th>Rubrique</th>
                            <th>Recette</th>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr>
                                    <td>{item.categorie}</td>
                                    <td style={{color: '#0e771a', fontWeight: '600'}}>{item.recette}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{marginTop: '50px', textAlign: 'center'}}>
                        <div>
                            <input style={{width: '100px', height: '3vh'}} type="text" id="retire" />
                            <button 
                                style={{margin: 5, color: '#fff', backgroundColor: '#012557', width: '40px', height: '3vh', cursor: 'pointer'}}
                                onClick={() => setmontantRetire(parseInt(document.getElementById('retire').value))}
                            >
                                OK
                            </button>
                        </div>
                        <div>
                            Recette : <span style={{fontWeight: '600'}}>{recetteTotal + ' Fcfa'}</span>
                        </div>
                    </div>
                    <div className="btn-valid-annul" style={{textAlign: 'center', marginTop: '10px',}}>
                        <button onClick={terminer}>Terminer</button>
                    </div>
                </div>
            </div>
            <div style={{display: 'none'}}>
                <ImprimerRecette
                    ref={componentRef}
                    services={services}
                    recetteTotal={recetteRestante}
                />
            </div>
        </div>
    )
}
