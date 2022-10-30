import React, { useEffect, useState, useRef, Fragment } from 'react';
import '../Commande/Commande.css';
import Modal from 'react-modal';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const btn_styles = {
    backgroundColor: '#6d6f94', 
    width: '50%', 
    height: '4vh', 
    color: '#fff', 
    fontSize: '17px', 
    margin: 5, 
    cursor: 'pointer',
}

const stylePatient = {
    marginTop: '5px',
    height: '45vh',
    border: '1px solid gray',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: '#fff'
}

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

const customStyles4 = {
    content: {
      top: '40%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
      width: '400px',
      height: '75vh'
    }, 
};


export default function Assurance() {

    let date_select1 = useRef();
    let date_select2 = useRef();
    let btnSauvegarde = useRef();

    const [listeClients, setListeClients] = useState([]);
    const [listeClientsSauvegarde, setListeClientsSauvegarde] = useState([]);
    const [listePatient, setlistePatient] = useState([]);
    const [listePatientSauvegarde, setlistePatientSauvegarde] = useState([]);
    const [listeAssurances, setListeAssurances] = useState([]);
    const [assurance, setAssurance] = useState('assuretous');
    const [assuranceClient, setAssuranceClient] = useState('assuretous');
    const [nvAssurance, setnvAssurance] = useState('');
    const [typeAssurance, setTypeAssurance] = useState(0);
    const [patient, setPatient] = useState('');
    const [clientSelect, setClientSelect] = useState([]);
    const [infosClient, setInfosClient] = useState([]);
    const [pharmacie, setPharmacie] = useState([]);
    const [dateInf, setDateInf] = useState('');
    const [dateSup, setDateSup] = useState('');
    const [service, setService] = useState([]);
    const [frais, setFrais] = useState([]);
    const [reste, setReste] = useState(0);
    const [montants, setMontants] = useState([]);
    const [modalPatient, setModalPatient] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [fecth, setFetch] = useState(false);
    const [assuranceSelect, setAssuranceSelect] = useState('');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if(clientSelect.length === 1) {
            let result = [], i = 0;

            clientSelect[0].factures.map(item => {
                const req = new XMLHttpRequest();
                req.open('GET', `http://serveur/backend-cma/gestion_assurance.php?facture=${item}`);
                req.addEventListener('load', () => {
                    i++;
                    result = [...result, ...JSON.parse(req.responseText)];


                    if (clientSelect[0].factures.length === i) {
                        result = traiterDoublons(result);
                        result.map(item => {
                            if (item.categorie !== "pharmacie") {
                                let des = extraireCode(item.designation);

                                Object.defineProperty(item, 'designation', {
                                    value: des,
                                    configurable: true,
                                    enumerable: true,
                                });
                            }
                        });
                        setInfosClient(result);
                        setReste((parseInt(clientSelect[0].total) * (parseInt(clientSelect[0].type_assurance) / 100)));
                        setMontants([{reste: reste, total: clientSelect[0].total}]);
                    }
                });

                req.send()
            })
        }
    }, [clientSelect]);

    useEffect(() => {
        separerCategorie(infosClient);
    }, [infosClient]);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/gestion_patients.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
            setlistePatientSauvegarde(result);
        })

        req.send();
    }, [modalPatient]);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/assurances.php?liste');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeAssurances(result);
        })

        req.send();
    }, [modalPatient, fecth]);

    const separerCategorie = (result) => {
        const s = [], p = [];

        result.forEach(item => {
            if (item.categorie === "pharmacie") {
                p.push(item);
            } else {
                s.push(item)
            }
        })

        setPharmacie(p);
        setService(s);
    }

    const traiterDoublons = (result) => {
        const des = [];
        const tab = [];
        result.forEach(item => {
            if (des.indexOf(item.designation) === -1) {
                des.push(item.designation);
                Object.defineProperty(item, 'prix', {
                    value: parseInt(item.prix) / parseInt(item.qte),
                    configurable: true,
                    enumerable: true,
                });
                tab.push(item);
            } else {
                tab.forEach(item2 => {
                    if (item.designation === item2.designation) {
                        if (item2.categorie === "pharmacie") {
                            Object.defineProperty(item, 'prix', {
                                value: parseInt(item.prix) / parseInt(item.qte),
                                configurable: true,
                                enumerable: true,
                            });
                            Object.defineProperty(item2, 'qte', {
                                value: parseInt(item.qte) + parseInt(item2.qte),
                                configurable: true,
                                enumerable: true,
                            });

                        } else {

                            Object.defineProperty(item2, 'qte', {
                                value: parseInt(item.qte) + parseInt(item2.qte),
                                configurable: true,
                                enumerable: true,
                            });
                            Object.defineProperty(item2, 'prix_total', {
                                value: parseInt(item.qte) * parseInt(item2.prix),
                                configurable: true,
                                enumerable: true,
                            });
                        }
                    }
                });
            }
        });

        tab.forEach(item3 => {
            if (item3.categorie === "pharmacie") {
                Object.defineProperty(item3, 'prix_total', {
                    value: parseInt(item3.prix) * parseInt(item3.qte),
                    configurable: true,
                    enumerable: true,
                });
            } else {
                Object.defineProperty(item3, 'prix_total', {
                    value: parseInt(item3.prix) * parseInt(item3.qte),
                    configurable: true,
                    enumerable: true,
                });
            }
        });

        return tab;
    }

    const rechercherClient = () => {
        setClientSelect([]);
        setInfosClient([]);
        setListeClients([]);
        const data = new FormData();
        data.append('date_min', date_select1.current.value);
        data.append('date_max', date_select2.current.value);
        data.append('assurance', assurance);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/gestion_assurance.php?categorie=service');

        req.addEventListener('load', () => {
            let result = [...JSON.parse(req.responseText)];


            const req2 = new XMLHttpRequest();
            req2.open('POST', 'http://serveur/backend-cma/gestion_assurance.php?categorie=pharmacie');
            req2.addEventListener('load', () => {
                result = [...result, ...JSON.parse(req2.responseText)];

                traiterData(result);
                traiterDateConsommation(result);
            });

            req2.send(data);
        });

        req.send(data)
    }

    const traiterDateConsommation = (result) => {
        const tab_date = [];
        result.forEach(item => {
            tab_date.push(item.date_heure);
        });

        const maxi = maximumDate(tab_date);
        const mini = minimumDate(tab_date);

        setDateInf(mini);
        setDateSup(maxi);
    }

    const maximumDate = (result) => {
        let max = result[0];

        result.forEach(item => {
            const d1 = new Date(item);
            const d2 = new Date(max);

            if (d1.getTime() > d2.getTime()) {
                max = item;
            }
        });

        return max;
    }

    const minimumDate = (result) => {
        let min = result[0];

        result.forEach(item => {
            const d1 = new Date(item);
            const d2 = new Date(min);

            if (d1.getTime() < d2.getTime()) {
                min = item;
            }
        });

        return min;
    }


    const traiterData = (result) => {
        const clients = [];
        const listeProvisoiresClient = [];
        console.log(result);

        result.forEach(item => {
            if (clients.indexOf(item.code_patient) === -1) {
                clients.push(item.code_patient);
                listeProvisoiresClient.push({id_fac: item.id_fac, code_patient: item.code_patient, nom: item.patient, factures: [item.id], total: parseInt(item.prix_total), frais: parseInt(item.frais), type_assurance: item.type_assurance, assurance: item.assurance});
            } else {
                listeProvisoiresClient.forEach(item2 => {
                    if (item.code_patient === item2.code_patient){
                        item2.factures.push(item.id);
                        if (item.frais) {
                            item2.frais += parseInt(item.frais);
                        }
                        item2.total += parseInt(item.prix_total);
                    }
                })
            }
        });


        setListeClients(listeProvisoiresClient);
        setListeClientsSauvegarde(listeProvisoiresClient);
    }

    const afficherInfos = (e, nom, code_patient, frais, factures, total, type_assurance, assurance) => {
        setInfosClient([]);
        setClientSelect([{nom: nom, code_patient: code_patient, frais: frais, factures: factures, total: total, type_assurance: type_assurance, assurance: assurance}]);
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000)
               .toString(32)
               .substring(1);
    }

    const miseAjourStatu = () => {
        let i = 0
        clientSelect[0].factures.forEach(item => {
            const data = new FormData();
            data.append('id_fac', item);
            data.append('categorie', 'service');

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/gestion_assurance.php');

            req.addEventListener('load', () => {
                i++;
                if (clientSelect[0].factures.length === i) {
                    i = 0;
                    
                    clientSelect[0].factures.forEach(item => {
                        data.append('id_fac', item);
                        data.append('categorie', 'pharmacie');

                        const req2 = new XMLHttpRequest();
                        req2.open('POST', 'http://serveur/backend-cma/gestion_assurance.php');

                        req2.addEventListener('load', () => {
                            i++;
                            if (clientSelect[0].factures.length === i) {
                                setListeClients(listeClients.filter(item => (item.code_patient.toLowerCase() !== clientSelect[0].code_patient.toLowerCase())));
                                setListeClientsSauvegarde(listeClients.filter(item => (item.code_patient.toLowerCase() !== clientSelect[0].code_patient.toLowerCase())));
                                setClientSelect([]);
                                setInfosClient([]);
                                btnSauvegarde.current.disabled = false;

                            }
                        });

                        req2.send(data);
                        
                    });
                }
            });

            req.send(data);
        });
    }

    
    const sauvegarderFacture = () => {
        // Sauvegarde d'une facture d'assurance
        if (clientSelect.length > 0) {
            btnSauvegarde.current.disabled = true;
            const id = idUnique();
            const data = new FormData();
            data.append('id_facture', id);
            data.append('nom', clientSelect[0].nom);
            data.append('code_patient', clientSelect[0].code_patient);
            data.append('assurance', assurance);
            data.append('assurance_type', clientSelect[0].type_assurance);
            data.append('periode', "du " + mois2(dateInf) + " au " + mois2(dateSup));
            data.append('total', clientSelect[0].total);
            data.append('reste', reste);
    
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/gestion_assurance.php');
    
            req.addEventListener('load', () => {
                enregistrerIdFactures(id);
            });
    
            req.send(data);
        }
    }

    const enregistrerIdFactures = (id) => {
        // Mise à jour des status des factures
        let i = 0;
        clientSelect[0].factures.forEach(item => {
            const data = new FormData();
            data.append('id_facture', item);
            data.append('id_general', id);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cma/gestion_assurance.php');

            req.addEventListener('load', () => {
                i++;
                if (clientSelect[0].factures.length === i) {
                    miseAjourStatu();
                }
            });

            req.send(data);

        });
    }

    const creerCodePatient = () => {
        // Création d'un code unique pour le patient
        let d = new Date();
        return d.toLocaleString().substring(15,17) + Math.floor((1 + Math.random()) * 0x100000)
               .toString(16)
               .substring(1);
    }

    const ajouterPatient = () => {
        const data = new FormData();
        data.append('nom_patient', patient);
        data.append('code_patient', creerCodePatient());
        data.append('assurance', assuranceClient);
        data.append('type_assurance', typeAssurance);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/gestion_patients.php');

        req.addEventListener('load', () => {
            setModalPatient(false);
            setPatient('');
        });

        req.send(data);
    }

    const ajouterAssurance = () => {
        const data = new FormData();
        data.append('designation', nvAssurance);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/assurances.php');

        req.addEventListener('load', () => {
            setFetch(!fecth);
            setnvAssurance('');
        });

        req.send(data);
    }

    const contenuModal = () => {
        return (
            <Fragment>
                <h2 style={{color: '#fff'}}>informations du client</h2>
                <div className="detail-item">
                    <div style={{display: 'flex', flexDirection: 'column' , width: '100%', marginTop: 10, color: '#f1f1f1'}}>
                        <label htmlFor="" style={{display: 'block',}}>Nom et prénom</label>
                        <div>
                            <input type="text" name="qteDesire" style={{width: '250px', height: '4vh'}} value={patient} onChange={(e) => setPatient(e.target.value)} autoComplete='off' />
                            <button style={{cursor: 'pointer', width: '95px', height: '4vh', marginLeft: '5px'}} onClick={ajouterPatient}>Enregistrer</button>
                        </div>
                        <div style={{marginTop: '10px', lineHeight: '25px',}}>
                            <p>
                                <label htmlFor="">Assurance : </label>
                                <select name="assurance" id="" onChange={(e) => setAssuranceClient(e.target.value)}>
                                    {listeAssurances.map(item => (
                                        <option value={item.designation}>{item.designation}</option>
                                    ))}
                                </select>
                            </p>
                            <p>
                                <label htmlFor="">Pourcentage : </label>
                                <select name="pourcentage" id="typeAssurance" onChange={(e) => setTypeAssurance(e.target.value)}>
                                    <option value={0}>0%</option>
                                    <option value={80}>80%</option>
                                    <option value={90}>90%</option>
                                    <option value={100}>100%</option>
                                </select>
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{border: '1px solid #fff', marginTop: '30px'}}>
                    <h2 style={{color: '#fff', marginBottom: '15px'}}>Nouvelle assurance</h2>
                    <label htmlFor="" style={{display: 'block', color: '#f1f1f1'}}>Désignation</label>
                    <div>
                        <input type="text" name="nvAssurance" style={{width: '250px', height: '4vh'}} value={nvAssurance} onChange={(e) => setnvAssurance(e.target.value)} autoComplete='off' />
                        <button style={{cursor: 'pointer', width: '95px', height: '4vh', marginLeft: '5px'}} onClick={ajouterAssurance}>Ajouter</button>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <h3 style={{color: '#fff'}}>Liste des assurances</h3>
                        <ul style={stylePatient}>
                            {listeAssurances.length > 0 && listeAssurances.map(item => (
                                <li value={item.id} style={{padding: '6px'}} onClick={() => {setModalConfirmation(true); setAssuranceSelect(item.designation)}}>{item.designation}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Fragment>
        )
    }

    const supprimerAssurance = () => {
        const data = new FormData();
        data.append('supprime', assuranceSelect);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cma/assurances.php');

        req.addEventListener('load', () => {
            setFetch(!fecth);
            fermerModalConfirmation();
        });

        req.send(data);
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

    const formaterDate = (d) => {
        const dat = new Date(d);
        d = d.split('-').reverse().join(('/'));
        return mois(d);
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

    const mois2 = (str) => {

        switch(parseInt(str.substring(5, 7))) {
            case 1:
                return str.substring(8, 10) + " janvier " + str.substring(0, 4);
            case 2:
                return str.substring(8, 10) + " fevrier " + str.substring(0, 4);
            case 3:
                return str.substring(8, 10) + " mars " + str.substring(0, 4);
            case 4:
                return str.substring(8, 10) + " avril " +  str.substring(0, 4);
            case 5:
                return str.substring(8, 10) + " mai " + str.substring(0, 4);
            case 6:
                return str.substring(8, 10) + " juin " + str.substring(0, 4);
            case 7:
                return str.substring(8, 10) + " juillet " + str.substring(0, 4);
            case 8:
                return str.substring(8, 10) + " août " + str.substring(0, 4);
            case 9:
                return str.substring(8, 10) + " septembre " + str.substring(0, 4);
            case 10:
                return str.substring(8, 10) + " octobre " + str.substring(0, 4);
            case 11:
                return str.substring(8, 10) + " novembre " + str.substring(0, 4);
            case 12:
                return str.substring(8, 10) + " décembre " + str.substring(0, 4);
        }
    }

    const fermerModalPatient = () => {
        setModalPatient(false);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    return (
        <section className="commande">
            <Modal
                isOpen={modalPatient}
                style={customStyles4}
                onRequestClose={fermerModalPatient}
                contentLabel="Ajouter patient"
            >
                {contenuModal()}
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>Vous allez supprimer {assuranceSelect} des assurances. voulez-vous continuer ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button  style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>NON</button>
                    <button className="valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={supprimerAssurance}>OUI</button>
                </div>
            </Modal>
            <div className="left-side">
                <div><button style={btn_styles} onClick={() => setModalPatient(true)}>Ajouter</button></div>
                <div style={{lineHeight: '30px'}}>
                    <p>
                        <label htmlFor="">Du : </label>
                        <input type="date" ref={date_select1} />
                    </p>
                    <p>
                        <label htmlFor="">Au : </label>
                        <input type="date" ref={date_select2} />
                    </p>
                    <p>
                        <label htmlFor="">Assurance : </label>
                        <select name="assurance" onChange={(e) => setAssurance(e.target.value)}>
                            {listeAssurances.map(item => (
                                <option value={item.designation}>{item.designation}</option>
                            ))}
                        </select>
                    </p>
                    <button style={btn_styles} onClick={rechercherClient}>rechercher</button>
                </div>
                <p className="search-zone">
                    <input type="text" id="recherche" placeholder="recherchez un client" autoComplete='off' />
                </p>
                <div className="liste-medoc">
                    <h1>Listes des clients</h1>
                    <ul>
                        {listeClients.length > 0 && listeClients.map(item => (
                            <li value={item.id_fac} key={item.id_fac} onClick={(e) => afficherInfos(e, item.nom, item.code_patient, item.frais, item.factures, item.total, item.type_assurance, item.assurance)}>{item.nom}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="right-side">
                <h1>Facture générale</h1>
                {clientSelect.length === 1 && (
                    <div style={{textAlign: 'center', lineHeight: '28px'}}>
                        <div>Nom et prénom : <span style={{fontWeight: '600'}}>{clientSelect[0].nom}</span></div>
                        <div>Code : <span style={{fontWeight: '600'}}>{clientSelect[0].code_patient}</span></div>
                        <div>Couvert par : <span style={{fontWeight: '600'}}>{clientSelect[0].assurance}</span></div>
                        <div>Pourcentage : <span style={{fontWeight: '600'}}>{clientSelect[0].type_assurance}</span></div>
                        <div>Periode : <span style={{fontWeight: '600'}}>{mois2(dateInf)}</span> au <span style={{fontWeight: '600'}}>{mois2(dateSup)}</span></div>
                        <div>Frais matériel : <span style={{fontWeight: '600'}}>{isNaN(clientSelect[0].frais) ? '0 Fcfa' : clientSelect[0].frais + ' Fcfa'}</span></div>
                        <div>Total : <span style={{fontWeight: '600'}}>{clientSelect[0].total + ' Fcfa'}</span></div>
                        <div>Restant à payer : <span style={{fontWeight: '600'}}>{(parseInt(clientSelect[0].total) * (parseInt(clientSelect[0].type_assurance) / 100)) + ' Fcfa'}</span></div>
                    </div>
                )}
                <div className="details-commande">
                    <h1>Imagerie/Laboratoire</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Designation</td>
                                <td>Qte</td>
                                <td>Prix.U</td>
                                <td>Prix.T</td>
                            </tr>
                        </thead>
                        <tbody>
                            {infosClient.map(item => {
                                if (item.categorie !== "pharmacie") {
                                    return (
                                        <tr key={item.id} style={{fontWeight: '600'}}>
                                            <td>{item.designation}</td>
                                            <td>{item.qte}</td>
                                            <td>{item.prix}</td>
                                            <td>{item.prix_total + ' Fcfa' }</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <h1>Pharmacie</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Designation</td>
                                <td>Qte</td>
                                <td>Prix.U</td>
                                <td>Prix.T</td>
                            </tr>
                        </thead>
                        <tbody>
                            {infosClient.map(item => {
                                if (item.categorie === "pharmacie") {
                                    return (
                                        <tr key={item.id} style={{fontWeight: '600'}}>
                                            <td>{item.designation}</td>
                                            <td>{item.qte}</td>
                                            <td>{item.prix}</td>
                                            <td>{item.prix_total + ' Fcfa' }</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <div className="valider-annuler">
                        <ExcelFile element={<button style={{backgroundColor: '#1b9d3f'}} filename="test" fileExtension="xlsx">Exporter</button>}>
                            <ExcelSheet data={service} name="Imagerie-Laboratoire">
                                <ExcelColumn label="DESIGNATION" value={"designation"} />
                                <ExcelColumn label="QUANTITE" value="qte" />
                                <ExcelColumn label="PRIX.U" value="prix" />
                                <ExcelColumn label="PRIX.T" value="prix_total" />
                            </ExcelSheet>
                            <ExcelSheet data={pharmacie} name="Pharmacie">
                                <ExcelColumn label="DESIGNATION" value="designation" />
                                <ExcelColumn label="QUANTITE" value="qte" />
                                <ExcelColumn label="PRIX.U" value="prix" />
                                <ExcelColumn label="PRIX.T" value="prix_total" />
                            </ExcelSheet>
                            <ExcelSheet data={montants} name={"Totaux"}>
                                <ExcelColumn label="total" value="total" />
                                <ExcelColumn label="restant" value="reste" />
                            </ExcelSheet>
                        </ExcelFile>
                        <button id="btn-save" ref={btnSauvegarde} onClick={sauvegarderFacture}>Terminer</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
