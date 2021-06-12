import React from 'react';
import lockCircle from './../icons/lockCircle.svg';
import {Textbox} from './../Textbox/Textbox.js';
import {Button} from './../Buttons/Buttons.js';
import backArrow from './../icons/arrow-left-gray.svg';
import phoneIcon from './../icons/choice-phone.svg';
import mailIcon from './../icons/choice-mail.svg';
import BrandIcon from './../icons/brand1.svg';
import './reset.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import successIcon from './../icons/success.svg';
import interrIcon from './../icons/interrogation.svg';
import Well from '../Well/Well';
import Alert from './../Alert/Alert';
import { Navbar } from '../Navbar/Navbar';
import globals from './../var';

class ResetSuccess extends React.Component{
    render(){
        return(
        <div style={{position:'relative', height:'350px', width:'350px', textAlign:'center'}}>
            <img src={successIcon} />
            <h2 style={{color:'#212121'}}>Congratulations</h2>
        <span style={{fontSize:'18px',color:'#989898'}}>
        Your password has been changed
successfully.</span>
        <Link to="/login/">Continue</Link>
    </div>
    );
    }
}

class ResetAlert extends React.Component{
    render(){
        return(
        <div style={{position:'relative', height:'350px', width:'350px', textAlign:'center'}}>
            <img src={interrIcon} />
            <h2 style={{color:'#212121'}}>Oops</h2>
            
        
        <span style={{fontSize:'18px',color:'#989898'}}>
        We can't find no account associated with this email, please try again.
        </span>
            <div style={{width:'100%',margin: 'auto',marginBottom: '0px',bottom: '0',position: 'absolute',right: '0', display:'inline-flex'}}>
                    <div style={{width:'50%', boxSizing:'border-box',}}>
                        <Button variant="secondary" value="Create new account" />
                    </div>
                    <div style={{width:'50%', boxSizing:'border-box', }}>
                        <Button variant="primary" value="Try again" style={{width:'100%'}}/>
                    </div>
                </div>
    </div>
    );
    }
}


class Reset4 extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        this.props.triggerChangePassword(()=>{
            this.props.event(5)
        })
    }
    render(){
        return(
            <div style={{position:'relative', height:'350px', width:'350px'}}>
            
                <div style={{display:'inline-flex'}}> 
                    <img src={backArrow} onClick={()=>this.props.event(3)}/>
                    <h2 style={{margin:'0',marginLeft:'30px', color:'#212121'}}>Reset password</h2>
                </div><br></br>
                <span style={{fontSize:'18px',color:'#989898'}}>Choose a new password, make sure its
strong.</span>
                <Textbox name="password" type="password" onChange={this.props.onChange} style={{width:'100%', marginTop:'40px', marginBottom:'5px'}} placeholder="Password.." />
                
                <Textbox name="repeat_password" type="password" onChange={this.props.onChange} style={{width:'100%', marginTop:'5px', marginBottom:'10px'}} placeholder="Repeat password.." />
                <Button onClick={this.handleClick} variant="primary" value="Commit changes" style={{width:'100%',margin: 'auto',marginBottom: '0px',bottom: '0',position: 'absolute',right: '0'}}/>
            
            </div>
        );
    }
}




