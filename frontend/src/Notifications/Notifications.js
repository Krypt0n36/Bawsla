import React from 'react';
import cookies from 'react-cookies';
import {ArrowDownLeft, MessageSquare} from 'react-feather';

import globals from './../var';

class Notif extends React.Component{
    constructor(props){super(props)}
    render(){
        let icon;
        let bgcolor;
        let label;
        if(this.props.type == 'review_new'){
            icon = <MessageSquare style={{width:'100%', height:'100%', color:'white'}} />
            bgcolor = 'linear-gradient(46deg, #EF3D49, #F95538)';
            label = 'New review'
        }
        if(this.props.type == 'transaction_in'){
            icon = <ArrowDownLeft style={{width:'100%', height:'100%', color:'white'}} />
            bgcolor = 'linear-gradient(46deg, #EF3D49, #F95538)';
            label = 'Transaction In'
        }
        return (
            <div style={{display:'inline-flex', paddingBottom:'5px',paddingTop:'5px', width:'100%', borderBottom:'1px solid #EBEBEB'}}>
                <div>
                    <div style={{width:'60px', height:'60px', borderRadius:'7px', background:bgcolor, boxSizing:'border-box', padding:'10px'}}>
                    {icon}
                    </div>
                </div>
                
                <div style={{boxSizing: 'border-box',paddingLeft: '10px'}}>
                    <span style={{fontSize:'14px', fontWeight:'bold'}} >{label} - </span>
                    <span style={{fontSize:'14px', fontWeight:'bold'}}>
                        Today
                    </span><br></br>
                    <span style={{fontSize:'14px'}}>
                        {this.props.body}
                    </span>
                </div>
            </div>
        );
    }
}


export default class Notifications extends React.Component{
    constructor(props){
        super(props);
        this.state = {data:[]}
    }
    componentDidMount(){
        fetch(`${globals.backend_url}/api/notifs/pull?identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}`)
            .then(res => res.json())
            .then((resp) => {
                if(resp.status == 'ok'){
                    this.setState({data:resp.data})
                }
            })
    }
    render(){
        return (
            <div style={{boxSizing:'border-box', padding:'15px'}}>
                <h3 style={{marginTop:'5px'}}>Notifications</h3>

                <div style={{width:'100%'}}>
                    {this.state.data.map(item => <Notif type={item.type} body={item.body} />)}
                </div>
            </div>
        );
    }
}