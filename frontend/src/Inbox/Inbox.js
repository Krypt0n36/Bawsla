import React from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Modal } from 'react-responsive-modal';
import Well from '../Well/Well'
import { TextArea, Textbox } from '../Textbox/Textbox';
import SearchIcon from './../icons/inbox-search-icon.svg'
import { Button } from '../Buttons/Buttons'
import SendIcon from './../icons/send-inbox.svg';
import cookies from 'react-cookies';
import chatIllustration from './../illustrations/chat.svg';
import './Chat.css';
import { Avatar } from '../Avatar/Avatar';
import vaultIllus from './../illustrations/vault.svg';
import { FilePicker } from 'react-file-picker';

import mediaIcon from './media.svg';
import recvIcon from './recieve.svg';
import sendIcon from './send.svg';
import signatureIcon from './signature.svg';
import calendarIcon from './calendar.svg';
import addIcon from './plus.svg';
import Alert from '../Alert/Alert';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Calendar, Edit, Edit2, Image, Phone, Plus, Search, Send } from 'react-feather';
import globals from './../var';




class SendMoney extends React.Component {
    constructor(props) {
        super(props)
        this.state = { step: 1 }
        this.handleNext = this.handleNext.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        try {
            event.preventDefault();
        } catch {

        }
        console.log(event.target.name + ' = ' + event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    }
    handleNext() {
        if (this.state.step == 1) {
            // Negative amound exception
            if (parseInt(this.state.amount) <= 0) {
                alert("Invalid amound");
            } else {
                fetch(`${globals.backend_url}/api/getBalance?identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
                    .then(res => res.json())
                    .then((resp) => {
                        console.log(resp)
                        if (resp.status == 'ok') {
                            if (parseInt(resp.balance) >= this.state.amount) {
                                // valid
                                this.setState({ step: this.state.step + 1 });
                            } else {
                                alert('Unsufficient funds!')
                            }
                        } else {
                            alert('Error while pulling balance info.')
                        }
                    })
            }
        }
        else if (this.state.step == 2) {
            // verify password
            const data = new FormData();
            data.append('identifier', cookies.load('user_id'));
            data.append('session_token', cookies.load('session_token'))
            data.append('password', this.state.password);
            fetch(`${globals.backend_url}/api/checkPassword`, {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then((resp) => {
                    console.log(resp)
                    if (resp.status == 'ok') {
                        // make transaction

                        const data = new FormData();
                        data.append('identifier', cookies.load('user_id'));
                        data.append('session_token', cookies.load('session_token'));
                        data.append('dest_id', this.props.currentParty.id);
                        data.append('password', this.state.password);
                        data.append('amount', this.state.amount);
                        data.append('description', this.state.description);

                        fetch(`${globals.backend_url}/api/transactions/make`, {
                            method: 'POST',
                            body: data
                        })
                            .then(res => res.json())
                            .then((resp) => {
                                if (resp.status == 'ok') {
                                    this.setState({ step: this.state.step + 1 });
                                } else {
                                    alert('Error while making transaction, check console.')
                                    console.log(resp)
                                }
                            })

                    } else {
                        alert('error in password validation.')
                        console.log(resp);
                        this.setState({ error: { message: 'Invalid password!' } });
                    }
                })
        }
    }


    render() {
        let Compo;
        if (this.state.step == 1) {
            Compo = <div style={{ boxSizing: 'border-box', padding: '20px' }}>
                <div style={{ width: '100%', marginBottom: '10px' }}>
                    <label>Send to :</label>
                    <div style={{ display: 'inline-flex', width: '100%', marginTop: '5px' }}>
                        <Avatar dim='50px' filename='avatar-01.jpg' />
                        <div style={{ paddingLeft: '10px' }}>
                            <h4 style={{ margin: '0px', marginTop: '4px' }}>{this.props.currentParty.account_name}</h4>
                            <span style={{ color: '#0000006b' }}>{this.props.currentParty.email}</span>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', marginBottom: '10px' }}>
                    <label>Amount :</label>
                    <Textbox name="amount" onChange={this.handleChange} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <div style={{ width: '100%', marginBottom: '10px' }}>
                    <label>Description :</label>
                    <TextArea name="description" onChange={this.handleChange} style={{ width: '100%', minHeight: '150px', marginTop: '5px' }} />
                </div>
            </div>
        }
        else if (this.state.step == 2) {
            Compo = <div style={{ boxSizing: 'border-box', padding: '20px' }}>
                <div style={{ width: '150px', height: '150px', backgroundColor: '#353C6A', borderRadius: '50%', margin: 'auto', boxSizing: 'border-box', padding: '30px' }}>
                    <img src={vaultIllus} style={{ height: '100%' }} />
                </div>
                <div style={{ width: '100%', marginBottom: '10px', textAlign: 'center' }}>
                    <h3>Identity verification</h3>
                </div>

                <div style={{ width: '100%', marginBottom: '10px' }}>
                    <label>Password :</label>
                    <Textbox name="password" onChange={this.handleChange} type="password" style={{ width: '100%', marginTop: '5px' }} />
                </div>
                {this.state.error && <Alert style={{ width: '100%', marginTop: '5px' }} variant="error">{this.state.error.message}</Alert>}
            </div>
        }
        else if (this.state.step == 3) {
            Compo = <div style={{ boxSizing: 'border-box', padding: '20px' }}>
                <div style={{ width: '100px', height: '100px', backgroundColor: '#69F0AE', borderRadius: '50%', margin: 'auto', boxSizing: 'border-box', padding: '30px' }}>

                </div>
                <div style={{ width: '100%', marginBottom: '10px', textAlign: 'center' }}>
                    <h3>Money has been sent successfully!</h3>
                </div>
                <table>
                    <tr style={{ marginBottom: '10px' }}>
                        <td>
                            <span>From : </span>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                            <h4 style={{ margin: '0px' }}>{cookies.load('account_name')}</h4>
                            <span>belani.hassen@bawsla.net</span>
                        </td>
                    </tr>
                    <tr style={{ marginBottom: '10px' }}>
                        <td>
                            <span>To : </span>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                            <h4 style={{ margin: '0px' }}>{this.props.currentParty.account_name}</h4>
                            <span>{this.props.currentParty.email}</span>
                        </td>
                    </tr>
                    <tr style={{ marginBottom: '10px' }}>
                        <td>
                            <span>Amount : </span>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                            <h4 style={{ margin: '0px', color: '#FC454B' }}>{this.state.amount} TND</h4>
                        </td>
                    </tr>
                    <tr style={{ marginBottom: '10px' }}>
                        <td>
                            <span>Description : </span>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                            <span>
                                {this.state.description}
                            </span>
                        </td>
                    </tr>
                    <tr >
                        <td>
                            <span>Date : </span>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                            <span>
                                23/07/2001 12:21
                            </span>
                        </td>
                    </tr>

                </table>
            </div>
        }
        return (
            <div style={{ borderRadius: '7px', width: '500px', height: '530px', position: 'relative' }}>
                <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'white' }}>Transfer Money</h2>
                </div>
                {Compo}
                <div style={{ boxSizing: 'border-box', padding: '20px', position: 'absolute', width: '100%', bottom: '0px' }}>
                    <Button variant="primary" value={"Send" + (this.state.amount ? ' ' + this.state.amount + ' TND' : '')} onClick={this.handleNext} style={{ width: '100%' }} />
                </div>
            </div>
        );
    }
}


class RequestMoney extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ borderRadius: '7px', width: '500px', height: '530px', position: 'relative' }}>
                <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'white' }}>Request Money</h2>
                </div>
                <div style={{ boxSizing: 'border-box', padding: '20px' }}>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <label>Request from :</label>
                        <div style={{ display: 'inline-flex', width: '100%', marginTop: '5px' }}>
                            <Avatar dim='50px' filename='avatar-01.jpg' />
                            <div style={{ paddingLeft: '10px' }}>
                                <h4 style={{ margin: '0px', marginTop: '4px' }}>Hassen Belani</h4>
                                <span style={{ color: '#0000006b' }}>belani.hassen@bawsla.net</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <label>Amount :</label>
                        <Textbox style={{ width: '100%', marginTop: '5px' }} />
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <label>Description :</label>
                        <TextArea style={{ width: '100%', minHeight: '150px', marginTop: '5px' }} />
                    </div>
                </div>
                <div style={{ boxSizing: 'border-box', padding: '20px', position: 'absolute', width: '100%', bottom: '0px' }}>
                    <Button variant="primary" value="Create request" style={{ width: '100%' }} />
                </div>
            </div>
        );
    }
}


class SendDoc extends React.Component {
    render() {
        return (
            <div style={{ borderRadius: '7px', width: '500px', height: '530px', position: 'relative' }}>
                <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: 'white' }}>Request Signature</h2>
                </div>
                <div style={{ boxSizing: 'border-box', padding: '20px' }}>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <label>Document Title :</label>
                        <Textbox style={{ width: '100%', marginTop: '5px' }} />
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <label>Description :</label>
                        <TextArea style={{ width: '100%', minHeight: '150px', marginTop: '5px' }} />
                    </div>
                    <FilePicker
                        extensions={["pdf"]} // Notice that I removed the "."

                        onError={errMsg => console.log(errMsg)} // Please handle error
                    >
                        <div style={{ width: '100%', backgroundColor: '#FEEFF0', borderRadius: '7px', paddingTop: '20px', paddingBottom: '20px', border: '2px dashed #EF3D49', textAlign: 'center' }}>
                            <span style={{ color: '#484848' }}>Drag & Drop or <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'black' }}>Browse</span></span>
                        </div>
                    </FilePicker>

                </div>
                <div style={{ boxSizing: 'border-box', padding: '20px', position: 'absolute', width: '100%', bottom: '0px' }}>
                    <Button variant="primary" value="Create request" style={{ width: '100%' }} />
                </div>
            </div>
        );
    }
}


class Contact extends React.Component {
    render() {
        return (
            <div style={{ display: 'inline-flex', width: '100%', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #EBEBEB' }} onClick={() => this.props.clickEvent(this.props.uid)}>
                <Avatar dim="50px" filename={this.props.uid + '.jpg'} />
                <div style={{ paddingLeft: '10px', marginTop: '5px' }}>
                    <div style={{width:'100%', display:'inline-flex'}}>
                        <h4 style={{ margin: '0px', color: 'black', fontWeight: 'bold' }}>{this.props.account_name}</h4>
                    </div>
                    <span style={{ fontSize: '14px', color: '#A3A3A3' }}>{(this.props.lastMsgSender == cookies.load('user_id')) && 'You : '}{this.props.lastMsg}</span>
                </div>
            </div>
        );
    }
}

class Bubble extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (this.props.sender == cookies.load('user_id')) { // other party 
            if (this.props.type == 'message') {
                return (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <div style={{
                            backgroundColor: 'black', color: 'white', boxSizing: 'border-box', padding: '10px', borderRadius: '7px',
                            borderTopRightRadius: '0px', width: 'max-content', margin: 'auto', marginRight: '0px', marginBottom: '5px'
                        }}>
                            {this.props.body}
                        </div>
                    </div>
                );
            } else if (this.props.type == 'money') {
                return (
                    <div style={{
                        backgroundColor: 'black', color: 'white', boxSizing: 'border-box', padding: '10px 30px 10px 10px', borderRadius: '7px',
                        borderTopRightRadius: '0px', width: 'max-content', margin: 'auto', marginRight: '0px', marginBottom: '5px',
                    }}>
                        <div style={{ display: 'inline-flex' }}>
                            <div style={{ width: '50px', height: '50px', backgroundColor: '#1F1F1F', borderRadius: '7px' }}>
                                <ArrowUpRight style={{ width: '100%', height: '100%', strokeWidth: '1.4' }} />
                            </div>
                            <div style={{ paddingLeft: '10px' }}>
                                <h4 style={{ margin: '0px' }}>You just sent</h4>
                                <span>{this.props.amount} TND</span>
                            </div>
                        </div>
                    </div>
                );
            }

        } else {
            if (this.props.type == 'message') {
                return (
                    <div style={{
                        background: 'linear-gradient(to right, #EF3D49, #F95538)'
                        , color: 'white', boxSizing: 'border-box', padding: '10px', borderRadius: '7px',
                        borderTopLeftRadius: '0px', width: 'max-content', marginBottom: '5px'
                    }}>
                        {this.props.body}
                    </div>
                );
            }
            else if (this.props.type == 'money') {
                return (
                    <div style={{
                        background: 'linear-gradient(to right, #EF3D49, #F95538)', color: 'white', boxSizing: 'border-box', padding: '10px 30px 10px 10px', borderRadius: '7px',
                        borderTopLeftRadius: '0px', width: 'max-content', marginBottom: '5px',
                    }}>
                        <div style={{ display: 'inline-flex' }}>
                            <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '7px' }}>
                                <ArrowDownLeft style={{ width: '100%', height: '100%', strokeWidth: '1.4' }} />
                            </div>
                            <div style={{ paddingLeft: '10px' }}>
                                <h4 style={{ margin: '0px' }}>You just recieved</h4>
                                <span>{this.props.amount} TND</span>
                            </div>
                        </div>
                    </div>
                );

            }
        }

    }
}


class Contacts extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Well style={{ height: '100%', borderRadius: '7px', borderRight: '0px' }} >
                <Textbox placeholder="Search in contacts.." style={{ width: '100%', marginBottom: '20px' }} icon={<Search style={{ height: '100%', width: '100%', color: '#a5a5a5' }} />} />
                <div>
                    {this.props.contacts.map(item => <Contact uid={item['id']} clickEvent={this.props.selectContact} account_name={item['account_name']} lastMsg={item['lastMsg']} lastMsgSender={item['lastMsgSender']} uid={item['id']} />)}
                </div>
            </Well>
        );
    }
}

class Conversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalContent: <SendMoney />, modalOpen: false, kitIsHidden: true };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleKit = this.toggleKit.bind(this)
        this.markAsSeen = this.markAsSeen.bind(this)
        this.convoRef = React.createRef();
    }
    markAsSeen() {
        const data = new FormData();
        data.append('identifier', cookies.load('user_id'));
        data.append('session_token', cookies.load('session_token'));
        data.append('party_id', this.props.currentParty.id);
        fetch(`${globals.backend_url}/api/chat/mark-as-seen`, {
            method: 'POST',
            body: data
        })
    }
    componentDidMount() {
        if (this.props.currentParty.id != null) {
            this.markAsSeen()
        }

    }
    toggleKit() {
        this.setState({ kitIsHidden: !this.state.kitIsHidden })
    }
    openModal(compo) {
        this.setState({ modalContent: compo, modalOpen: true });
    }
    closeModal() {
        this.setState({ modalOpen: false });
    }
    render() {
        if (this.props.currentParty.id != null) {
            return (
                <div onMouseEnter={this.markAsSeen} style={{ background: 'white', height: '100%', position: 'relative', borderRadius: '7px' }}>
                    <div style={{ display: 'inline-flex', width: '100%', boxSizing: 'border-box', padding: '10px 15px 10px 15px', borderBottom: '1px solid #EBEBEB', background: 'white', top: '0px', borderTopLeftRadius: '7px', borderTopRightRadius: '7px' }}>
                        <Avatar dim="50px" filename={this.props.currentParty.id + '.jpg'} />
                        <div style={{ paddingLeft: '10px', marginTop: '5px' }}>
                            <h3 style={{ margin: '0px', color: 'black' }}>{this.props.currentParty.account_name}</h3>
                            <span style={{ fontSize: '14px', color: '#17D67E' }}>Online</span>
                        </div>
                        <div style={{margin:'auto', marginRight:'0px'}}>
                        <Button variant="transparent curvy" buttonCenterIcon={<Phone style={{width:'100%', height:'100%'}} />} />

                            <Button variant="transparent curvy" buttonCenterIcon={<AlertCircle style={{width:'100%', height:'100%'}} />} />
                        </div>
                    </div>
                    <div style={{ padding: '15px 15px 0px 15px', overflowX: 'scroll', height: '72%' }} ref={this.convoRef}>
                        {this.props.currentConvo.map((item, index) => item.type == 'message' ? <Bubble sender={item.sender} body={item.body} seen={item.seen} last={this.props.currentConvo.length == index - 1} type="message" /> : <Bubble sender={item.sender} amount={item.amount} type="money" />)}
                    </div>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box', padding: '10px 15px 10px 15px', borderTop: '1px solid #EBEBEB', position: 'absolute', bottom: '0px', backgroundColor: 'white' }}>
                        <div style={{ width: '100%', marginBottom: '10px', display: this.state.kitIsHidden == true ? 'none' : 'inline-flex' }} >
                            <div style={{ width: '20%' }}>
                                <Button buttonLeftIcon={<Image style={{ width: '100%', height: '100%' }} />} variant="transparent" innerPadding='15px' value="Send media" style={{ width: '100%' }} />
                            </div>
                            <div style={{ width: '20%' }}>
                                <Button buttonLeftIcon={<ArrowUpRight style={{ width: '100%', height: '100%' }} />} innerPadding='12px' variant="transparent" value="Send money" onClick={() => { this.openModal(<SendMoney step={1} currentParty={this.props.currentParty} />) }} style={{ width: '100%' }} />
                            </div>
                            <div style={{ width: '20%' }}>
                                <Button buttonLeftIcon={<ArrowDownLeft style={{ width: '100%', height: '100%' }} />} innerPadding='12px' variant="transparent" value="Request money" onClick={() => { this.openModal(<RequestMoney />) }} style={{ width: '100%' }} />
                            </div>
                            <div style={{ width: '20%' }}>
                                <Button buttonLeftIcon={<Calendar style={{ width: '100%', height: '100%' }} />} innerPadding='15px' variant="transparent" value="Set appointment" style={{ width: '100%' }} />

                            </div>
                            <div style={{ width: '20%' }}>
                                <Button buttonLeftIcon={<Edit2 style={{ width: '100%', height: '100%' }} />} innerPadding='15px' variant="transparent" value="Request signature" onClick={() => { this.openModal(<SendDoc />) }} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ width: '100%', display: 'inline-flex', borderBottomLeftRadius: '7px', borderBottomRightRadius: '7px' }}>
                            <Textbox placeholder="Aaa.." value={this.props.composer} name="composer" onChange={this.props.handleChange} style={{ width: '100%', backgroundColor: '#F8F8F8', border: 'none' }} button={<Button variant="transparent" onClick={this.props.sendMessage} innerPadding="5px" buttonCenterIcon={<Send style={{ height: '100%', width: '100%' }} />} style={{ width: '30px', height: '30px' }} />} button2={<Button variant="transparent" onClick={this.toggleKit} innerPadding="5px" buttonCenterIcon={<Plus style={{ height: '100%', width: '100%' }} />} style={{ width: '30px', height: '30px' }} />} />
                        </div>


                    </div>
                    <Modal open={this.state.modalOpen} onClose={this.closeModal} center style={{ padding: '0px' }}>
                        {this.state.modalContent}
                    </Modal>
                </div>
            );
        } else {
            return (
                <div style={{ boxSizing: 'border-box', padding: '5%', background: 'white', height: '100%', position: 'relative', borderRadius: '7px', textAlign: 'center' }}>
                    <h2>Inbox</h2>
                    <h4 style={{ fontWeight: 'normal', color: '#232E43' }}>Please be kind and respectful while chatting with your customers.</h4><br></br>
                    <img src={chatIllustration} style={{ width: '50%', margin: 'auto' }} />
                </div>
            );
        }

    }
}



export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { audio: new Audio(`${globals.frontend_url}/tone.mp3`), play: false, contacts: [], currentParty: { id: null, account_name: null, status: null }, currentConvo: [], composer: '' }
        this.handleChange = this.handleChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.selectContact = this.selectContact.bind(this)
        this.tonePlay = this.tonePlay.bind(this)
    }


    componentDidMount() {
        this.state.audio.addEventListener('ended', () => this.setState({ play: false }));
    }

    componentWillUnmount() {
        this.state.audio.removeEventListener('ended', () => this.setState({ play: false }));
    }

    tonePlay = () => {
        this.setState({ play: true }, () => {
            this.state.audio.play()
        });
    }
    selectContact(uid) {
        fetch(`${globals.backend_url}/api/chat/getAccountDetails?id=${uid}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    var data = {
                        id: uid,
                        account_name: resp.data.account_name,
                        email: resp.data.email,
                        status: 'online'
                    }
                    this.setState({ currentParty: data }, () => {
                        this.pullChat();
                    });
                } else {
                    // account not found!
                    window.location = '/';
                }
            })
            .catch((r) => {
                alert(r)
            })
    }
    navigate2contact(uid) {
        window.location = `/dashboard/inbox/${uid}`
    }
    pullContacts() {
        fetch(`${globals.backend_url}/api/chat/recentConvos?uid=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    if ((this.state.contacts.length > 0) && (this.state.contacts[0].lastMsg != resp.data[0].lastMsg) && (resp.data[0].lastMsgSender != cookies.load('user_id'))) {
                        //alert('new message')
                        this.tonePlay();
                    }
                    this.setState({ contacts: resp.data });
                } else {
                    alert('ERROR CHECK CONSOLE')
                }
            })
            .catch((e) => {
                alert(e)
            })
    }
    sendMessage() {
        const data = new FormData();
        var msg = this.state.composer;
        this.setState({ composer: '' })
        data.append('senderId', cookies.load('user_id'));
        data.append('destId', this.state.currentParty.id);
        data.append('body', msg);
        fetch(`${globals.backend_url}/api/chat/push`, {
            method: 'POST',
            body: data,
        }).then(res => res.json())
            .then((resp) => {
                console.log(resp);
            })

    }
    pullChat() {
        if (this.state.currentConvo.length == 0) {
            var url = `${globals.backend_url}/api/chat/pull?senderId=${cookies.load('user_id')}&destId=${this.state.currentParty.id}&marker=0&session_token=${cookies.load('session_token')}`;
        } else {
            var marker = this.state.currentConvo[this.state.currentConvo.length - 1].id;
            var url = `${globals.backend_url}/api/chat/pull?senderId=${cookies.load('user_id')}&destId=${this.state.currentParty.id}&marker=${marker}&session_token=${cookies.load('session_token')}`;
        }
        fetch(`${globals.backend_url}/api/chat/pull?senderId=${cookies.load('user_id')}&destId=${this.state.currentParty.id}&marker=0&session_token=${cookies.load('session_token')}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    this.setState({ currentConvo: resp.data });
                    console.log(marker);
                } else {
                    alert('ERROR CHECK CONSOLE')
                }
            })
    }

    fetchData = id => {
        // fetch account details
        fetch(`${globals.backend_url}/api/chat/getAccountDetails?id=${id}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    var data = {
                        id: id,
                        account_name: resp.data.account_name,
                        email: resp.data.email,
                        status: 'online'
                    }
                    this.setState({ currentParty: data });
                } else {
                    // account not found!
                    alert('Account not found');
                    console.log(resp)
                    //window.location = '/';
                }
            })
            .catch((r) => {
                alert(r)
            })
    };

    componentWillMount() {

        if (!cookies.load('session_token')) {
            window.location = '/login'
        }
        clearInterval(this.interval);

        var id;
        try {
            id = this.props.match.params.id;
        } catch {
            id = undefined;
            if (this.props.selectedContactId) {
                id = this.props.selectedContactId;
            }
        }
        if (id) {
            //this.setState({ [event.target.name]: event.target.value });
            this.selectContact(id)
            //this.fetchData(id);
        }


        this.pullContacts();
        this.interval = setInterval(() => {
            if (this.state.currentParty.id != null) {
                this.pullChat();
            }
            this.pullContacts();
        }, 5000)

    }
    handleChange(event) {
        try {
            event.preventDefault();
        } catch {

        }
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        if (this.props.showContactsOnly == true) {
            return (
                <Contacts contacts={this.state.contacts} selectContact={this.navigate2contact} />
            );
        } else if (this.props.selectedContactId) {
            return (
                <Conversation composer={this.state.composer} currentConvo={this.state.currentConvo} currentParty={this.state.currentParty} handleChange={this.handleChange} sendMessage={this.sendMessage} />
            );
        } else {
            return (
                <div style={{ backgroundColor: '#F9FAFC', position: 'absolute', height: '100%', width: '100%' }}>
                    <Navbar type="dashboard" page="inbox" openModal={this.openModal} />

                    <div style={{ boxSizing: 'border-box', padding: '25px', display: 'inline-flex', width: '100%', boxSizing: 'border-box', height: 'CALC(100% - 80px)' }}>
                        <div style={{ width: '30%', boxSizing: 'border-box', paddingRight: '5px' }}>
                            <Contacts contacts={this.state.contacts} selectContact={this.selectContact} />
                        </div>
                        <div style={{ width: '70%', boxSizing: 'border-box', paddingLeft: '5px' }}>
                            <Conversation composer={this.state.composer} currentConvo={this.state.currentConvo} currentParty={this.state.currentParty} handleChange={this.handleChange} sendMessage={this.sendMessage} />
                        </div>

                    </div>









                </div>
            );
        }
    }
}