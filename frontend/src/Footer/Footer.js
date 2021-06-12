import React from 'react';
import Brand0 from './../icons/brand0.svg'
import './footer.css';
import facebookIcon from './../icons/facebook-footer.svg';
import twitterIcon from './../icons/twitter-footer.svg';
import { Link } from 'react-router-dom';

export default class Footer extends React.Component{
    render(){
        return (
            <div className="footer">
                <div style={{width:'25%', boxSizing:'border-box', paddingRight:'10px'}} className="w-50-mob" >
                    <img src={Brand0} height="32px" />
                    <p>Bawsla is the new marketplace for renters
and brokers all around the Tunisian soil.</p>
                </div>
                <div style={{width:'25%', display:'grid'}} className="w-50-mob" >
                    <span style={{fontSize:'23px', marginBottom:'10px'}}>Website map</span>
                    <Link style={{fontSize:'14px', color:'#ffffffba', textTransform:'uppercase'}}>Home</Link>
                    <Link style={{fontSize:'14px', color:'#ffffffba', textTransform:'uppercase'}}>Listing</Link>
                    <Link style={{fontSize:'14px', color:'#ffffffba', textTransform:'uppercase'}}>Property</Link>
                    <Link style={{fontSize:'14px', color:'#ffffffba', textTransform:'uppercase'}}>Contact</Link>
                </div>
                <div style={{width:'25%'}} className="w-50-mob" >
                    <span style={{fontSize:'23px'}}>Download our app</span><br></br><br></br>
                    <img style={{height:'50px'}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Google_Play_Store_badge_FR.svg/1280px-Google_Play_Store_badge_FR.svg.png"/>
                    <img style={{height:'50px'}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png"/>

                </div>
                <div style={{width:'25%'}} className="w-50-mob" >
                    <span style={{fontSize:'23px'}}>Follow us on</span><br></br><br></br>
                    <img src={facebookIcon} style={{marginRight:'5px'}}/>
                    <img src={twitterIcon} />
                </div>
                <div style={{width:'100%', textAlign:'center', paddingTop:'20px', paddingBottom:'20px', marginTop:'50px'}}>
                    © 2021 bawsla.tn . Made with love.
                </div>
            </div>
        );
    }
}