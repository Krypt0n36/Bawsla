import React from 'react';
import { Button } from './../Buttons/Buttons';
import { Camera, Edit, Edit2, Image } from 'react-feather';
import { FilePicker } from 'react-file-picker';
import { Modal } from 'react-responsive-modal';
import cookies from 'react-cookies';
import globals from './../var'

class ChangeAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 1, newlyUploadedAvatarURL: null }
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }
  handleFileUpload(fileObj) {
    const data = new FormData();
    data.append('file', fileObj);
    data.append('identifier', cookies.load('user_id'));
    data.append('session_token', cookies.load('session_token'));
    fetch(`${globals.backend_url}/api/changeAvatar`, {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((data) => {
        console.log('-------')
        console.log(data);
        if (data.status == 'ok') {
          this.setState({ newlyUploadedAvatarURL: data.direct_link });
          // next step
          this.setState({ step: 2 })
        }
      })
    });

  }
  render() {
    return (
      <div style={{ borderRadius: '7px', width: '500px', height: '400px', position: 'relative' }}>
        <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '25px', width: '100%' }}>
          <h2 style={{ color: 'white' }}><Camera style={{height:'23px', marginRight:'10px'}} /> Edit avatar</h2>
        </div>
        <div style={{ boxSizing: 'border-box', padding: '20px', height: '300px' }}>
          {this.state.step == 1 ? <FilePicker
            extensions={["jpg", "png", "bmp"]} // Notice that I removed the "."
            onChange={FileObj => this.handleFileUpload(FileObj)}
            onError={errMsg => console.log(errMsg)} // Please handle error
          >
            <div style={{ width: '100%', backgroundColor: '#FEEFF0', borderRadius: '7px', paddingTop: '90px', paddingBottom: '90px', border: '2px dashed #EF3D49', textAlign: 'center' }}>
              <span style={{ color: '#484848', margin: 'auto' }}>Drag & Drop or <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'black' }}>Browse</span></span>
            </div>
          </FilePicker> : <div style={{width:'100%', textAlign:'center'}}>

            <Avatar forceReload={true} absolute_filename={this.state.newlyUploadedAvatarURL} dim="150px" style={{ margin: 'auto', width:'min-content' }} />
            <p style={{color:'#b1b1b1'}}><span style={{fontWeight:'bold', color:'black'}}>Note</span> : Your profile picture is successfully updated, but it main take a minute to update on the website.</p>
          </div>}

        </div>
        {(this.state.step == 2)&&<div style={{ boxSizing: 'border-box', padding: '20px', position: 'absolute', width: '100%', bottom: '0px', display:'inline-flex' }}>
          <Button variant="dark" value="Close" disabled={true} style={{ width: '49%' }} onClick={()=>this.setState({step:1})}/> 
          <Button variant="primary" value="Done" disabled={true} style={{ width: '49%', margin:'auto', marginRight:'0px' }} onClick={()=>this.props.closeModal()}/>
        </div>}
        {(this.state.step == 1)&&<div style={{ boxSizing: 'border-box', padding: '20px', position: 'absolute', width: '100%', bottom: '0px' }}>
          <Button variant="dark" value="Close" disabled={true} style={{ width: '100%' }} onClick={()=>this.props.closeModal()}/>
        </div>}
      </div>
    );
  }
}


class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalContent: <ChangeAvatar />, modalOpen: false };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(compo) {
    this.setState({ modalContent: compo, modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    let path;
    let currentDate = new Date();

    if (this.props.absolute_filename) {
      path = this.props.absolute_filename 
    }
    if (this.props.filename) {
      path = `${globals.backend_url}/static/avatars/` + this.props.filename
    }
    if(this.props.forceReload){
      path += '?t=' + currentDate.getTime();
    }else{
      path += '?t=' + currentDate.getMinutes();
    }
    if (this.props.avatarSquare) {
      return (
        <div style={{ height: this.props.dim, width: this.props.dim, borderRadius: '7px' }}>
          <div style={{ height: '100%', width: '100%', backgroundImage: `url('${globals.backend_url}/static/avatars/default.jpg')`, backgroundPosition: 'center', backgroundSize: 'cover', position: 'relative', borderRadius: '7px', boxShadow:'0px 0px 5px #0000001a' }}>
            <div style={{ height: '100%', width: '100%', backgroundImage: `url(${path})`, backgroundPosition: 'center', backgroundSize: 'cover', position: 'relative', borderRadius: '7px', boxShadow:'0px 0px 5px #0000001a' }}>
          </div>
          </div>
          <Modal open={this.state.modalOpen} onClose={this.closeModal} center style={{ padding: '0px' }}>
            {this.state.modalContent}
          </Modal>
        </div>
      );
    } else {
      return (
        <div style={this.props.style}>

        <div style={{ height: this.props.dim, width: this.props.dim, borderRadius: this.props.radius ? this.props.radius : '50%', border: '2px solid #EBEBEB', boxSizing: 'border-box', padding: '2px' }}>
          <div style={{ height: '100%', width: '100%', borderRadius: this.props.radius ? this.props.radius : '50%', backgroundImage: `url(${path}),url('${globals.backend_url}/static/avatars/default.jpg')`, backgroundPosition: 'center', backgroundSize: 'cover', position: 'relative' }}>
            {this.props.showEdit && <Button onClick={() => this.openModal(<ChangeAvatar closeModal={this.closeModal} />)} variant="transparent curvy" innerPadding="6px" buttonCenterIcon={<Camera style={{ height: '100%', width: '100%' }} />} style={{ width: '30px', height: '30px', border: '2px solid #ffffff', backgroundColor: '#f3f3f3', position: 'absolute', bottom: '0px', right: '0px' }} />}
          </div>
          <Modal open={this.state.modalOpen} onClose={this.closeModal} center style={{ padding: '0px' }}>
            {this.state.modalContent}
          </Modal>
        </div>
        </div>

      );
    }
  }
}
export { Avatar, ChangeAvatar }