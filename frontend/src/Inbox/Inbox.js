import React from 'react'
import cookies from 'react-cookies'
import Loading from './../Loading/Loading';

import { Textbox } from './../Textbox/Textbox'
import { Phone, Search, Send, ArrowDown, ArrowLeft, FolderPlus, Eye } from 'react-feather';
import { Well } from './../Well/Well'
import globals from './../var'
import socketIOClient from "socket.io-client";
import { Avatar } from './../Avatar/Avatar';
import './Chat.css'
import { Button } from './../Buttons/Buttons';
import { Spring } from 'react-spring';
import { Navbar } from '../Navbar/Navbar';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

var socket;


class Contact extends React.Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <div className="contact-container" onClick={() => this.props.selectContact(this.props.info.id, this.props.info.account_name, this.props.info.online == 1)}>
                <Avatar dim="50px" showStatus={true} active={this.props.info.online == 1} filename={this.props.info.id + '.jpg'} />
                <div className="contact-info">
                    <div style={{ width: '100%', display: 'inline-flex' }}>
                        <h4 style={{ margin: '0px', color: 'black', fontWeight: 'bold' }}>{this.props.info.account_name}</h4>
                    </div>
                    
                    <span style={{ fontSize: '14px', color: '#A3A3A3', fontWeight:(this.props.info.last_message.seen==0 && this.props.info.last_message.sender != cookies.load('user_id'))&&'bold'}}>{(this.props.info.last_message.sender == cookies.load('user_id')) && 'You : '}{this.props.info.last_message.body}</span>
                </div>
            </div>
        );
    }
}

class Contacts extends React.Component {
    constructor(props) {
        super(props)
        this.state = { search_key: '', searchIsLoading: false, search_data: [] }
        this.handleChange = this.handleChange.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
    }
    handleChange(e) {
        this.setState({ search_key: e.target.value }, () => {
            console.log(this.state.search_key)
            if (socket) {
                this.setState({ searchIsLoading: true }, () => {
                    socket.emit('pull_contacts', { identifier: cookies.load('user_id'), session_token: cookies.load('session_token') }, this.state.search_key)

                })
            }
        });
    }
    clearSearch() {
        this.setState({ search_key: '' })
    }
    componentDidMount() {
        socket.on('accpt_contacts_search', (data) => {
            this.setState({ search_data: data, searchIsLoading: false }, () => {
                console.log(this.state.contacts)
            })
        })
    }
    render() {
        return (
            <div style={{ height: 'CALC(100% - 70px)' }}>
                <div style={{ boxSizing: 'border-box', padding: '10px', display: 'inline-flex', width: '100%' }}>
                    {this.state.search_key.length > 0 && <Button onClick={this.clearSearch} variant="transparent" style={{ marginRight: '5px' }} buttonCenterIcon={<ArrowLeft style={{ width: '100%', height: '100%' }} />} />}<Textbox value={this.state.search_key} onChange={this.handleChange} name="search_key" placeholder="Search in contacts.." style={{ width: '100%' }} icon={<Search style={{ height: '100%', width: '100%', color: '#a5a5a5' }} />} />
                </div>
                {
                    (this.state.search_key.length == 0) ? <React.Fragment>
                        {this.props.contactIsLoading && <Loading height="100%" />}
                        {!this.props.contactIsLoading && this.props.contacts.map((item) => <Contact selectContact={this.props.selectContact} info={item} />)}
                    </React.Fragment> :
                        <React.Fragment>
                            {this.state.searchIsLoading && <Loading height="100%" />}
                            {!this.state.searchIsLoading && this.state.search_data.map((item) => <Contact selectContact={this.props.selectContact} info={item} />)}
                        </React.Fragment>
                }
            </div>
        );
    }
}

