import React from 'react';
import { ArrowDown, ArrowDownLeft, ArrowUp, ArrowUpRight, DownloadCloud, File, FileText } from 'react-feather';
import { Button } from '../Buttons/Buttons';
import { Navbar } from '../Navbar/Navbar';
import { Textbox } from '../Textbox/Textbox';
import Well from '../Well/Well';
import balanceDashboardIcon from './../icons/balance-dashboard.svg';


import transInIcon from './../icons/transaction-in.svg';
import transOutIcon from './../icons/transaction-out.svg';
import cookies from 'react-cookies';

import edinarIcon from './edinar.png';
import virementBancaireIcon from './virement-bancaire.png';
import Footer from '../Footer/Footer';
import { Avatar } from '../Avatar/Avatar';
import DebitCard from '../DebitCard/DabitCard';
import globals from './../var'



class Widget extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ display: 'inline-flex', color: 'white', background: 'black', padding: '15px', borderRadius: '7px', width: '100%', boxSizing: 'border-box' }}>
                <div>
                    <span>{this.props.title}</span>
                    <h2>{this.props.data}</h2>
                </div>
                <div style={{ height: '100px', width: '100px', margin: 'auto', marginRight: '0', borderRadius: '50%' }}>
                    <img src={this.props.icon} />
                </div>
            </div>
        );
    }
}


class Radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: this.props.items }
    }
    render() {
        return (
            <div style={this.props.style}>
                {this.state.items.map(item =>
                    <div style={{ display: 'inline-flex', width: '100%', marginBottom: '5px' }}>
                        <div style={{ width: '13px', height: '13px', backgroundColor: 'white', border: '1px solid #EBEBEB', borderRadius: '50%', margin: 'auto', marginRight: '10px', marginLeft: '0px' }}>

                        </div>
                        <div style={{ boxSizing: 'border-box', padding: '5px', textAlign: 'center', width: '64px', height: '32px', border: '1px solid #EBEBEB', borderRadius: '7px', backgroundColor: 'white' }}>
                            <img src={item.icon} style={{ height: '100%' }} />
                        </div>
                        <div style={{ lineHeight: '1.9', marginLeft: '10px' }}>
                            <span>{item.label}.</span>
                        </div>
                    </div>)}
            </div>
        );
    }
}


class Refill extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ backgroundColor: '#F9FAFC', position: 'absolute', width: '100%', height: '100%' }}>
                <Navbar type='dashboard' page="wallet" />
                <div style={{ width: '400px', margin: 'auto', marginBottom: '100px', marginTop: '50px' }}>
                    <h2>Refill balance</h2>
                    <span>Refill your balance once and spend whenever you need.</span>
                    <div style={{ marginTop: '20px' }}>
                        <label>Amount :</label>
                        <Textbox style={{ width: '100%', marginTop: '10px' }} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <label>Payment method :</label>
                        <Radio items={[{ icon: edinarIcon, label: 'Pay with e-dinar' }, { icon: virementBancaireIcon, label: 'Virement bancaire' }]} style={{ marginTop: '10px' }} />

                    </div>
                    <Button variant="primary" value="Checkout" style={{ width: '100%', marginTop: '20px' }} />
                </div>
                <Footer />
            </div>
        );
    }
}


class Transaction extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ width: '100%', display: 'inline-flex', marginBottom: '10px', borderBottom: '1px solid #0000000a',paddingBottom: '10px'}}>
                <Avatar avatarSquare={true} dim="50px" filename={this.props.data.sender == cookies.load('user_id') ? this.props.data.dest + '.jpg' : this.props.data.sender + '.jpg'} />
                <div style={{ boxSizing: 'border-box', paddingLeft: '10px', margin: 'auto', marginLeft: '0px' }}>
                    <div style={{ display: 'inline-flex' }}>
                        <h4 style={{ margin: '0px', marginRight: '5px' }}>{this.props.data.account_name}</h4>
                        <span style={{ color: '#C7C7C7' }}>{this.props.data.email}</span>
                    </div>
                    <div>
                        <span style={{ color: '#C7C7C7' }}>In-app transaction</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right', margin: 'auto', marginRight: '0px' }}>
                    <h4 style={{ margin: '0px' }}>{this.props.data.sender == cookies.load('user_id') ? <span>-{this.props.data.amount}TND</span> : <span style={{ color: '#2cce44' }}>+{this.props.data.amount}TND</span>}</h4>
                    <span style={{ color: '#C7C7C7' }}>Yesterday 3:01 AM</span>
                </div>
            </div>
        );
    }
}


