import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Buttons/Buttons';
import Switch from '../Switch/Switch';
import { DropDown, TextArea, Textbox } from '../Textbox/Textbox';
import Well from '../Well/Well';
import { Navbar } from './../Navbar/Navbar';

// icons
import lockIcon from './lock.svg';
import creditCardIcon from './credit-card.svg';
import logOutIcon from './log-out.svg';
import userIconWhite from './user-white.svg';
import { CreditCard, Edit, Lock, LogOut, MapPin, User } from 'react-feather';

import cookies from 'react-cookies';
import globals from './../var';


export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentTab: 'general', account_info: { account_name: '', account_type: '', email: '', phone_number: '', bio: '' }, password: '', passwordRepeat: '' }
        this.navigateTab = this.navigateTab.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);

        this.submitBasicChanges = this.submitBasicChanges.bind(this);
        this.submitPasswordChange = this.submitPasswordChange.bind(this);
    }
    componentWillMount() {
        fetch(`${globals.backend_url}/api/fetchAccountInfo?identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    this.setState({ account_info: resp.data });
                    console.log(resp)
                }
            })
    }
    submitBasicChanges() {
        const data = new FormData();
        const fields = {}
        fields['account_name'] = this.state.account_info.account_name;
        fields['email'] = this.state.account_info.email;
        fields['phone_number'] = this.state.account_info.phone_number;
        fields['bio'] = this.state.account_info.bio;
        data.append('identifier', cookies.load('user_id'));
        data.append('session_token', cookies.load('session_token'));
        data.append('fields', JSON.stringify(fields));
        fetch(`${globals.backend_url}/api/changeAccountInfo`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then((resp) => {
                alert(resp.status);
                console.log(resp);
            })
    }
    handleChange(e) {
        try {
            e.preventDefault();
        } catch {

        }
        var account_info = this.state.account_info;
        account_info[e.target.name] = e.target.value;
        this.setState({ account_info: account_info }, () => {
            console.log(this.state.account_info);
        });
    }
    handleChange2(event) {
        try {
            event.preventDefault();
        } catch {

        }
        this.setState({ [event.target.name]: event.target.value });
    }
    navigateTab(tabID) {
        this.setState({ currentTab: tabID })
    }
    submitPasswordChange() {
        if (this.state.password != this.state.passwordRepeat) {
            alert('Please retype your password correctly!')
        } else {
            const data = new FormData();
            data.append('identifier', cookies.load('user_id'));
            data.append('session_token', cookies.load('session_token'));
            data.append('password', this.state.password);
            fetch(`${globals.backend_url}/api/changeAccountPassword`, {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then((resp) => {
                    console.log(resp)
                    if(resp.status == 'ok'){
                        alert('Password changed successfully!')
                    }
                })


        }
    }

    render() {
        return (
            <div style={{ backgroundColor: '#F9FAFC', position: 'absolute', width: '100%', height: '100%' }}>
                <Navbar type="dashboard" />
                <div style={{ display: 'inline-flex', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                    <div style={{ width: '30%', boxSizing: 'border-box', padding: '15px' }}>
                        <Well style={{ textAlign: 'center' }}>
                            <div style={{width:'100%'}} >
                                <Avatar style={{margin:'auto', width:'max-content'}} dim={100} filename={cookies.load('user_id') + '.jpg'} showEdit={true} />
                            </div>
                            <h3 style={{ margin: '0px' }}>{this.state.account_info.account_name}</h3>
                            <span>{this.state.account_info.account_type}</span>
                            <div style={{ marginTop: '20px' }}>
                                <Button onClick={() => this.navigateTab('general')} variant={(this.state.currentTab == "general") && "primary"} buttonLeftIcon={<User style={{ width: '100%', height: '100%' }} />} value="General information" style={{ width: '100%', marginBottom: '5px' }} />
                                <Button onClick={() => this.navigateTab('security')} variant={(this.state.currentTab == "security") && "primary"} buttonLeftIcon={<Lock style={{ width: '100%', height: '100%' }} />} value="Security" style={{ width: '100%', marginBottom: '5px' }} />
                                <Button onClick={() => this.navigateTab('payment')} variant={(this.state.currentTab == "payment") && "primary"} buttonLeftIcon={<CreditCard style={{ width: '100%', height: '100%' }} />} value="Payment" style={{ width: '100%', marginBottom: '5px' }} />
                            </div>
                        </Well>
                    </div>
                    <div style={{ width: '70%', boxSizing: 'border-box', padding: '15px' }}>
                        {(this.state.currentTab == 'general') && <Well>
                            <h2>General information</h2>
                            <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '10px', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Account name : </label>
                                    <Textbox name="account_name" onChange={this.handleChange} value={this.state.account_info.account_name} style={{ width: '100%', marginTop: '5px' }} />
                                </div>
                                <div style={{ width: '50%', boxSizing: 'border-box', paddingLeft: '10px', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Email address : </label>
                                    <Textbox name="email" onChange={this.handleChange} value={this.state.account_info.email} style={{ width: '100%', marginTop: '5px' }} />
                                </div>

                                <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '10px', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Phone number : </label>
                                    <Textbox name="phone_number" onChange={this.handleChange} value={this.state.account_info.phone_number} style={{ width: '100%', marginTop: '5px' }} />
                                </div>


                                <div style={{ width: '50%', boxSizing: 'border-box', paddingLeft: '10px', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Residency : </label>
                                    <DropDown value="Tunisia" style={{ width: '100%', marginTop: '5px' }} data={['Tunisia']} />
                                </div>
                                <div style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Bio : </label>
                                    <TextArea name="bio" onChange={this.handleChange} value={this.state.account_info.bio} style={{ width: '100%', height: '150px', marginTop: '5px' }} />
                                </div>
                            </div>
                            <div style={{ width: '100%', textAlign: 'right' }} >
                                <Button value="Reset" variant="transparent" style={{ marginRight: '5px' }} />
                                <Button value="Save" variant="primary" onClick={this.submitBasicChanges} />
                            </div>
                        </Well>}

                        {(this.state.currentTab == "security") && <Well>
                            <h2>Security settings</h2>
                            <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '100%', boxSizing: 'border-box', paddingRight: '10px', marginBottom: '10px' }}>
                                    <h3>Change password :</h3>
                                    <label style={{ color: '#484848' }}>Password : </label>
                                    <Textbox name="password" onChange={this.handleChange2}  type="password" style={{ width: '100%', marginTop: '5px', marginBottom: '20px' }} />
                                    <label style={{ color: '#484848' }}>Repeat Password : </label>
                                    <Textbox name="passwordRepeat" onChange={this.handleChange2} type="password" style={{ width: '100%', marginTop: '5px' }} />

                                </div>

                                <div style={{ width: '50%', boxSizing: 'border-box', paddingRight: '10px', marginBottom: '10px' }}>
                                    <h3>Two factor authentication :</h3>

                                    <Switch label="Activate two-factor authentication." />
                                </div>
                            </div>
                            <div style={{ width: '100%', textAlign: 'right' }} >
                                <Button value="Reset" variant="transparent" />
                                <Button value="Save" variant="primary" onClick={this.submitPasswordChange} />
                            </div>


                        </Well>}

                        {(this.state.currentTab == "payment") && <Well>
                            <h2>Payment & Documents</h2>
                            <div style={{ width: '100%', display: 'inline-flex', flexWrap: 'wrap' }}>
                                <div style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>Payment method : </label>
                                    <DropDown data={['Virement bankaire', 'E-dinar', 'Mandat', 'Flouci', 'Sobflous']} style={{ width: '100%', marginTop: '5px' }} />
                                </div>
                                <div style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}>
                                    <label style={{ color: '#484848' }}>RIB account : </label>
                                    <Textbox style={{ width: '100%', marginTop: '5px' }} />
                                </div>
                                <div style={{ width: '100%', textAlign: 'right' }} >
                                    <Button value="Reset" variant="transparent" />
                                    <Button value="Save" variant="primary" />
                                </div>
                            </div>
                        </Well>}
                    </div>
                </div>

            </div>
        );
    }
}