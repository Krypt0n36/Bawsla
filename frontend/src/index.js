import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Explorer from './Explorer';
import {Login} from './Login/Login';
import {Register} from './Register/Register';
import Reset from './Reset/Reset';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './Dashboard/Dashboard';
import HostProp from './HostProp/HostProp';
import Playground from './Playground/Playground';
import Single from './Single/Single';
import Settings from './Settings/Settings';
import AssetControl from './AssetControl/AssetControl';
import Profile from './Profile/Profile';
import {Transactions, Refill } from './Transactions/Transactions';
import { LocationPicker } from './Map/Map';
import Inbox from './Inbox/Inbox'

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
        <Route path="/dashboard/inbox/:id" component={Inbox}></Route>
        <Route path="/dashboard/inbox/" component={Inbox}></Route>

        <Route path="/single/:id" component={Single}></Route>
        <Route path="/playground">
            <Playground />
          </Route>
          <Route path="/asset/control/:id" component={AssetControl}>
          </Route>
          <Route path="/profile/:id" component={Profile}>
          </Route>
        <Route path="/settings">
            <Settings type='dashboard' />
          </Route>
        <Route path="/reset">
            <Reset />
          </Route>
          
        <Route path="/register">
            <Register />
          </Route>
        <Route path="/login">
            <Login />
          </Route>
          <Route path="/explorer/:city/:region/:type" component={Explorer}> 

          </Route>
          <Route path="/explorer">
            <Explorer />
          </Route>
          <Route path="/dashboard/wallet/refill">
            <Refill />
          </Route>
          <Route path="/dashboard/wallet">
            <Transactions />
          </Route>
          
          <Route path="/dashboard/host">
            <HostProp />
          </Route>
          <Route path="/dashboard" component={()=> <Dashboard />}>
          </Route>
          <Route path="/m/dashboard" component={()=> <Dashboard mobile={true} />}>
          </Route>
          <Route path="/map">
            <LocationPicker />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
