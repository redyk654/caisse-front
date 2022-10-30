import React, { useEffect, useState, useRef } from 'react';
import '../Commande/Commande.css';

const btn_styles = {
    backgroundColor: '#6d6f94', 
    width: '50%', 
    height: '4vh', 
    color: '#fff', 
    fontSize: '17px', 
    margin: 5, 
    cursor: 'pointer',
}

export default function FacturesAssurances() {

    let date_select1 = useRef();
    let date_select2 = useRef();

    const [listeClients, setListeClients] = useState([]);
    const [listeClientsSauvegarde, setListeClientsSauvegarde] = useState([]);
    const [assurance, setAssurance] = useState('assuretous');
    const [clientSelect, setClientSelect] = useState([]);
    const [infosClient, setInfosClient] = useState([]);

    useEffect(() => {
        if(clientSelect.length === 1) {
            const req = new XMLHttpRequest();
            req.open('GET', `http://localhost/backend-cma/gestion_assurance.php?id_general=${clientSelect[0].id_facture}`);
            req.addEventListener('load', () => {

                const result = JSON.parse(req.responseText);
                result.length === 0 && setInfosClient([]);
                let result2 = [];
                let i = 0;
                result.forEach(item => {
                    const req2 = new XMLHttpRequest();
                    req2.open('GET', `http://localhost/backend-cma/gestion_assurance.php?facture=${item.id_facture}`);
            
                    req2.addEventListener('load', () => {
                        i++;
                        result2 = [...result2, ...JSON.parse(req2.responseText)];
                        if (result.length === i) {
                            result2 = traiterDoublons(result2);
                            result2.map(item => {
                                if (item.categorie !== "pharmacie") {
                                    let des = extraireCode(item.designation);
    
                                    Object.defineProperty(item, 'designation', {
                                        value: des,
                                        configurable: true,
                                        enumerable: true,
                                    });
                                }
                            });
                            setInfosClient(result2);
                        }
                    });
            
                    req2.send();
                    
                })
            });

            req.send();
        }
    }, [clientSelect])

    useEffect(() => {
        // Récupération des clients
        const req = new XMLHttpRequest();
        req.open('GET', `http://localhost/backend-cma/gestion_assurance.php?facture_fait=oui`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeClients(result);
            setListeClientsSauvegarde(result);
        });

        req.send();
        
    }, []);

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
        const data = new FormData();
        data.append('assurance', assurance);
        data.append('statu', 'done');

        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/gestion_assurance.php?categorie=service');

        req.addEventListener('load', () => {
            let result = [...JSON.parse(req.responseText)];

            const req2 = new XMLHttpRequest();
            req2.open('POST', 'http://localhost/backend-cma/gestion_assurance.php?categorie=pharmacie');
            req2.addEventListener('load', () => {
                result = [...result, ...JSON.parse(req2.responseText)];
                traiterData(result);
            });

            req2.send(data);
        });

        req.send(data);
    }

    const traiterData = (result) => {
        const clients = [];
        const listeProvisoiresClient = []
        result.forEach(item => {
            if (clients.indexOf(item.patient) === -1) {
                clients.push(item.patient);
                listeProvisoiresClient.push({id_fac: item.id_fac, nom: item.patient, factures: [item.id], total: parseInt(item.prix_total), type_assurance: item.type_assurance})
            } else {
                listeProvisoiresClient.forEach(item2 => {
                    if (item.patient === item2.nom){
                        item2.factures.push(item.id);
                        item2.total += parseInt(item.prix_total);
                    }
                })
            }
        });

        setListeClients(listeProvisoiresClient);
        setListeClientsSauvegarde(listeProvisoiresClient);
    }

    const filtrerListe = (e) => {
        setListeClients(listeClientsSauvegarde.filter(item => (item.nom.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)));
    }

    const afficherInfos = (e, id_facture, nom, code_patient, total, type_assurance, periode) => {
        setClientSelect([{nom: nom, code_patient: code_patient, id_facture: id_facture, total: total, type_assurance: type_assurance, periode: periode,}]);
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

    return (
        <section className="commande">
            <div className="left-side">
                <p className="search-zone">
                    <input type="text" id="recherche" placeholder="recherchez un client" autoComplete='off' onChange={(e) => filtrerListe(e)} />
                </p>
                <div className="liste-medoc">
                    <h1>Listes des clients</h1>
                    <ul>
                        {listeClients.length > 0 && listeClients.map(item => (
                            <li value={item.id} key={item.id_fac} onClick={(e) => afficherInfos(e, item.id_facture, item.nom, item.code_patient, item.total, item.assurance_type, item.periode)}>{item.nom}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="right-side">
                <h1>Facture générale</h1>
                {clientSelect.length === 1 && (
                    <div style={{textAlign: 'center', lineHeight: '28px'}}>
                        <div>Nom : <span style={{fontWeight: '600'}}>{clientSelect[0].nom}</span></div>
                        <div>Code : <span style={{fontWeight: '600'}}>{clientSelect[0].code_patient}</span></div>
                        <div>Couvert par : <span style={{fontWeight: '600'}}>{assurance}</span></div>
                        <div>Pourcentage : <span style={{fontWeight: '600'}}>{clientSelect[0].type_assurance}</span></div>
                        <div>Periode <span style={{fontWeight: '600'}}>{clientSelect[0].periode}</span></div>
                        <div>Total : <span style={{fontWeight: '600'}}>{clientSelect[0].total + ' Fcfa'}</span></div>
                        <div>Payé par assurance : <span style={{fontWeight: '600'}}>{(parseInt(clientSelect[0].total) * (parseInt(clientSelect[0].type_assurance) / 100)) + ' Fcfa'}</span></div>
                        <div>Restant à payer : <span style={{fontWeight: '600'}}>{'0 Fcfa'}</span></div>
                    </div>
                )}
                <div className="details-commande">
                    <h1>Imagerie/Laboratoire</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Designation</td>
                                <td>Prix</td>
                            </tr>
                        </thead>
                        <tbody>
                            {infosClient.map(item => {
                                if (item.categorie !== "pharmacie") {
                                    return (
                                        <tr key={item.id} style={{fontWeight: '600'}}>
                                            <td>{item.designation}</td>
                                            <td>{item.prix + ' Fcfa' }</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <h1>Médicaments</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Designation</td>
                                <td>Qte</td>
                                <td>Pu</td>
                                <td>Prix total</td>
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
                </div>
            </div>
        </section>
    )
}