class Bubble extends React.Component {
    constructor(props) {
        super(props)
        this.state = { showDetails: false }
        this.toggleDetails = this.toggleDetails.bind(this)
    }
    toggleDetails() {
        this.setState({ showDetails: !this.state.showDetails })
    }
    render() {
        if (this.props.data.sender == cookies.load('user_id')) { // other party 
            return (
                <div style={{ width: '100%', textAlign: 'right' }} onClick={this.toggleDetails}>
                    <div style={{
                        backgroundColor: 'black', color: 'white', boxSizing: 'border-box', padding: '10px', borderRadius: '7px',
                        borderTopRightRadius: '0px', width: 'max-content', margin: 'auto', marginRight: '0px', marginBottom: '2px'
                    }}>
                        {this.props.data.body}
                    </div>
                    {this.state.showDetails && <div style={{ marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#00000054' }}>Sent : {this.props.data.timestamp}</span>
                    </div>}

                </div>
            );

        } else {
            return (
                <div style={{ width: '100%' }} onClick={this.toggleDetails}>

                    <div style={{
                        background: 'linear-gradient(to right, #EF3D49, #F95538)'
                        , color: 'white', boxSizing: 'border-box', padding: '10px', borderRadius: '7px',
                        borderTopLeftRadius: '0px', width: 'max-content', marginBottom: '2px'
                    }}>
                        {this.props.data.body}
                    </div>
                    {this.state.showDetails && <div style={{ marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#00000054' }}>Sent : {this.props.data.timestamp}</span>
                    </div>}
                </div>
            );
        }

    }
}



class Convo extends React.Component {
    constructor(props) {
        super(props)
        this.state = { message: '', scrollDownButtonActive: false, convo: this.props.convo }
        this.handleChange = this.handleChange.bind(this)
        this.handleSend = this.handleSend.bind(this)
        this.scrollDown = this.scrollDown.bind(this);
    }
    componentDidMount() {
        this.props.convoContainerRef.current.addEventListener('scroll', () => {
            this.setState({ scrollDownButtonActive: this.props.convoContainerRef.current.scrollTop !== this.props.convoContainerRef.current.scrollHeight - this.props.convoContainerRef.current.offsetHeight })
        })
        const data = new FormData();
        data.append('identifier', cookies.load('user_id'))
        data.append('session_token', cookies.load('session_token'))
        data.append('party_id', this.props.selectedContact.id)
        fetch(`${globals.backend_url}/api/chat/mark-as-seen`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then((resp) => {
                if (resp.status != 'ok') {
                    console.log('[!] Error marking as seen : ')
                    console.log(resp)
                }else if(resp.status == 'ok'){
                    this.props.markAsSeen();
                }
            })

        socket.on('accpt_message', (data) => {
            // if message belongs to current contact session add it
            if ((data['sender'] == this.props.selectedContact.id) || (data['dest'] == this.props.selectedContact.id)) {
                var arr = this.state.convo;

                // check if the message is aleady in the convo to prevent redandance
                if (arr.length > 0) {
                    if (arr[arr.length - 1]['id'] < data['id']) {
                        arr.push(data)
                        this.setState({ convo: arr }, () => {
                            if (this.props.convoContainerRef) {
                                this.scrollDown()
                            }
                        });
                    }
                } else {
                    arr.push(data)
                    this.setState({ convo: arr }, () => {
                        if (this.props.convoContainerRef) {
                            this.scrollDown()
                        }
                    });
                }
            }


        })
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSend() {
        socket.emit('push_message', { identifier: cookies.load('user_id'), session_token: cookies.load('session_token'), dest: this.props.selectedContact.id, body: this.state.message })
        this.setState({ message: '' })
    }
    scrollDown() {
        if (this.props.convoContainerRef.current) {
            var element = this.props.convoContainerRef.current;
            element.scrollTop = this.props.convoContainerRef.current.scrollHeight - this.props.convoContainerRef.current.offsetHeight;
        }
    }
    render() {
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div className="convo-header">
                    <Avatar dim="50px" showStatus={true} active={this.props.selectedContact.online} filename={this.props.selectedContact.id + '.jpg'} style={{ margin: 'auto 0px auto 0px', cursor: 'pointer' }} onClick={() => window.location = `/profile/${this.props.selectedContact.id}`} />
                    <h4 onClick={() => window.location = `/profile/${this.props.selectedContact.id}`} style={{ margin: 'auto 0px auto 10px', cursor: 'pointer' }}>{this.props.selectedContact.account_name}</h4>

                    <Button style={{ margin: 'auto', marginRight: '0px' }} variant="transparent curvy" buttonCenterIcon={<Phone style={{ width: '100%', height: '100%', fill: '#000000bd', stroke: 'none' }} />} />
                </div>
                <div className="convo-main" ref={this.props.convoContainerRef}>
                    {this.props.loading && <Loading height="100%" />}
                    {this.state.convo.map(item => <Bubble data={item} />)}
                    <div style={{width:'100%', textAlign:'right'}}>
                    {(this.state.convo.length > 0)&&(this.state.convo[this.state.convo.length - 1]['seen'] == 1 && this.state.convo[this.state.convo.length - 1]['sender'] == cookies.load('user_id'))&&<Eye style={{height:'30px', height: '20px',color: '#0000003d'}} />}

                    </div>
                
                </div>
                {(this.state.scrollDownButtonActive == true) && <Spring
                    from={{ opacity: 0 }}
                    to={{ opacity: 0 }}
                >
                    {props => (<div style={{ opacity: '0.2', textAlign: 'center', position: 'absolute', width: '100%', bottom: '110px' }}><Button style={props} variant="dark curvy" onClick={this.scrollDown} buttonCenterIcon={<ArrowDown style={{ width: '100%', height: '100%' }} />} /></div>)}
                </Spring>}
                <div className="convo-composer" >
                    <Textbox value={this.state.message} name="message" onChange={this.handleChange} style={{ width: '100%' }} placeholder="Aa.." button={<Button onClick={this.handleSend} variant="dark" innerPadding='6px' buttonCenterIcon={<Send style={{ width: '100%', height: '100%' }} />} style={{ width: '30px', height: '30px' }} />} />
                </div>
            </div>
        );
    }
}

class InboxC extends React.Component {
    constructor(props) {
        super(props);
        this.state = { search_key: undefined, audio: new Audio(`${globals.frontend_url}/tone.mp3`), play: false, contacts: [], contactIsLoading: true, convoIsLoading: true, selectedContact: null, currentConvo: [] }
        this.notify = this.notify.bind(this);
        this.handleSelectContact = this.handleSelectContact.bind(this)
        this.scrollDown = this.scrollDown.bind(this);
        this.convoContainerRef = React.createRef();
        this.markAsSeen = this.markAsSeen.bind(this)
        socket = socketIOClient.io( {
            auth: {
                'identifier': cookies.load('user_id'),
                'session_token': cookies.load('session_token')
            }
        });
    }
    markAsSeen(){
        // mark current convo as seen
        if(this.state.currentConvo.length > 0){
            var new_convo = this.state.currentConvo;
            new_convo[new_convo.length - 1 ]['seen'] = 1;
            this.setState({currentConvo:new_convo})
        }
        console.log('Marking as seen')
        // update contact to seen
        var new_contacts = this.state.contacts;
        for(var i=0; i<new_contacts.length; i++){
            if (new_contacts[i]["id"] == this.state.selectedContact.id){
                var aux = new_contacts[i]
                aux['last_message']['seen'] = 1;
                new_contacts[i] = aux;
                break;
            }
        }
    }
    notify() {
        this.setState({ play: true }, () => {
            this.state.audio.play()
        });
    }
    scrollDown() {
        if (this.convoContainerRef.current) {
            var element = this.convoContainerRef.current;
            element.scrollTop = this.convoContainerRef.current.scrollHeight - this.convoContainerRef.current.offsetHeight;
        }
    }
    handleSelectContact(cid, account_name, active) {
        if (cid) {
            if (this.props.contactOnly) {
                window.location = '/dashboard/inbox/' + cid;
            }
            this.setState({ selectedContact: { id: cid, account_name: account_name, online: active }, currentConvo: [], convoIsLoading: true }, () => {
                socket.emit('pull_convo', { identifier: cookies.load('user_id'), party_id: this.state.selectedContact.id });
            })
        }
    }

    UNSAFE_componentWillMount() {

        if (this.props.selectedContactId) {
            // fetch details : account_name, active?
            fetch(`${globals.backend_url}/api/chat/getAccountDetails?id=${this.props.selectedContactId}`)
                .then(res => res.json())
                .then((resp) => {
                    console.log(resp)
                    if (resp.status == 'ok') {
                        this.handleSelectContact(this.props.selectedContactId, resp.data['account_name'], resp.data['online'])
                    } else {
                        if (resp.status == 'error') {
                            if (resp.reasond == 2) {
                                alert('Account by this id is not found')

                            }
                        }
                    }
                })
        }

        socket.emit('pull_contacts', { identifier: cookies.load('user_id'), session_token: cookies.load('session_token') })
        socket.on('accpt_contacts', (data) => {
            this.setState({ contacts: data, contactIsLoading: false }, () => {
                console.log(this.state.contacts)
            })
        });
        socket.on('accpt_convo', (data) => {
            this.setState({ currentConvo: data, convoIsLoading: false }, () => {
            });
        })
        socket.on('accpt_message', (data) => {
            // if message belongs to current contact session add it
            if ((data['sender'] == this.state.selectedContact) || (data['dest'] == this.state.selectedContact)) {
                var arr = this.state.currentConvo;

                // check if the message is aleady in the convo to prevent redandance
                if (arr[arr.length - 1]['id'] < data['id']) {
                    arr.push(data)
                    this.setState({ currentConvo: arr }, () => {
                        if (this.convoContainerRef) {
                            this.scrollDown()
                        }
                    });
                }
            }
            // check if the sender is already in the contacts
            var contacts = this.state.contacts;
            var found = false;
            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i]['id'] == data.sender) {
                    contacts[i]['last_message'] = data;
                    this.notify()
                    found = true;
                    break;

                } else if (contacts[i]['id'] == data.dest) {
                    contacts[i]['last_message'] = data;
                    found = true;
                    break;
                }
            }
            if (found == true) {
                var aux = contacts[i];

                // remove old contact[i] 
                contacts.splice(i, 1);
                contacts.unshift(aux);
            }
            this.setState({ contacts: contacts })
            // if contact not found re-pull contact from backend
            if (found == false) {
                console.log('[!] Contact not found, refreshing contact list..')
                socket.emit('pull_contacts', { identifier: cookies.load('user_id'), session_token: cookies.load('session_token') })
            }
        });

    }
    componentDidMount() {
        this.scrollDown()
        this.state.audio.addEventListener('ended', () => this.setState({ play: false }));
    }
    componentWillUnmount() {
        socket.off('accpt_contacts');
        socket.off('accpt_message');
        this.state.audio.removeEventListener('ended', () => this.setState({ play: false }));
    }

    render() {
        return (
            <div style={{ display: 'inline-flex', width: '100%', height: '100%' }}>
                <div className="contacts-container" style={{ width: (this.props.contactOnly && '100%') }}><Contacts selectContact={this.handleSelectContact} contacts={this.state.contacts} contactIsLoading={this.state.contactIsLoading} /></div>
                {((this.state.selectedContact != null) && (!this.props.contactOnly)) && <div className="convo-container"><Convo markAsSeen={this.markAsSeen} convoContainerRef={this.convoContainerRef} key={this.state.currentConvo} selectedContact={this.state.selectedContact} convo={this.state.currentConvo} loading={this.state.convoIsLoading} /></div>}
            </div>
        )

    }
}


export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.type == 'contacts') {
            return (
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <InboxC contactOnly={true} />
                    <div style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '10px', paddingRight: '10px', position: 'absolute', bottom: '10px' }}>
                        <Link to="/dashboard/inbox"><Button style={{ width: '100%' }} variant="btn ghost-primary" value="Show all" /></Link>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ position: 'absolute', width: '100%', height: 'CALC(100% - 80px)' }}>
                    <Navbar style={{ borderBottom: '1px solid #EBEBEB' }} type="dashboard" page="inbox" openModal={this.openModal} />
                    <InboxC selectedContactId={this.props.match.params.id} />
                </div>
            );
        }

    }
}