import React, { Fragment } from 'react';
import './textbox.css';
import toggleDownIcon from './../icons/toggle-down.svg';
import { Button } from './../Buttons/Buttons.js';
import removeIcon from './remove.svg';
import { ChevronDown } from 'react-feather';

class Diza extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value:'', words:[]}

        this.handleChange = this.handleChange.bind(this);
        this.removeNode = this.removeNode.bind(this)
    }
    removeNode(index){
        var arr = this.state.words;
        arr.pop(index);
        this.setState({words:arr});
    }
    handleChange(e){
        if(e.target.value == 'xx'){
            var arr = this.state.words;
            arr.pop()
            this.setState({words:arr}, ()=>{
                this.setState({value:''})
            });
        }
        if(e.target.value[e.target.value.length - 1] == ','){
            if(this.state.value.length > 0){
                var arr = this.state.words;
                arr.push(this.state.value);
                this.setState({words:arr}, ()=>{
                    this.setState({value:''})
            });
            }
            
        }else{
            this.setState({value:e.target.value});
        }
    }
    render() {
        return (
            <div style={this.props.style} className={"textbox " + this.props.className}>
                {this.state.words.map((item,index)=><div style={{backgroundColor:'#ebebeb',padding:'5px 10px 5px 20px', borderRadius:'20px', margin:'auto', marginRight:'5px', display:'inline-flex'}}><span>{item}</span> <img style={{marginLeft:'10px'}} src={removeIcon} onClick={()=>this.removeNode(index)} /></div>)}
                <input name={this.props.name} value={this.state.value} onChange={this.handleChange} type={this.props.type} className="textbox-kernel" readOnly={this.props.readonly}  placeholder={this.props.placeholder} />
            </div>
        );
    }
}

class Textbox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={this.props.style} className={"textbox " + this.props.className}>
                {this.props.icon && <div className="tb-icon">{this.props.icon}</div>}
                <input name={this.props.name} onChange={this.props.onChange} type={this.props.type} className="textbox-kernel" readOnly={this.props.readonly} value={this.props.value} placeholder={this.props.placeholder} />
                {this.props.button2 && <div className="tb-button-container">{this.props.button2}</div>}
                {this.props.button && <div className="tb-button-container">{this.props.button}</div>}
            </div>
           

        );
    }
}

class DropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false, value: this.props.value, meta_value: null };

        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }
    handleClick() {
        this.setState({ visible: !this.state.visible })


    }
    handleSelect(val, index) {
        this.setState({ value: val, meta_value: index }, () => { this.props.onChange({ target: { name: this.props.name, value: this.state.meta_value } }) });
        //this.setState({value:val, meta_value:index})
        this.handleClick();
    }

    render() {
        return (
            <div className="dropdown-container" ref={this.container} style={this.props.style}>
                <Textbox style={{ width: '100%' }} name={this.props.name} value={this.state.value} readOnly={true} icon={this.props.icon} button={<Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px', width: '30px', padding: '0px' }} innerPadding="5px" buttonCenterIcon={<ChevronDown style={{width:'100%', height:'100%'}} />}></Button>} />
                <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
                    {this.props.data.map((item, index) => <div className="dropdown-item" onClick={() => this.handleSelect(item, index)}>{item}</div>)}
                </div>
            </div>
        );
    }
}




class SearchTextbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false, value: this.props.value };

        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }
    handleClick() {
        this.setState({ visible: !this.state.visible });
    }
    handleSelect(val) {
        this.setState({ value: val });
        this.handleClick();
    }
    handleChange(e) {
        if (this.state.visible != true) {
            this.setState({ visible: !this.state.visible })
        }
        this.setState({ value: e });
    }
    render() {
        return (
            <div>
                <div className="dropdown-container" ref={this.container} style={this.props.style}>
                    <Textbox style={{ width: '100%' }} value={this.state.value} onChange={this.handleChange} icon={this.props.icon} button={<Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px' }} buttonCenterIcon={toggleDownIcon}></Button>} />
                    <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
                        {this.props.data.map((item) => <div className="dropdown-item" onClick={() => this.handleSelect(item)}>{item}</div>)}
                    </div>
                </div>
            </div>
        );
    }
}




class LocationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false, value: this.props.value, data: this.props.data };

        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }

    handleClick() {
        this.setState({ visible: !this.state.visible })


    }
    handleSelect(key) {
        this.setState({ value: this.props.data[key].name }, () => {
            this.props.onSelect(key);
        });
        this.handleClick();
    }

    render() {
        return (
            <div className="dropdown-container" ref={this.container} style={this.props.style}>
                <Textbox style={{ width: '100%' }} value={this.state.value} readOnly={true} icon={this.props.icon} button={<Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px', width: '30px', padding: '0px' }} innerPadding="5px" buttonCenterIcon={<ChevronDown style={{width:'100%', height:'100%'}} />}></Button>} />
                <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
                    {this.props.data.map((item, index) => <div className="dropdown-item" onClick={() => this.handleSelect(index)}>{item.name}</div>)}
                </div>
            </div>
        );
    }
}

class TextArea extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <textarea value={this.props.value} onChange={this.props.onChange} name={this.props.name} style={this.props.style} className="textarea" />
        );
    }
}


class LocationPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mapData: [], list: [], regionList: [], visible: false, value: this.props.value, meta_value: null };
        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }
    handleClick() {
        this.setState({ visible: !this.state.visible })


    }
    handleSelect(item, index) {
        var arr = [{ name: 'Back' }];
        for (var key in item.regions) {
            arr[key] = item.regions[key];
        }

        this.setState({ value: item.name, meta_value: index, regionList: arr });
        // ()=>{
        //    this.props.onChange({target:{name:this.props.name, value:this.state.meta_value}})}
        //this.setState({value:val, meta_value:index})
        this.handleClick();
    }

    componentWillMount() {
        fetch('/map.json')
            .then(resp => resp.json())
            .then((data) => {
                let arr = []
                for (var key in data) {
                    arr[key] = data[key];
                }
                this.setState({ mapData: arr, list: arr }, () => {
                    //console.log(this.state.mapData)
                });

            })
    }
    render() {
        return (
            <div>

                {this.state.mapData.map((item => <span>{item.name}</span>))}
                <div className="dropdown-container" ref={this.container} style={this.props.style}>
                    <Textbox style={{ width: '100%' }} name={this.props.name} value={this.state.value} readOnly={true} icon={this.props.icon} button={<Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px', width: '30px', padding: '0px' }}innerPadding="0px"  buttonCenterIcon={toggleDownIcon}></Button>} />
                    <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
                        {this.state.list.map((item, index) => <div className="dropdown-item" onClick={() => this.handleSelect(item, index)}>{item.name}</div>)}
                    </div>
                </div>


                <div className="dropdown-container" ref={this.container} style={this.props.style}>
                    <Textbox style={{ width: '100%' }} name={this.props.name} value={this.state.value} readOnly={true} icon={this.props.icon} button={<Button onClick={this.handleClick} variant="transparent square" style={{ height: '30px', width: '30px', padding: '0px' }} innerPadding="0px" buttonCenterIcon={toggleDownIcon}></Button>} />
                    <div className={"dropdown-data"} style={{ display: ((this.state.visible == true) ? "block" : "none") }}>
                        {this.state.regionList.map((item, index) => <div className="dropdown-item" onClick={() => this.handleSelect(item, index)}>{item.name}</div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export { Textbox, LocationPicker, DropDown, LocationSelector, TextArea, Diza };