class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { history: [], lastest_transactions_party: [], currentBalance:NaN }
    }
    componentDidMount() {
        fetch(`${globals.backend_url}/api/transactions/pull?identifier=${cookies.load('user_id')}&limit=5`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    console.log(resp)
                    this.setState({ history: resp.data });
                }
            })

        fetch(`${globals.backend_url}/api/transactions/fetch_last_parties?identifier=${cookies.load('user_id')}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    this.setState({ lastest_transactions_party: resp.data })
                }
            })
    
        // get balance 
        fetch(`${globals.backend_url}/api/getBalance?identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
            .then(res => res.json())
            .then((resp)=>{
                if(resp.status == 'ok'){
                    this.setState({currentBalance:resp.balance})
                }
            })
    }
    render() {
        return (
            <div style={{ backgroundColor: 'rgb(249, 250, 252)', position: 'absolute', width: '100%' }}>
                <Navbar type='dashboard' page="wallet" />
                <div style={{ boxSizing: 'border-box', padding: '25px', display: 'inline-flex', width: '100%' }}>
                    <div style={{ width: '70%', boxSizing: 'border-box', padding: '5px' }}>
                        <div>
                            <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '7px', background: 'linear-gradient(to right, #EF3D49, #F95538)', backgroundImage: `url(${globals.frontend_url}/background.svg)`, backgroundPosition: 'bottom', backgroundSize: 'cover', color: 'white', boxSizing: 'border-box', padding: '30px' }}>

                                <span style={{ textTransform: 'uppercase' }}>My balance :</span>
                                <h1 style={{ color: 'white', fontSize: '40px', marginTop: '10px' }}>{this.state.currentBalance} <sup style={{ fontSize: '20px' }}>TND</sup></h1>

                            </div>
                            <Button style={{ backgroundColor: 'black', color: 'white', paddingRight: '30px', marginTop: '10px', marginRight: '5px' }} value="Send" buttonLeftIcon={<ArrowUp style={{ width: '100%', height: '100%' }} />} />
                            <Button style={{ backgroundColor: 'black', color: 'white', paddingRight: '30px' }} value="Request" buttonLeftIcon={<ArrowDown style={{ width: '100%', height: '100%' }} />} />

                        </div>

                        <Well style={{ marginTop: '10px' }}>

                            <h3>Recent activity</h3>

                            <div style={{}}>
                                {this.state.history.map(item => <Transaction data={item} />)}
                            </div>
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <Button variant="curvy" onClick={this.handleLoadMore} value="Load more" style={{ marginTop: '10px', marginBottom: '10px' }} />
                            </div>

                        </Well>
                    </div>
                    <div style={{ width: '30%', boxSizing: 'border-box', boxSizing: 'border-box', padding: '5px' }}>
                        <Well style={{height:'100%'}}>
                            <div>
                                <h3 style={{ margin: '0px', marginBottom: '10px' }}>Send again :</h3>
                                <div style={{ display: 'inline-flex' }}>
                                    {this.state.lastest_transactions_party.map(item => <Avatar avatarSquare={true} filename={item.dest + '.jpg'} dim="60px" />)}
                                </div>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <h3 style={{ margin: '0px', marginBottom: '10px' }}>Linked payment methods :</h3>

                                <DebitCard holder_name="Hassen Belani" expiration="21/01" serial="XXXX XXXX XXXX XXXX" style={{ width: '100%', height: 'auto' }} />
                                <Button value="Manage my cards" style={{ color: 'black', margin: 'auto', marginTop: '5px' }} />
                            </div>
                            <div style={{ marginTop: '20px', width: '100%' }}>
                                <h3>Cashflow :</h3>
                                <div style={{ width: '100%', display: 'inline-flex', lineHeight: '3' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(to right, #EF3D49, #F95538)', borderRadius: '7px', boxSizing: 'border-box', padding: '10px', strokeWidth: '1.4px', marginRight: '10px' }}>
                                        <FileText style={{ width: '100%', height: '100%', color: 'white', strokeWidth: '1.4' }} />
                                    </div>
                                    <span>Manage invoices</span>
                                </div>
                                <div style={{ marginTop: '5px', width: '100%', display: 'inline-flex', lineHeight: '3' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(to right, #EF3D49, #F95538)', borderRadius: '7px', boxSizing: 'border-box', padding: '10px', strokeWidth: '1.4px', marginRight: '10px' }}>
                                        <ArrowUp style={{ width: '100%', height: '100%', color: 'white', strokeWidth: '1.4' }} />
                                    </div>
                                    <span>Request cashout</span>
                                </div>
                                <div style={{ marginTop: '5px', width: '100%', display: 'inline-flex', lineHeight: '3' }}>
                                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(to right, #EF3D49, #F95538)', borderRadius: '7px', boxSizing: 'border-box', padding: '10px', strokeWidth: '1.4px', marginRight: '10px' }}>
                                        <ArrowDown style={{ width: '100%', height: '100%', color: 'white', strokeWidth: '1.4' }} />
                                    </div>
                                    <span>Refill balance</span>
                                </div>
                            </div>
                        </Well>

                    </div>

                </div>
                <Footer style={{ marginTop: '20px' }} />
            </div>
        )
    }
}

export { Transactions, Refill }