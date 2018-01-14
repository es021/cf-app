import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hallAction from '../../../redux/actions/hall-actions';
import PropTypes from 'prop-types';
import {Loader} from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import {CompanyEnum}  from '../../../../config/db-config';
import {ButtonLink} from '../../../component/buttons';
import * as layoutActions from '../../../redux/actions/layout-actions';

import CompanyPopup from '../popup/company-popup';

require('../../../css/company-sec.scss');

const sec = "com-sec";

//real time with socket need to use redux    
class CompanyBooth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            online_rec: 0
        };

        this.ID = this.props.company.ID;
    }

    // update by socket  
    loadOnlineRec() {
        //socket.on("rec_online")  
        // check if ID is equal to this ID    
    }

    render() {

        var countItem = [{
                count: this.state.online_rec,
                label: "Recruiters Online"
            }, {
                count: (this.props.traffic !== null) ? this.props.traffic.active_queues_count : 0,
                label: "Students Queueing"
            }
            /*, {
                count: (this.props.traffic !== null) ? this.props.traffic.active_prescreens_count : 0,
                label: "Students PreScreen"
            }*/
            , {
                count: this.props.company.vacancies_count,
                label: "Open Vacancy"
            }];

        countItem = countItem.map((d, i) => {
            var style = {};
            if ((d.count > 0)) {
                style = {
                    color: "green", 
                    opacity: "1"
                };
            }
            return (<li key={i} style={style}>
                <div className={`${sec}-count`}>{d.count}</div>
                <div className={`${sec}-label`}>{d.label}</div>
            </li>);
        });

        var counts = (<ul className={`${sec}-status`}>
            {countItem}
        </ul>);

        //var pcBody = <div>({this.props.company.ID}) Type : {this.props.company.type} {counts}</div>;
        var pcBody = counts;
        var onClick = () => layoutActions.storeUpdateFocusCard(this.props.company.name, CompanyPopup, {id: this.props.company.ID});
        var pcTitle = this.props.company.name;

        var className = "";
        switch (this.props.company.type) {
            case CompanyEnum.TYPE_SPECIAL:
                className = "blue";
                break;
            case CompanyEnum.TYPE_GOLD:
                className = "gold";
                break;
            case CompanyEnum.TYPE_SILVER:
                className = "silver";
                break;
            case CompanyEnum.TYPE_BRONZE:
                className = "bronze";
                break;
        }

        return(<ProfileCard className={className} onClick={onClick} type="company"
                     title={pcTitle}
                     img_url={this.props.company.img_url} img_pos={this.props.company.img_position} img_size={this.props.company.img_size}
                     body={pcBody}></ProfileCard>);

        return(<div>
        <b>{this.props.company.name} ({this.props.company.ID}) Type : {this.props.company.type}</b>
        <br></br>
        <small>{this.props.company.tagline}</small>
        {counts}
    </div>);
    }
}

CompanyBooth.propTypes = {
    company: PropTypes.object.isRequired,
    traffic: PropTypes.object
};

class CompaniesSection extends React.Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.refreshTraffic = this.refreshTraffic.bind(this);
        console.log("Hall", "HallPage");
        this.traffic = {};
    }

    componentWillMount() {
        this.props.loadCompanies();
        this.props.loadTraffic();
    }

    // add socket on here
    refreshTraffic() {
        this.props.loadTraffic();
    }

    render() {
        var companies = this.props.companies;
        var traffic = this.props.traffic;

        var loading = <Loader size="3" text="Loading Companies.."></Loader>;

        var view = [];
        if (companies.fetching) {
            view = loading;
        } else {
            companies = (companies.data.companies) ? companies.data.companies : null;

            var comView = companies.map((d, i) => {
                // booth traffic and companies order by need to set the same in order for this to work
                var trf = (!traffic.fetching || traffic.data.companies) ? traffic.data.companies[i] : null;
                return <CompanyBooth  key={i} company={d} traffic={trf}></CompanyBooth>;
            });

            var btn = <a onClick={this.refreshTraffic}>Refresh Line</a>;

            view = <div>
                {btn}
                <div className={sec}>
                    {comView}
                </div>
            </div>
        }

        return view;
    }
}

function mapStateToProps(state, ownProps) {
    return {
        traffic: state.hall.traffic,
        companies: state.hall.companies
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadTraffic: hallAction.loadTraffic,
        loadCompanies: hallAction.loadCompanies
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CompaniesSection);




