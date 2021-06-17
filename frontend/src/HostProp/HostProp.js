import React from 'react';
import {DropDown, TextArea, Textbox, LocationSelector, Diza} from './../Textbox/Textbox';
import {Button} from './../Buttons/Buttons';
import StepIndic from './StepIndic';
import arrowIcon from './../icons/button-right-arrow.svg'
import {FilePicker} from 'react-file-picker';
import plusIcon from './plus-circle.svg';
import deleteIcon from './delete.svg';
import cookies from 'react-cookies';
import Well from '../Well/Well';
import { LocationPicker } from '../Map/Map';
import { ArrowRight } from 'react-feather';
import globals from './../var';

/* Default position */
const defaultPosition = {
  lat: 36.544318,
  lng: 9.615462
};

class LilFrame extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="lil" style={this.props.style}>
                <img src={plusIcon} style={{margin:'auto'}}/>
            </div>
        );
    }
}

class ImageThumb extends React.Component{
    constructor(props){
        super(props);
        this.state = {hovered:true};
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

    }
    onMouseEnter(){
        this.setState({hovered:false});
    }
    onMouseLeave(){
        this.setState({hovered:true});

    }

    render(){
        return (
            <div className="thumb"  style={{margin:'5px', backgroundPosition:'center', backgroundSize:'cover', backgroundImage:`url('${this.props.data['url']}')`}}  onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className="thumb-delete" hidden={this.state.hovered}>
                    <img src={deleteIcon}/>
                </div>
            </div> 
        );
    }
}

