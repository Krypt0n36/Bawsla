import React from 'react';


export default class DebitCard extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"  width="516" height="307" style={this.props.style} viewBox="0 0 516 307">
                <defs>
                    <linearGradient id="linear-gradient" y1="0.5" x2="1" y2="0.527" gradientUnits="objectBoundingBox">
                        <stop offset="0" />
                        <stop offset="1" stop-color="#454242" />
                    </linearGradient>
                    <linearGradient id="linear-gradient-2" x1="1.104" y1="0.371" x2="0.125" y2="0.957" gradientUnits="objectBoundingBox">
                        <stop offset="0" stop-color="#fff" stop-opacity="0.2" />
                        <stop offset="1" stop-color="gray" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <g id="Group_321" data-name="Group 321" transform="translate(-9524 -6430)">
                    <g id="Group_318" data-name="Group 318">
                        <rect id="Rectangle_336" data-name="Rectangle 336" width="516" height="307" rx="18" transform="translate(9524 6430)" fill="url(#linear-gradient)" />
                        <path id="Icon_material-account-balance" data-name="Icon material-account-balance" d="M6,15V25.5h4.5V15Zm9,0V25.5h4.5V15ZM3,33H31.5V28.5H3ZM24,15V25.5h4.5V15ZM17.25,1.5,3,9v3H31.5V9Z" transform="translate(9970 6455.5)" fill="#fff" />
                        <path id="Path_308" data-name="Path 308" d="M9524,6583.5s49.036,27.287,84.65,65.407,57.808,87.072,57.808,87.072H9524Z" fill="url(#linear-gradient-2)" />
                        <text id="XXXX_XXXX_XXXX_XXXX" data-name="XXXX XXXX XXXX XXXX" transform="translate(9563 6627)" fill="#fff" font-size="23" font-family="Mulish" letter-spacing="0.4em"><tspan x="0" y="0">{this.props.serial}</tspan></text>
                        <text id="Hassen_Belani" data-name="Hassen Belani" transform="translate(9563 6709)" fill="#fff" font-size="20" font-family="Mulish"><tspan x="0" y="0">{this.props.holder_name}</tspan></text>
                        <text id="_03_21" data-name="03/21" transform="translate(9948 6709)" fill="#fff" font-size="20" font-family="Mulish"><tspan x="0" y="0">{this.props.expiration}</tspan></text>
                        <rect id="Rectangle_337" data-name="Rectangle 337" width="54" height="38" rx="4" transform="translate(9563 6551)" fill="#e0970e" />
                    </g>
                </g>
            </svg>
        );
    }
}