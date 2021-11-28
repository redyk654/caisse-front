import React, { Component } from 'react';

const styles = {
    // display: 'flex',
    // justifyContent: 'center',
    fontWeight: '600',
    marginTop: '7px',
    width: '100%',
    // border: '1px solid #333',
}

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '100%',
    marginTop: '15px',
    fontSize: 11
}

export default class Facture extends Component {
    
    mois = (str) => {

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

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '80px'}}>
                <div style={{textTransform: 'uppercase', padding: '15px 135px', fontSize: 7, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
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
                <div style={{fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <div style={{marginTop: 5}}>Fiche de recette du <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.infoRecette ? this.mois(this.props.infoRecette[0].date_heure.substring(0, 11)) : (this.mois(new Date().toLocaleDateString()) + ' ')} à {this.props.infoRecette ? this.props.infoRecette[0].date_heure.substring(11,) : (' ' + new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</span></div>
                        <div style={{textAlign: 'center', marginBottom: 20}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>Services</th>
                                    <th style={table_styles2}>Recettes</th>
                                </thead>
                                <tbody>
                                    {this.props.services ? this.props.services.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{item.service}</td>
                                            <td style={table_styles2}>{item.recetteRestante}</td>
                                        </tr>
                                    )) : this.props.detailsRecette.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{item.categorie}</td>
                                            <td style={table_styles2}>{item.recette_restante}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop: 15}}>Recette totale : <strong>{this.props.infoRecette ? this.props.infoRecette[0].recette_restante + ' Fcfa' : this.props.recetteTotal + ' Fcfa'}</strong></div>
                    </div>
                </div>
            </div>    
        )
    }
}