class Step4 extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div style={{display:'inline-flex', flexWrap:'wrap', width:'700px'}}>
                <div style={{width:'33.33%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Year built: </label>
                        <Textbox style={{width:'100%',marginTop:'5px'}}   name="prop_title" />
                </div>
                <div style={{width:'33.33%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Bedrooms: </label>
                        <Textbox style={{width:'100%',marginTop:'5px'}}   name="prop_title" />
                </div>
                <div style={{width:'33.33%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Bathrooms: </label>
                        <Textbox style={{width:'100%',marginTop:'5px'}}   name="prop_title" />
                </div>
                <div style={{width:'33.33%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Parking: </label>
                        <Textbox style={{width:'100%',marginTop:'5px'}}   name="prop_title" />
                </div>
                <div style={{width:'33.33%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Independant entry: </label>
                        <Textbox style={{width:'100%',marginTop:'5px'}}   name="prop_title" />
                </div>
                <div style={{width:'100%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>Equipements : </label>
                        <Diza name="equipements" style={{width:'100%',marginTop:'5px', overflowX:'scroll'}} />
                </div>
            </div>
        );
    }
}

class Step3 extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div style={{display:'inline-flex', flexWrap:'wrap', width:'700px'}}> 
                {this.props.files.map((item) => <ImageThumb  data={item}/>)}
                <FilePicker
          extensions={["jpg", "png", "jpeg"]} // Notice that I removed the "."
          onChange={FileObj => this.props.onFileUpload(FileObj)}
          onError={errMsg => console.log(errMsg)} // Please handle error
        >
          <div><LilFrame style={{margin:'5px'}} /></div>
        </FilePicker>
            </div>
        );
    }
}


/*
<LocationPicker
            containerElement={ <div style={ {height: '100%'} } /> }
            mapElement={ <div style={ {height: '100%'} } /> }
            defaultPosition={defaultPosition}
            onChange={this.props.onMapChange}
          />
*/
class Step2 extends React.Component{
    constructor(props){
        super(props);
        this.state = {mapData:[], regionList:[], city_value:null, region_value:null}
        this.handleSelect = this.handleSelect.bind(this)
      }
      componentWillMount(){
        fetch('/map.json')
            .then(resp=>resp.json())
            .then((data)=>{
                let arr = []
                for(var key in data){
                    arr[key] = data[key];
                }
                this.setState({mapData:arr}, ()=>{
                    //console.log(this.state.mapData)
                });
                
            })
    }
    handleSelect(key2){
        var arr = []
        for(var key in this.state.mapData[key2].regions){
          arr[key] = this.state.mapData[key2].regions[key];
        } 
        this.setState({regionList:arr, city_value:this.state.mapData[key2].name},()=>{
            this.props.onChange({target:{name:'location_city', value:this.state.mapData[key2].name}})
        });
      }
    handleSelectRegion(key){
        this.setState({region_value:this.state.regionList[key].name}, ()=>{
            this.props.onChange({target:{name:'location_region', value:this.state.regionList[key].name}})
        });
    }
    render(){
        return (
            <div style={{display:'inline-flex', flexWrap:'wrap', width:'700px'}}>
                <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label style={{marginBottom:'5px'}}>City name : </label>
                        <LocationSelector value="City" style={{width:'100%'}} style={{marginTop:'5px'}} data={this.state.mapData} onSelect={(key)=>{this.handleSelect(key)}}/>

                </div>
                <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Region : </label>
                        <LocationSelector  style={{width:'100%'}} style={{marginTop:'5px'}}  data={this.state.regionList} onSelect={(key)=>{this.handleSelectRegion(key)}}/>
                </div>
                <div style={{width:'100%', padding:'5px', boxSizing:'border-box'}}>
                    <div style={{width:'100%', height:'300px', backgroundColor:'#EBEBEB', borderRadius:'7px'}}>
                        <LocationPicker style={{width:'100%', height:'100%'}}
            onMapChange={this.props.onMapChange}
            />
                    </div>
                </div>
            </div>
        );
    }
}

class Step1 extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
           <div style={{display:'inline-flex', flexWrap:'wrap', width:'700px'}}>
                    
                    <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Status: </label>
                        <DropDown data={['For rent', 'For sale', 'Colocation']} style={{marginTop:'5px'}} onChange={this.props.onChange}  name="prop_status" />

                    </div>
                    <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Type: </label>
                        <DropDown data={['Duplex', 'Apartment', 'Studio', 'House']} style={{marginTop:'5px'}} onChange={this.props.onChange}  name="prop_type" />

                    </div>
                    <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Price (Dinars): </label>
                        <div style={{display:'inline-flex'}}>
                        <Textbox style={{width:'100%',marginTop:'5px', marginRight:'5px'}} onChange={this.props.onChange}  name="prop_price"  />
                        <DropDown value="Monthly" data={['Monthly', 'Nightly']} style={{marginTop:'5px'}} onChange={this.props.onChange}  name="prop_price_duration" />
                        </div>  
                    </div>
                   
                    <div style={{width:'50%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Number of rooms (S+): </label>
                        <DropDown data={['1', '2', '3', '4']} style={{marginTop:'5px'}} onChange={this.props.onChange}  name="prop_piece" />
                    
                    </div>
                    <div style={{width:'100%', padding:'5px', boxSizing:'border-box'}}>
                        <label>Description: </label>
                        <TextArea style={{width:'100%', height:'150px', marginTop:'5px'}} onChange={this.props.onChange}  name="prop_desc"  />
                    </div>
           </div> 
        );
    }
}

export default class HostProp extends React.Component{
        constructor(props){
            super(props);    
            this.state = {step:1, stepTitle:'General information',
                identifier:cookies.load('user_id'),
                session_token:cookies.load('session_token'),
                prop_title:null,
                prop_status:null,
                prop_price:null,
                prop_piece:null,
                prop_desc:null,
                location_city:null,
                location_region:null,
                location_cord:null,
                images:[]
            };
            this.handleNext = this.handleNext.bind(this);
            this.handlePrev = this.handlePrev.bind(this);
            this.changeTitle = this.changeTitle.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.handleFileUpload = this.handleFileUpload.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleLocationChange = this.handleLocationChange.bind(this);

        }
        handleLocationChange (position) {
            if(position){
            // Set new location
            this.setState({ location_cord:position}, ()=>{
                console.log(this.state.location_cord)
            });
            }else{
                console.log('position is not defined')
            }
          }
        handleFileUpload(fileObj){
            const data = new FormData();
            data.append('file', fileObj);
            data.append('identifier', cookies.load('user_id'));
            data.append('session_token', cookies.load('session_token'));

            fetch(`${globals.backend_url}/api/uploadFile`, {
                method:'POST',
                body:data,
            }).then((response) => {
                response.json().then((data)=>{
                    console.log(data);
                    var n_arr = this.state.images;
                    n_arr.push({url:data['direct_link'],imid:data['fid']});
                    this.setState({images:n_arr});
                })
              });
                
        }
        handleSubmit(){
            var params = `identifier=${cookies.load('user_id')}&session_token=${cookies.load('session_token')}&prop_type=${this.state.prop_type}&prop_status=${this.state.prop_status}&prop_price=${this.state.prop_price}&prop_piece=${this.state.prop_piece}&prop_desc=${this.state.prop_desc}&location_city=${this.state.location_city}&location_region=${this.state.location_region}&location_cord_lat=${this.state.location_cord.lat}&location_cord_lng=${this.state.location_cord.lng}&images=${JSON.stringify(this.state.images)}`
            //var staticp = 'identifier=1&session_token=NYEAAGF4TK1KQ44R8USTC2XRJU85OKQG&prop_title=weeb&prop_status=for rent&prop_price=200&prop_piece=0&prop_desc=jjjjj&location_city=0&location_region=1&images=[{"url":"http://localhost:5000/static/uploads/15.jpg","imid":15}]'
            console.log (params);
            fetch(`${globals.backend_url}/api/listing/add`, 
            {
                method:'POST',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                body: params
            })
                .then((res)=>res.json())
                .then((data)=>{
                    console.log(data);
                    if(data.status == 'ok'){
                        this.props.closeModal()
                    }else{
                        alert('Error while creating listing, please make sure you provided all the necessary info.')
                    }
                })
        }
        changeTitle(){
            var title = '';
            if(this.state.step == 1){
                title = 'General information'
            }else if(this.state.step == 2){
                title = 'Geografic details'
            }else if(this.state.step == 3){
                title = 'Asset Images'
            }
            this.setState({stepTitle:title});
        }
        handleNext(){
            if(this.state.step == 3){
                this.handleSubmit()
            }else{
            
            this.setState({step:this.state.step+1}, ()=>{this.changeTitle();});
            }
        }
        handlePrev(){
            if(this.state.step == 1){
                // do code
            }else{
                this.setState({step:this.state.step-1},  ()=>{this.changeTitle();});
            }

        }
        handleChange(event){
            try{
                event.preventDefault();
            }catch{
                
            }
            console.log(event.target.name+' = '+event.target.value);
    
            this.setState({[event.target.name]:event.target.value}, ()=>{
            });
        }

        render (){
            if(this.props.extended){
                return (
                    <div style={{padding:'1%'}}>
                    <Well style={{marginBottom:'10px'}} >
                        <h2>Basic information :</h2>
                        <Step1 onChange={(this.handleChange)} ></Step1>
                        <div style={{width:'100%', textAlign:'right', boxSizing:'border-box', padding:'5px'}}>
                            <Button variant="primary" value="Save" style={{margin:'auto', marginRight:'0px'}} />
                        </div>
                    </Well>
                    <Well style={{marginBottom:'10px'}} >
                        <h2>Geografic information :</h2>
                        <Step2 onChange={this.handleChange} onMapChange={this.handleLocationChange} /><br></br>
                        <div style={{width:'100%', textAlign:'right', boxSizing:'border-box', padding:'5px'}}>
                            <Button variant="primary" value="Save" style={{margin:'auto', marginRight:'0px'}} />
                        </div>    
                    </Well>
                    <Well style={{marginBottom:'10px'}} >
                        <h2>Photos :</h2>
                        <Step3 onChange={this.handleChange} files={this.state.images} onFileUpload={this.handleFileUpload} /><br></br>
                        <div style={{width:'100%', textAlign:'right', boxSizing:'border-box', padding:'5px'}}>
                            <Button variant="primary" value="Save" style={{margin:'auto', marginRight:'0px'}} />
                        </div>
                    </Well>
                    <Well style={{marginBottom:'10px'}} >
                        <h2>Property details :</h2>
                        <Step4  /><br></br>
                        <div style={{width:'100%', textAlign:'right', boxSizing:'border-box', padding:'5px'}}>
                            <Button variant="primary" value="Save" style={{margin:'auto', marginRight:'0px'}} />
                        </div>
                    </Well>
                </div>     
                );
            }else{

            return(
                <div style={{ borderRadius: '7px', width: '100%', position: 'relative' }}>
            <div style={{ backgroundColor: 'black', boxSizing: 'border-box', paddingTop: '2px', paddingBottom: '2px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ color: 'white' }}>Post property</h2>
            </div>
            <div style={{ boxSizing: 'border-box', padding: '20px' }}>
            <div style={{width:'100%', padding:'5px', boxSizing:'border-box', marginBottom:'20px'}}>
                        <StepIndic step={this.state.step}/>
                    </div>
                    <div style={{width:'100%', height:'400px', overflowX:'scroll'}}>
                    {(this.state.step==1)&&<Step1 onChange={this.handleChange} />}
                    {(this.state.step==2)&&<Step2 onChange={this.handleChange} onMapChange={this.handleLocationChange} />}
                    {(this.state.step==3)&&<Step3 onChange={this.handleChange} files={this.state.images} onFileUpload={this.handleFileUpload} />}
                    </div>

                    <div style={{width:'100%', padding:'5px', paddingTop:'10px', paddingBottom:'10px', borderTop:'1px solid #EBEBEB', position:'relative'}}>
                        <Button variant="secondary" onClick={this.handlePrev} value="Previous" innerPadding="10px"  style={{margin: 'auto'}}/>
                        <Button variant="primary" onClick={this.handleNext} buttonRightIcon={<ArrowRight style={{width:'100%', height:'100%'}} />} value="Next" style={{position:'absolute', right:'12px'}}/>
                    </div>
            </div>
            </div>
                
            );
        }

        }
}


