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
    fontSize: 8
}

export default class ImprimerHistorique extends Component {

    extraireCode = (designation) => {
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

    mois2 = (str) => {

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

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '70px'}}>
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
                <div style={{fontSize: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <div style={{marginTop: 5}}>Fiche de recette du <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.infoRecette ? this.mois(this.props.infoRecette[0].date_heure.substring(0, 11)) : (this.mois(new Date().toLocaleDateString()) + ' ')} à {this.props.infoRecette ? this.props.infoRecette[0].date_heure.substring(11,) : (' ' + new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</span></div>
                        <div style={{marginTop: 5}}>Service fait par <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.nomConnecte}</span></div>
                        <div style={{marginTop: 5}}>Du <span style={{fontWeight: '600', marginTop: '15px'}}>{this.mois2(this.props.dateDepart)} à {this.props.dateDepart.substring(10, 13)}h{this.props.dateDepart.substring(14, 16)}min</span> Au <strong>{this.mois2(this.props.dateFin)} à {this.props.dateFin.substring(10, 13)}h{this.props.dateFin.substring(14, 16)}min</strong></div>
                        <div style={{textAlign: 'center', marginBottom: 15}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>Actes</th>
                                    <th style={table_styles2}>Recettes</th>
                                </thead>
                                <tbody>
                                    {this.props.historique.length > 0  ? this.props.historique.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{this.extraireCode(item.designation)}</td>
                                            <td style={table_styles2}>{item.prix_total}</td>
                                        </tr>
                                    )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop: 5}}>Recette : <strong>{this.props.recetteTotal ? this.props.recetteTotal + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                        <div style={{marginTop: 5}}>Matériel : <strong>{this.props.montantFrais ? this.props.montantFrais + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                    </div>
                </div>
            </div>    
        )
    }
}
