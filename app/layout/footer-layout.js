import React, { Component } from 'react';
import {AppConfig, ImgConfig, OrgConfig} from '../../config/app-config';
import {ButtonIcon} from '../component/buttons';
import {openNewTab} from '../lib/util';

require("../css/footer.scss");

class FixedImg extends React.Component {
    render() {
        var style = {
            backgroundImage: `url(${this.props.url})`,
            width: this.props.width + "px",
            height: this.props.height + "px",
            backgroundSize: "cover", 
            margin: "auto"
        };

        return(<div style={style}></div>);
    }
}


export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        var list = [{
                title: "ORGANIZED BY",
                items: OrgConfig.Organizer
            }, {
                title: "IN COLLABORATION WITH",
                items: OrgConfig.Collaborator
            }
        ];

        //{(d.shortname !== "") ? ` (${d.shortname})` : null}
        this.orgs = list.map(function (d, i) {
            var items = d.items.map((d, i) =>
                <li key={i}>{d.name}</li>
            );

            return (<div key={i} className="orgs">
            <div className="col-sm-4">  
                <h3 className="title">{d.title}</h3>
                <ul>{items}</ul>
            </div>
        </div>);
        });

        var date = new Date();
        var year = date.getYear() + 1900;
        var btn_size = "25px";
        this.brand = (<div className="brand">  
            <h3 className="title">SEEDS JOB FAIR<br></br>powered by</h3>
        
        
            <FixedImg url={ImgConfig.IsIconInverse} height="66" width="145"></FixedImg>
            <div className="social"> 
                <ButtonIcon onClick={() => openNewTab(AppConfig.FbUrl)} 
                            theme="dark" icon="facebook-square" size={btn_size}></ButtonIcon>
                <ButtonIcon  onClick={() => openNewTab(AppConfig.WwwUrl)} 
                             theme="dark" icon="globe" size={btn_size}></ButtonIcon>
            </div>
            <div className="copyright"> 
                © {year}, Innovaseeds Solutions<br></br>All Rights Reserved
            </div>         
        </div>);
    }

    render() {
        return(<footer>
            <div className="container-fluid">
                {this.orgs}
                <div className="col-sm-4">
                    {this.brand}
                </div>
            </div> 
        </footer>);
    }
}