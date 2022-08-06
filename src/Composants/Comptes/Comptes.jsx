import React, { Fragment, useEffect, useState } from 'react';
import './Comptes.css';
import Modal from 'react-modal';

const customStyles1 = {
    content: {
      top: '32%',
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

const utilisateur = {
    nom: '',
    mdp: '',
    confirmation: ''
}

export default function Comptes(props) {

    const [listeComptes, setListeComptes] = useState([]);
    const [recettes, setRecettes] = useState([]);
    const [recettejour, setRecetteJour] = useState({});
    const [compteSelectionne, setCompteSelectionne] = useState([]);
    const [modalContenu, setModalContenu] = useState(true);
    const [nvCompte, setNvCompte] = useState(utilisateur);
    const [msgErreur, setMsgErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [reussi, setReussi] = useState('supp');

    const { nom, mdp, confirmation } = nvCompte;


    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/recuperer_caissier.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.nom_user !== props.nomConnecte))
                setListeComptes(result);
            }
        });

        req.send();
    }, [modalReussi, modalConfirmation]);

    const changerContenuModal = () => {
        return modalContenu ? 
        (
            <Fragment>
                <h2 style={{color: '#fff'}}>Enregistrer cette recette ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button id='annuler' className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>non</button>
                    <button id='confirmer' className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={enregisterRecette}>oui</button>
                </div>
            </Fragment>
        ) :
        (
            <form action="" className="form-compte">
                <h3>Nouveau compte</h3>
                <div className="box-input">
                    <p className="input-zone">
                        <label htmlFor="">Nom</label>
                        <input type="text" name="nom" value={nom} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Mot de passe</label>
                        <input type="password" name="mdp" value={mdp} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Confirmer mot de passe</label>
                        <input type="password" name="confirmation" value={confirmation} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Rôle : </label>
                        <select name="role">
                            <option value="admin">admin</option>
                            <option value="caissier">caissier</option>
                            <option value="regisseur">regisseur</option>
                            <option value="secretaire">sécrétaire</option>
                        </select>
                    </p>
                </div>
                <div style={{color: '#fff53b'}}>{msgErreur}</div>
                <div className="btn-control">
                    <button type="reset" onClick={annulerCompte}>annuler</button>
                    <button type="submit" onClick={enregistrerCompte}>valider</button>
                </div>
            </form>
        )
    }

    const annulerCompte = () => {
        fermerModalConfirmation();
        setNvCompte(utilisateur)
        setMsgErreur('');
    }

    const enregistrerCompte = (e) => {
        e.preventDefault();
        // Enregistrement du nouveau compte dans la base de données

        if (mdp === confirmation) {
            setMsgErreur('');

            const data = new FormData();
            data.append('nom', nom);
            data.append('mdp', mdp);
            data.append('role', document.querySelector('form').role.value);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/enregistrer_caissier.php');

            req.addEventListener('load', () => {
                setNvCompte(utilisateur);
                fermerModalConfirmation();
                setReussi('');
                setModalReussi(true);
            })

            req.send(data);
            

        } else {
            setMsgErreur('Le mot de passe et le mot passe de confirmation doivent être identique')
        }
    }

    const handleChange = (e) => {
        setNvCompte({...nvCompte, [e.target.name]: e.target.value});
    }

    const ajouterCompte = () => {
        setModalContenu(false);
        setModalConfirmation(true)
    }

    const afficherCompte = (e) => {
        // Affichage d'un compte
        setCompteSelectionne(listeComptes.filter(item => item.nom_user === e.target.id));
    }

    const enregisterRecette = () => {
        // Enreistrement de la recette dans la base de données
        setModalContenu(true);
        setModalConfirmation(false);
        const data = new FormData();
        data.append('nom', compteSelectionne);
        data.append('montant', recettejour.recette);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/gestion_caisse.php');

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setModalReussi(true);
            }
        })

        req.send(data);
    }
    
    const supprimerCompte = () => {
        // Suppression d'un compte
        if (compteSelectionne.length > 0) {
            const req = new XMLHttpRequest();
            req.open('GET', `http://serveur/backend-cma/supprimer_compte.php?compte=${compteSelectionne[0].nom_user}`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    setCompteSelectionne([]);
                    setReussi('supp');
                    setModalReussi(true);
                }
            })
            req.send();
        }
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    return (
        <section className="comptes">
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                {changerContenuModal()}
            </Modal>
            <Modal
                isOpen={modalReussi}
                onRequestClose={fermerModalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                {reussi === 'supp' ?
                (
                    <Fragment>
                        <h2 style={{color: '#fff'}}>Compte supprimé✔️!</h2>
                        <button style={{width: '25%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>Fermer</button>
                    </Fragment>
                ) : 
                (
                    <Fragment>
                        <h2 style={{color: '#fff'}}>Enregistré avec succès✔️!</h2>
                        <button style={{width: '25%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>Fermer</button>
                    </Fragment>
                )}
            </Modal>
            <h1>Gestions des comptes</h1>
            <div className="container-gestion">
                <div className="box-1">
                    <h1>Comptes</h1>
                    <ul>
                        {listeComptes.length > 0 && listeComptes.map(item => (
                        <li id={item.nom_user} onClick={afficherCompte}>{item.nom_user.toUpperCase()}</li>
                        ))}
                    <div className="nv-compte">
                        <button onClick={ajouterCompte}>ajouter</button>
                    </div>
                    </ul>
                </div>
                <div className="box-2">
                   <h1>Détails Compte</h1>
                   <div className="details-compte" style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <div style={{width: '100%'}}>Nom</div>
                            <div style={{width: '100%', fontWeight: '600'}}>{compteSelectionne.length > 0 && compteSelectionne[0].nom_user}</div>
                        </div>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <div style={{width: '100%'}}>Rôle</div>
                            <div style={{width: '100%', fontWeight: '600'}}>{compteSelectionne.length > 0 && compteSelectionne[0].rol}</div>
                        </div>
                   </div>
                   <div style={{width: '100%', textAlign: 'center',}}>   
                        <button style={{width: '15%', marginTop: '30px', backgroundColor: '#e14046'}} onClick={supprimerCompte}>Supprimer</button>
                   </div>
                </div>
            </div>
        </section>
    )
}
