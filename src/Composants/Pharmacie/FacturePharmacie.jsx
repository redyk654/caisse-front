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
    fontSize: 8,
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
            <div style={{display: 'flex', flexDirection: 'column', width: '85%'}}>
                <div style={{fontSize: 8, backgroundColor: '#fff', height: '50vh', marginLeft: '315px', transform: 'rotate(90deg)'}}>
                    <div style={{textTransform: 'uppercase', padding: '15px -200px', fontSize: 5, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
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
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                        <div style={{textAlign: 'center', width: '310px'}}>
                            <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Pharmacie</h3>
                            <div style={{marginTop: 5}}>Facture N°<span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.idFacture}</span></div>
                            <div style={{marginTop: '5px'}}>Le <strong>{this.mois(this.props.date.substring(0, 10))}</strong> à <strong>{this.props.date.substring(11, 19)}</strong></div>
                            <div style={{marginTop: 5, textTransform: 'capitalize'}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.patient}</span></div>
                            {this.props.assurance !== "aucune" ? (
                                <div style={{marginTop: 3}}>couvert par : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.assurance.toUpperCase()}</span></div>
                            ) : null}
                            <div style={{textAlign: 'center', marginBottom: 20}}>
                                <table style={table_styles}>
                                    <thead>
                                        <th style={table_styles1}>Désignation</th>
                                        <th style={table_styles2}>Pu</th>
                                        <th style={table_styles2}>Qte</th>
                                        <th style={table_styles2}>Total</th>
                                    </thead>
                                    <tbody>
                                        {this.props.medocCommandes.map(item => (
                                            <tr>
                                                <td style={table_styles1}>{item.designation}</td>
                                                <td style={table_styles2}>{parseInt(item.prix_total) / parseInt(item.quantite)}</td>
                                                <td style={table_styles2}>{item.quantite}</td>
                                                <td style={table_styles2}>{item.prix_total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between',}}>
                                <div style={{ lineHeight: '18px'}}>
                                    <div>Total</div>
                                    <div>reduction</div>
                                    <div>Net à payer</div>
                                    <div>Montant versé</div>
                                    <div>Relicat</div>
                                    <div>Reste à payer</div>
                                </div>
                                <div style={{ lineHeight: '18px'}}>
                                    <div><strong>{this.props.prixTotal + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.reduction ? this.props.reduction + ' %' : 0 + '%'}</strong></div>
                                    <div><strong>{this.props.aPayer + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.montantVerse + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.relicat ? this.props.relicat + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.resteaPayer + ' Fcfa'}</strong></div>
                                </div>
                            </div>
                            <div style={{marginTop: '18px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{this.props.caissier}</span></div>
                            <div style={{fontStyle: 'italic', marginTop: '23px'}}> Bonne Guérison !!!</div>
                        </div>
                    </div>
                </div>
                <div style={{fontSize: 8, backgroundColor: '#fff', height: '50vh', marginLeft: '315px', transform: 'rotate(90deg)'}}>
                <div style={{textTransform: 'uppercase', padding: '15px -200px', fontSize: 5, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
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
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '310px'}}>
                        <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Pharmacie</h3>
                        <div style={{marginTop: 5}}>Facture N°<span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.idFacture}</span></div>
                        <div style={{marginTop: '5px'}}>Le <strong>{this.mois(this.props.date.substring(0, 10))}</strong> à <strong>{this.props.date.substring(11, 19)}</strong></div>
                        <div style={{marginTop: 5, textTransform: 'capitalize'}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.patient}</span></div>
                        {this.props.assurance !== "aucune" ? (
                                <div style={{marginTop: 3}}>couvert par : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.assurance.toUpperCase()}</span></div>
                        ) : null}
                        <div style={{textAlign: 'center', marginBottom: 20}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>Désignation</th>
                                    <th style={table_styles2}>Pu</th>
                                    <th style={table_styles2}>Qte</th>
                                    <th style={table_styles2}>Total</th>
                                </thead>
                                <tbody>
                                    {this.props.medocCommandes.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{item.designation}</td>
                                            <td style={table_styles2}>{parseInt(item.prix_total) / parseInt(item.quantite)}</td>
                                            <td style={table_styles2}>{item.quantite}</td>
                                            <td style={table_styles2}>{item.prix_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between',}}>
                            <div style={{ lineHeight: '18px'}}>
                                <div>Total</div>
                                <div>reduction</div>
                                <div>Net à payer</div>
                                <div>Montant versé</div>
                                <div>Relicat</div>
                                <div>Reste à payer</div>
                            </div>
                            <div style={{ lineHeight: '18px'}}>
                                <div><strong>{this.props.prixTotal + ' Fcfa'}</strong></div>
                                <div><strong>{this.props.reduction ? this.props.reduction + ' %' : 0 + '%'}</strong></div>
                                <div><strong>{this.props.aPayer + ' Fcfa'}</strong></div>
                                <div><strong>{this.props.montantVerse + ' Fcfa'}</strong></div>
                                <div><strong>{this.props.relicat ? this.props.relicat + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                                <div><strong>{this.props.resteaPayer + ' Fcfa'}</strong></div>
                            </div>
                        </div>
                        <div style={{marginTop: '18px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{this.props.caissier}</span></div>
                        <div style={{fontStyle: 'italic', marginTop: '23px'}}> Bonne Guérison !!!</div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
