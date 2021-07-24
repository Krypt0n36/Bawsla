import React from 'react';
import { Link } from 'react-router-dom';
import {Avatar} from '../Avatar/Avatar';
import { Button } from '../Buttons/Buttons';
import Footer from '../Footer/Footer';
import HostProp from '../HostProp/HostProp';
import Switch from '../Switch/Switch';
import { Textbox } from '../Textbox/Textbox';
import Well from '../Well/Well';
import {Navbar} from './../Navbar/Navbar';
import globals from './../var';




export default class AssetControl extends React.Component{
    constructor(props){
        super(props);
        this.state = {assetID:null}
    }
    componentWillMount(){
        const id = this.props.match.params.id;
        this.setState({assetID:id});
        fetch(`${globals.backend_url}/api/single/fetch?id=${id}`)
            .then(res => res.json())
            .then((resp) => {
                if(resp.status == 'ok'){
                    this.setState({data:resp.data})
                    console.log(resp.data)
                }
                else{
                    window.location = '/';
                }
            })
    }
    render(){
        return (
            <div style={{backgroundColor:'#F9FAFC', position:'absolute', width:'100%', minheight:'100%'}}>
                <Navbar type="dashboard" />
                <div style={{display:'inline-flex',flexWrap:'wrap', width:'100%', boxSizing:'border-box', padding:'20px'}}>
                    
                    <div style={{margin:'auto'}}>
                    <div style={{width:'100%', padding:'1%'}}>
                    <h2><Link to="/dashboard">Dashboard</Link> / Apartmenet S4 La marsa</h2>  
                    </div>
                    <HostProp extended={true} />

                    </div>
                </div> 
                <Footer />   
            </div>
        );
    }
}