class Reset3 extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    componentWillMount(){
        this.props.triggerSendCode(()=>{
            alert('code sent');
        });
    }
    handleClick(){
        this.props.triggerVerifCode(()=>{
            this.props.event(4);
        })
    }
    render(){
        return (
            <div style={{ height:'350px', position:'relative', width:'350px'}}>
                <div style={{display:'inline-flex'}}> 
                <img src={backArrow} onClick={()=>this.props.event(2)}/>


                    <h2 style={{margin:'0',marginLeft:'30px', color:'#212121'}}>Reset password</h2>
                </div><br></br>
                <span style={{fontSize:'18px',color:'#989898'}}>Please enter the verification code to continue.</span>
            
                <div style={{width:'100%', display:'inline-flex', marginTop:'60px'}}>
                    <div style={{width:'20%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Textbox style={{width:'100%'}} name="c_1" onChange={this.props.onChange} />
                    </div>
                    <div style={{width:'20%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Textbox style={{width:'100%'}} name="c_2" onChange={this.props.onChange} />
                    </div>
                    <div style={{width:'20%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Textbox style={{width:'100%'}} name="c_3" onChange={this.props.onChange} />
                    </div>
                    <div style={{width:'20%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Textbox style={{width:'100%'}} name="c_4" onChange={this.props.onChange} />
                    </div>
                    <div style={{width:'20%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Textbox style={{width:'100%'}} name="c_5" onChange={this.props.onChange}/>
                    </div>
                </div>
                <div style={{width:'100%',margin: 'auto',marginBottom: '0px',bottom: '0',position: 'absolute',right: '0', textAlign:'center'}}>
                    <span>Code is not recieved ? <span style={{color:'#FD5A5F'}} onClick={()=>this.props.triggerSendCode()}>Resend Code</span></span>
                    <Button onClick={this.handleClick} variant="primary" value="Continue" style={{width:'100%', marginTop:'10px'}}/>
                </div>

            </div>
        );
    }
}

class Reset2 extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(source){
        this.props.onChange({target:{name:'method', value:source}}, ()=>{
            this.props.event(3);
        });
    }
    render(){
        return (
            <div style={{ height:'350px', width:'350px'}}>
            
                <div style={{display:'inline-flex'}}> 
                <img src={backArrow} onClick={()=>this.props.event(1)}/>
                    <h2 style={{margin:'0',marginLeft:'30px', color:'#212121'}}>Reset password</h2>
                </div><br></br>
                <span style={{fontSize:'18px',color:'#989898'}}>Choose how you want to make the
verification.</span>
                
                <div className="choice" onClick={()=>this.handleClick('phone')} style={{marginBottom:'10px', marginTop:'20px'}}>
                    <div className="choice-icon">
                        <img src={phoneIcon} />
                    </div>
                    <div className="choice-text">
                        <span class="text1">Via SMS</span><br></br>
                        <span class="text2">+216 {this.props.globalState.phone_number}</span>
                    </div>
                </div>


                <div className="choice" onClick={()=>this.handleClick('mail')}>
                    <div className="choice-icon">
                        <img src={mailIcon} />
                    </div>
                    <div className="choice-text">
                        <span class="text1">Via Email</span><br></br>
                        <span class="text2">{this.props.globalState.email_address}</span>
                    </div>
                </div>



            </div>

        );
    }
}


class Reset1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {identifier:'', error:null}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }
    handleChange(event){
        try{
            event.preventDefault();
        }catch{
            
        }
        this.setState({[event.target.name]:event.target.value});
    }
    handleSubmit(){
        fetch(`${globals.backend_url}/api/reset/GetInfo?identifier=${this.state.identifier}`)
            .then(res => res.json())
            .then((resp) =>{
                if(resp.status == 'ok'){
                    this.props.onChange({target:{name:'email_address', value:resp.data.email}}, ()=>{
                        this.props.onChange({target:{name:'phone_number', value:resp.data.phone_number}}, ()=>{
                            this.props.event(2);
                        })
                    })
                    
                }else{
                    this.setState({error:'We cannot find any accounts associated with your provided information.'}, ()=>{
                        //alert('error');
                    })
                }
            })

        //()=>this.props.event(2)
    }
    render(){
        return(
            <div style={{position:'relative', height:'350px', width:'350px'}}>
                <div style={{textAlign:'center', width:'100%', marginBottom:'20px'}}>
                    <img src={lockCircle} style={{height:'120px'}}/>
                </div>
                <h2 style={{margin:'0', color:'#212121'}}>Reset password</h2>
                <span style={{fontSize:'18px',color:'#989898'}}>Reset your account's password.</span>
               
                <Textbox name="identifier" onChange={this.handleChange}  style={{width:'100%', marginTop:'20px', marginBottom:'10px'}} placeholder="Phone number or email address.." />
                {this.state.error&&<Alert style={{width:'100%', marginTop:'5px', marginBottom:'5px'}} variant="error">{this.state.error}</Alert>}
                
                <Button onClick={this.handleSubmit} variant="primary" value="Continue" style={{width:'100%',margin: 'auto',marginBottom: '0px',bottom: '0',position: 'absolute',right: '0'}}/>
            </div>
        );
    }
}



 class ResetSandwich extends React.Component{
    constructor(props){
        super(props);
        this.state = {currentStep:1, currentComp:undefined};
        this.goTo = this.goTo.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.triggerSendCode = this.triggerSendCode.bind(this)
        this.triggerVerifCode = this.triggerVerifCode.bind(this)
        this.triggerChangePassword = this.triggerChangePassword.bind(this);
    }
    goTo(stepID){
        this.setState({currentStep:stepID});
    } 
    handleChange(event, callback){
        try{
            event.preventDefault();
        }catch{
            
        }
        this.setState({[event.target.name]:event.target.value}, ()=>{
            if(callback != undefined){callback();}
        });
    }
    triggerVerifCode(callback){
        const code = this.state.c_1 + this.state.c_2 + this.state.c_3 + this.state.c_4 + this.state.c_5;
            fetch(`${globals.backend_url}/api/reset/checkCode?identifier=${this.state.phone_number}&code=${code}`)
            .then(res => res.json())
            .then((resp)=>{
                if(resp.status == 'ok'){
                    if(resp.valid == 'yes'){
                        if(callback != undefined){
                            callback();
                        }
                    }
                    else{
                        alert('Code not valid');
                    }
                }else{
                    alert('Bad response @triggerVerifCode');
                }

            })
        
    }
    triggerChangePassword(callback){
        const code = this.state.c_1 + this.state.c_2 + this.state.c_3 + this.state.c_4 + this.state.c_5;
        const data = new FormData();
        data.append('identifier', this.state.phone_number);
        data.append('code', code);
        data.append('password', this.state.password)
        fetch(`${globals.backend_url}/api/reset/changePassword`, {
            body:data,
            method:'POST'
        })
            .then(res=>res.json())
            .then((resp)=>{
                if(resp.status == 'error'){
                    alert('error')
                }
                if(resp.status == 'ok'){
                    if(callback != undefined){
                        callback();
                    }
                }
            })
    }
    triggerSendCode(callback){
        const data = new FormData();
        if(this.state.method == 'phone'){
            data.append('identifier', this.state.phone_number)
            data.append('meth', 1);
        }else {
            data.append('identifier', this.state.email_address)
            data.append('meth', 0);
        }
        fetch(`${globals.backend_url}/api/reset/sendVerifCode`, {
            method:'POST',
            body:data
        })
            .then(res => res.json())
            .then((resp)=>{
                console.log(resp)
                if(resp.status != 'ok'){
                    alert('Unexpected behaviour, @triggerSendCode');
                }else{
                    callback();
                }
            })
    }
    render(){
        return (
            <div style={this.props.style}>
                {(this.state.currentStep==1)&&<Reset1 event={this.goTo} onChange={this.handleChange}/>}
                {(this.state.currentStep==2)&&<Reset2 event={this.goTo} onChange={this.handleChange} globalState={this.state}/>}
                {(this.state.currentStep==3)&&<Reset3 event={this.goTo} onChange={this.handleChange} triggerSendCode={this.triggerSendCode} triggerVerifCode={this.triggerVerifCode}/>}
                {(this.state.currentStep==4)&&<Reset4 event={this.goTo} onChange={this.handleChange} triggerChangePassword={this.triggerChangePassword} />}
                {(this.state.currentStep==5)&&<ResetSuccess event={this.goTo}/>}
                {(this.state.currentStep==6)&&<ResetAlert event={this.goTo}/>}
            </div>
        );
    }
}

export default class Reset extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div style={{position:'absolute', width:'100%', height:'100%',boxSizing:'border-box', backgroundColor:'#F9FAFC'}}>
                <Navbar type="minimal" />
                <div style={{boxShadow: '0px 0px 9px #0000000f', width:'390px', background:'white', borderRadius:'7px', margin:'auto', boxSizing:'border-box', padding:'20px', marginTop:'80px'}}>
                    <ResetSandwich style={{}}/>
                </div>
            </div>
        );
    }
}
export {Reset, Reset1, Reset2, Reset3};