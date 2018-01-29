import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hallAction from '../../../redux/actions/hall-actions';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import ProfileCard from '../../../component/profile-card';
import { CompanyEnum } from '../../../../config/db-config';
import { ButtonLink } from '../../../component/buttons';
import * as layoutActions from '../../../redux/actions/layout-actions';

import { BOTH, S2C, C2S } from '../../../../config/socket-config';
import { socketOn } from '../../../socket/socket-client';

import { getAuthUser, isAuthorized } from '../../../redux/actions/auth-actions';

import CompanyPopup from '../popup/company-popup';

require('../../../css/company-sec.scss');

export const getCompanyCSSClass = function (type) {
    var className = "";
    switch (type) {
        case CompanyEnum.TYPE_SPECIAL:
            className = "blue";
            break;
        case CompanyEnum.TYPE_PLATINUM:
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

    return className;
};

const sec = "com-sec";

//real time with socket need to use redux    
class CompanyBooth extends React.Component {
    constructor(props) {
        super(props);

        this.ID = this.props.company.ID;
    }

    // update by socket  
    loadOnlineRec() {
        //socket.on("rec_online")  
        // check if ID is equal to this ID    
    }

    render() {

        var countItem = [{
            count: this.props.onlineRec,
            label: "Recruiters Online"
        }, {
            //count: (this.props.traffic !== null) ? this.props.traffic.active_queues_count : 0,
            count: this.props.countQueue,
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
        var onClick = () => layoutActions.storeUpdateFocusCard(this.props.company.name, CompanyPopup, { id: this.props.company.ID });
        var pcTitle = this.props.company.name;

        var className = getCompanyCSSClass(this.props.company.type);

        return (<ProfileCard className={className} onClick={onClick} type="company"
            title={pcTitle}
            img_url={this.props.company.img_url} img_pos={this.props.company.img_position} img_size={this.props.company.img_size}
            body={pcBody}></ProfileCard>);

        return (<div>
            <b>{this.props.company.name} ({this.props.company.ID}) Type : {this.props.company.type}</b>
            <br></br>
            <small>{this.props.company.tagline}</small>
            {counts}
        </div>);
    }
}

CompanyBooth.propTypes = {
    company: PropTypes.object.isRequired,
    traffic: PropTypes.object,
    onlineRec: PropTypes.number.isRequired,
    countQueue: PropTypes.number.isRequired
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
        
        //this.props.loadTraffic();

        socketOn(S2C.ONLINE_COMPANY, (data) => {
            this.props.setNonAxios("onlineCompanies", data);
        });

        socketOn(BOTH.QUEUE_STATUS, (data) => {
            this.props.setNonAxios("queueCompanies", data);
        });

    }

    // add socket on here
    refreshTraffic() {
        this.props.loadTraffic();
    }

    render() {

        // to see data structure
        //alert(JSON.stringify(this.props.queueCompanies));
        //alert(JSON.stringify(this.props.onlineCompanies));


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

                //this is from socket
                var onlineRec = (this.props.onlineCompanies[d.ID])
                    ? Object.keys(this.props.onlineCompanies[d.ID]).length
                    : 0;

                var countQueue = (this.props.queueCompanies[d.ID])
                    ? this.props.queueCompanies[d.ID]
                    : 0;

                return <CompanyBooth key={i} onlineRec={onlineRec}
                    countQueue={countQueue}
                    company={d}
                    traffic={trf}></CompanyBooth>;
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
        companies: state.hall.companies,
        onlineCompanies: state.hall.onlineCompanies,
        queueCompanies: state.hall.queueCompanies
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadTraffic: hallAction.loadTraffic,
        loadCompanies: hallAction.loadCompanies,
        setNonAxios: hallAction.setNonAxios
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CompaniesSection);




