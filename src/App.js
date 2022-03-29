import './App.css';
import { Fragment, useEffect, useState } from 'react';
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Historique from './Composants/Historique/Historique';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';
import GestionRecette from './Composants/GestionRecette/GestionRecette';
import VueRecettes from './Composants/VueRecettes/VueRecettes';
import Pharmacie from './Composants/Pharmacie/Pharmacie';
import Apercu from './Composants/Apercu/Apercu';
import Assurance from './Composants/Assurance/Assurance';
import FacturesAssurances from './Composants/FacturesAssurances/FacturesAssurances';
import Modifier from './Composants/Modifier/Modifier';


function App() {

  const role1 = "admin";
  const role2 = "caissier";
  const role3 = "regisseur";
  const role4 = "secretaire";

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if(role === role3) {
      setOnglet(5);
    } else if (role === role1) {
      setOnglet(3);
    } else if (role === role4) {
      setOnglet(9)
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande nomConnecte={nomConnecte} />
      break;
    case 2:
      contenu = <GestionFactures nomConnecte={nomConnecte} />;
      break;
    case 3:
      contenu = <Historique nomConnecte={nomConnecte} />
      break;
    case 4:
      contenu = <Comptes nomConnecte={nomConnecte} />
      break;
    case 5:
      contenu = <GestionRecette nomConnecte={nomConnecte} />
      break;
    case 6:
      contenu = <VueRecettes nomConnecte={nomConnecte} role={role} />
      break;
    case 7:
      contenu = <Pharmacie nomConnecte={nomConnecte} />
      break;
    case 8:
      contenu = <Apercu nomConnecte={nomConnecte} role={role} />
      break;
    case 9:
      contenu = <Assurance nomConnecte={nomConnecte} />
      break;
    case 10:
      contenu = <FacturesAssurances nomConnecte={nomConnecte} />
      break;
    case 11:
      contenu = <Modifier nomConnecte={nomConnecte} />
      break;
  }

  if (connecter) {
    if(role === role1) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '70%'}}>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Historique</div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>Aperçu</div>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Les états</div>
              <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>Modifier</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role2) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '55%'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Services</div>
              <div className={`tab ${onglet === 7 ? 'active' : ''}`} onClick={ () => {setOnglet(7)}}>Pharmacie</div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>Aperçu</div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Factures-services</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role3) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '70%'}}>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Les états</div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>Aperçu</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Historique</div>
              <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>Modifier</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if(role === role4) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '35%'}}>
            <div className={`tab ${onglet === 9 ? 'active' : ''}`} onClick={ () => {setOnglet(9)}}>Etats assurances</div>
            <div className={`tab ${onglet === 10 ? 'active' : ''}`} onClick={ () => {setOnglet(10)}}>Factures</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      )
    } else {
      return (
        <main className='app'>
          vous n'avez pas le droit d'accéder à cette application
        </main>
      )
    }
  } else {
    return (
      <Connexion
        connecter={connecter}
        setConnecter={setConnecter}
        nomConnecte={nomConnecte}
        setNomConnecte={setNomConnecte}
        role={role}
        setRole={setRole}
      />
    )
  }
}

export default App;