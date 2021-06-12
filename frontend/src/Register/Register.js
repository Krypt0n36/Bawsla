import React from 'react';
import {DropDown, Textbox} from './../Textbox/Textbox';
import {Button} from './../Buttons/Buttons';
import Checkbox from '../Checkbox/Checkbox';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Alert from './../Alert/Alert';
import BrandIcon from './../icons/brand1.svg';
import houseIllu from './../illustrations/house.svg';
import { Navbar } from '../Navbar/Navbar';
import Footer from './../Footer/Footer';
import './Register.css'
import globals from './../var';

class RegisterForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {email:'', account_name:'', password:'', repeat_password:'', phone_number:'', account_type:'', error:null, password_repeat_error:null}
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(event){
        console.log(event.target.name + ' = ' + event.target.value)
            this.setState({[event.target.name]:event.target.value}, ()=>{
                if(event.target.name == 'repeat_password'){
                    if(this.state.password != this.state.repeat_password){
                        this.setState({password_repeat_error:true});
                    }else{
                        this.setState({password_repeat_error:false});
                    }
                }
            })
    }
    componentDidMount(){
        var url = new URL(window.location);
        var type = url.searchParams.get('type');
        if(type){
            this.setState({account_type: type})
        }
    }
    handleSubmit(){
        const data = new FormData();
        data.append('account_type', this.state.account_type);
        data.append('account_name', this.state.account_name);
        data.append('email', this.state.email);
        data.append('password', this.state.password);
        data.append('phone_number', this.state.phone_number);

        fetch(`${globals.backend_url}/api/register`, 
            {
                method:'POST', 
                body: data
            }
        )
            .then(res => res.json())
            .then((result)=>{
                console.log(result)
                if(result['status'] == 'ok'){
                    window.location = '/login/'
                }
                if(result['status'] == 'error'){
                    // failed
                    var field = ''
                    if(result['field'] == 'account_name'){
                        field = 'Account name'
                    }if(result['field'] == 'account_type'){
                        field = 'Account type'
                    }
                    if(result['field'] == 'email'){
                        field = 'Email address'
                    }
                    if(result['field'] == 'password'){
                        field = 'Password'
                    }
                    if(result['field'] == 'phone_number'){
                        field = 'Phone number'
                    }
                    var msg = field + ' is empty or contains unallowed characters.'
                    this.setState({error:{message:msg}})
                }
            })
    }
    render(){
        return (
            <div style={{display:'inline-flex', width:'100%'}}>
                <div className="mobile-hidden" style={{padding:'10px',width:'40%'}}>
                    <div style={{height:'100%',width:'100%', backgroundColor:'#F7F7F7', borderRadius:'10px', backgroundImage: 'url(https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80)',backgroundPosition: 'center',backgroundSize: 'cover'}}>

                    </div>
                </div>
                <div id="register_form" style={{padding:'10px',width:'60%'}}>
                <h2 style={{margin:'0', color:'#212121'}}>Create new account</h2>
                <span style={{color:'#313131'}}>Connect to your account and start exploring.</span>
                {this.state.error&&<Alert style={{width:'100%', marginTop:'20px'}} variant="error">{this.state.error.message}</Alert>}
                
                <div style={{display:'inline-flex', width:'100%', flexWrap:'wrap',marginBottom:'10px', marginTop:'20px'}}>
                    <div style={{marginBottom:'5px', width:'100%', textAlign:'center'}}>
                        <label>I'am a : </label>
                    </div>
                    <div style={{width:'33.33%', boxSizing:'border-box', paddingRight:'5px'}}>
                        <Button variant={(this.state.account_type=='tenant')&&'active'} value="Tenant" style={{width:'100%'}} onClick={()=>this.handleChange({target:{name:'account_type', value:'tenant'}})}/>
                    </div>
                    <div style={{width:'33.33%', boxSizing:'border-box', paddingRight:'2.5px', paddingLeft:'2.5px'}}>
                        <Button variant={(this.state.account_type=='landlord')&&'active'} value="Landlord" style={{width:'100%'}} onClick={()=>this.handleChange({target:{name:'account_type', value:'landlord'}})}/>
                    </div>
                    <div style={{width:'33.33%', boxSizing:'border-box', paddingLeft:'5px'}}>
                        <Button variant={(this.state.account_type=='agency')&&'active'} value="Agency" style={{width:'100%'}} onClick={()=>this.handleChange({target:{name:'account_type', value:'agency'}})}/>
                    </div>

                </div>
                
                <Textbox style={{width:'100%', marginBottom:'10px'}} onChange={this.handleChange} name="account_name" placeholder="Account name.." />
                <Textbox style={{width:'100%', marginBottom:'10px'}} onChange={this.handleChange}  name="email" placeholder="Email address.."/>
                <Textbox style={{width:'100%', marginBottom:'10px'}} onChange={this.handleChange}  name="phone_number" placeholder="Phone number.."/>
                <Textbox style={{width:'100%', marginBottom:'10px'}} onChange={this.handleChange} type="password" name="password" placeholder="Password.."/>
                <Textbox style={{width:'100%', marginBottom:'10px'}} onChange={this.handleChange} className={(this.state.password_repeat_error==true)&&'error'}  type="password" name="repeat_password" placeholder="Repeat password.."/>
                
                <Checkbox label="I accept all the terms and conditions." />
                <Button onClick={this.handleSubmit} variant="primary" style={{width:'100%', marginTop:'10px', marginBottom:'20px'}} value="Create account"/>
                <div style={{textAlign:'center'}}>
                <span >You already have an account ? <Link style={{color:'#FD5A5F'}} to="/login" >Log in</Link></span>                
                </div>
                </div>
                
            </div>
            
        );
    }
}


class Register extends React.Component{
    render(){
        return (
            <div style={{}}>
                <Navbar type="minimal" />
                <div style={{boxSizing:'border-box', padding:'0px 25px 50px 25px'}}>
                    <RegisterForm />
                </div>
                <Footer />
            </div>
        );
    }
}


class RegisterMain extends React.Component{
    render(){
        return (
            <div style={{width:'400px', textAlign:'center'}}>
                <h2>Become a host</h2>
                <span style={{color:'#000000b3'}}>Please choose your desired account type</span><br></br>
                <img src={houseIllu} style={{width:'100%', boxSizing:'border-box', padding:'40px'}}/>
                <Link to="/register?type=agency">
                    <Button value="Agency" variant="big-mama" />
                </Link>
                <div style={{ marginBottom:'10px', width:'100%'}}></div>
                <Link to="/register?type=landlord" >
                    <Button value="Landlord" variant="big-mama" />
                </Link>
            </div>
        );
    }
}

export {RegisterMain, Register, RegisterForm};