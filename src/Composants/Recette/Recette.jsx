import React, { Component } from 'react';

const styles = {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '10px',
    width: '100%',
}

export default class Facture extends Component {
    
    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '80px'}}>
                <div style={{textTransform: 'uppercase', padding: '15px 50px', fontSize: 9, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Ministere de la sante publique</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Delegation regionale du Littoral</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>District sante de Deido</strong></div>
                        <div style={{color: 'black',}}><strong>CMA de Bepanda</strong></div> 
                    </div>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Minister of Public Health</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Littoral regional delegation</strong></div>
                        <div style={{color: 'black', borderBottom: '1px dotted #000'}}><strong>Deido Health District</strong></div>
                        <div style={{color: 'black',}}><strong>Bepanda CMA</strong></div> 
                    </div>
                </div>
                <div style={{fontSize: 13, display: 'flex', justifyContent: 'center', paddingTop: '10px', height: '100vh'}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <h2 style={{color: 'black', background: 'none', marginBottom: '12px'}}>Fiche de recette</h2>
                        <div style={{marginBottom: '5px'}}>Caissier &nbsp;&nbsp;<span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.caissier}</span></div>
                        <div>date <strong>{(new Date().toLocaleDateString())}</strong> heure <strong>{(new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong></div>
                        <div style={styles}>
                            <div>recette du jour</div>
                            <div>{this.props.recette ? this.props.recette + ' Fcfa' : '0 Fcfa'}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
