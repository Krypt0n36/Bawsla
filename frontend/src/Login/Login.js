import React from 'react';
import {Textbox} from './../Textbox/Textbox';
import {Button} from './../Buttons/Buttons';
import Alert from './../Alert/Alert';
import Checkbox from '../Checkbox/Checkbox';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import BrandIcon from './../icons/brand1.png';
import cookie from 'react-cookies';


import GoogleIcon from './../icons/colored-google.svg';
import AppleIcon from './../icons/colored-apple.svg';
import FacebookIcon from './../icons/colored-facebook.svg';
import { Navbar } from '../Navbar/Navbar';
import './Login.css';
import globals from './../var'
import { Smartphone } from 'react-feather';

class LoginForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {isButtonLoading:false, identifier:'', password:'', error:null}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value});
    }
    handleSubmit(){
        this.setState({isButtonLoading:true}, ()=>{

        
        fetch(`${globals.backend_url}/api/login?identifier=${this.state.identifier}&password=${this.state.password}`)
            .then(res => res.json())
            .then(
                (result)=>{
                    this.setState({isButtonLoading:false})
                    console.log(result);
                    if(result['status'] == 'error'){
                        this.setState({error:null})
                        if(result['reason'] == 1){
                            if(result['field'] == 'identifier'){
                                this.setState({error:{message:'Identifier field cannot be left empty!'}})
                            }
                            if(result['field'] == 'password'){
                                this.setState({error:{message:'Password field cannot be left empty!'}})
                            }
                        } 
                        if(result['reason'] == 2){
                            this.setState({error:{message:'Incorrect password, please try again!'}, password:''})
                        }     
                        if(result['reason'] == 3){
                            this.setState({error:{message:'Account is not verified, please check your inbox!'}, password:''})

                        }
                    }
                    if(result['status'] == 'ok'){
                        // login successfully
                        cookie.save('user_id', result['id'], {path:'/'})
                        cookie.save('session_token', result['session_token'], {path:'/'})
                        window.location = '/';
                    }
                },
                (error)=>{
                    console.log('ERROR : ' + error);
                }
            )
            })
    }

    render(){
        return (
            <div style={{display:'inline-flex', width:'100%'}}>
                <div style={{padding:'10px',width:'40%'}} className="mobile-hidden">
                    <div style={{height:'100%',width:'100%', backgroundColor:'#F7F7F7', borderRadius:'10px', backgroundImage: `url(${globals.frontend_url}/image02.jpg)`,backgroundPosition: 'center',backgroundSize: 'cover'}}>
                        <div style={{widh:'100%', height:'100%', background:'linear-gradient(to top, rgba(0, 0, 0, 0.66), #00000017)', borderRadius:'10px'}}>

                        </div>
                    </div>
                </div>
                <div style={{padding:'10px', width:'60%'}} id="login_form">
                <h1 style={{margin:'0', color:'#212121'}}>Log in</h1>
                <span style={{color:'rgb(162, 162, 162)'}}>Connect to your account and start exploring.</span>
                
                {this.state.error&&<Alert style={{width:'100%', marginTop:'20px'}} variant="error">{this.state.error.message}</Alert>}
                
                
                <Textbox name="identifier" value={this.state.identifier} onChange={this.handleChange} style={{width:'100%', marginBottom:'10px', marginTop:'20px'}} placeholder="Email or Phone number.." />
                <Textbox name="password"  value={this.state.password} onChange={this.handleChange} type="password"  style={{width:'100%', marginBottom:'20px'}} placeholder="Password.."/>
                <Checkbox label="Remember me." /><Link style={{margin: 'auto',float: 'right'}} to="/reset">Lost your password?</Link>
                <Button isLoading={this.state.isButtonLoading} onClick={this.handleSubmit} variant="primary" style={{width:'100%', marginTop:'10px', marginBottom:'20px'}} value="Log in"/>
                <div style={{textAlign:'center'}}>
                <span style={{color:'rgb(162, 162, 162)'}}>Or</span><br></br><br></br>
                <div style={{width:'100%', display:'inline-flex'}}>
                    <Button innerPadding="15px" buttonLeftIcon={<img src={FacebookIcon} style={{width:'100%', height:'100%'}} />} value="Login via Facebook" style={{width: '48%', boxSizing:'border-box'}} />
                    <Button innerPadding="15px" buttonLeftIcon={<Smartphone style={{width:'100%', height:'100%'}}/>} value="Login via SMS" style={{width: '48%', boxSizing:'border-box', margin:'auto', marginRight:'0px'}}/>

                </div><br></br><br></br>
                <span style={{color:'rgb(162, 162, 162)'}}>Dont have an account ? <Link style={{fontWeight:'bold'}} to="/register" >register now</Link></span>                
                </div>
                </div>
                
            </div>
            
        );
    }
}


class Login extends React.Component{
    render(){
        return (
            <div style={{position:'absolute', width:'100%', height:'100%'}}>
                <Navbar type="minimal" />
                <div style={{width:'70%', margin:'auto', marginTop:'20px'}}>
                    <LoginForm />
                </div>
            </div>
        );
    }
}

export {Login, LoginForm};