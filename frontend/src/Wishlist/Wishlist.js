import React from 'react';
import cookies from 'react-cookies';
import { Card } from '../Card/Card';
import globals from './../var';


export default class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = { list: [] }
    }
    componentWillMount() {
        fetch(`${globals.backend_url}/api/wish/fetch?idfa=${cookies.load('idfa')}`)
            .then(res => res.json())
            .then((resp) => {
                if (resp.status == 'ok') {
                    console.log(resp)
                    this.setState({ list: resp.data });
                }
            })
    }
    render() {
        return (
            <div style={{ borderRadius: '7px', width: '600px', height: '500px', position: 'relative' }}>
                <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '25px', width: '100%' }}>
                    <h2 style={{ color: 'white', fontWeight: '100' }}>My wishlist</h2>
                </div>
                <div style={{ boxSizing: 'border-box',height: '300px', display:'inline-flex', flexWrap:'wrap', padding:'15px' }}>
                    {this.state.list.map(item => <div style={{ width: '50%', boxSizing: 'border-box' }}><Card data={item} /></div>)}
                </div>
            </div>
        );
    }
}

