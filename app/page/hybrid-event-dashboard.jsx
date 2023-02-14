import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppPath, isProd, StatisticUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { StatisticFigure } from '../component/statistic';
import { getAuthUser, getCF, getCompanyId, isRoleAdmin, isRoleOrganizer, isRoleRec } from '../redux/actions/auth-actions';
import EventManagement from './event-management';
import { Loader } from '../component/loader';
import { ButtonExport } from '../component/buttons';
import { getCfEndUnix, isPastCfEnd } from './partial/activity/scheduled-interview';
import { Time } from '../lib/time';
import { _student_plural, _student_single } from '../redux/actions/text-action';
var Chart = require('chart.js');
// import CanvasJSReact from '../lib/canvasjs/canvasjs.react';
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HybridEventDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = getAuthUser().id;
        this.cf = getCF();
        this.state = {
            countCheckin: "-",
            countCompanyScanned: "-",
            countUserScanned: "-",
            dataHourlyQrCheckIn: null,
            dataHourlyExhibitorScanned: null,
            cfUsers: [],
            loadingCfUsers: true,
            cfCompanies: [],
            loadingCfCompanies: true,
        };
    }

    // componentDidMount() {
    //     this.renderChartQrCheckIn();
    // }

    componentWillMount() {
        graphql(`query{ qr_check_ins_count ( cf:"${this.cf}") }`).then(res => {
            this.setState({ countCheckin: res.data.data.qr_check_ins_count })
        })
        graphql(`query{ qr_scans_count (cf:"${this.cf}", type:"company" ${isRoleRec() ? `, company_id:${getCompanyId()}` : ``} ) }`).then(res => {
            this.setState({ countCompanyScanned: res.data.data.qr_scans_count })
        })
        graphql(`query{ qr_scans_count (cf:"${this.cf}", type:"user" ${isRoleRec() ? `, scanned_by_company_id:${getCompanyId()}` : ``} ) }`).then(res => {
            this.setState({ countUserScanned: res.data.data.qr_scans_count })
        })
        this.loadChartQrCheckIn();
        this.loadChartExhibitorScanned();
    }
    getOnlineUserCount() {
        // todo
        if (isPastCfEnd()) {
            return 0;
        }

        let count = 0;
        for (var uid in this.props.online_users) {
            uid = Number.parseInt(uid);
            let isOnline = this.props.online_users[uid];
            if (
                this.state.cfUsers.indexOf(uid) >= 0 &&
                isOnline == 1 &&
                uid != getAuthUser().ID
            ) {
                count++;
            }
        }

        return count;
    }
    getOnlineCompanyCount() {
        // this.props.online_companies : {"12":{"137":"Online"}}

        let count = 0;
        for (var cid in this.props.online_companies) {
            let isRecOnline = false;
            cid = Number.parseInt(cid);
            let recObj = this.props.online_companies[cid];
            if (recObj) {
                for (var recId in recObj) {
                    if (recObj[recId] == "Online") {
                        isRecOnline = true;
                        break;
                    }
                }
            }
            if (
                this.state.cfCompanies.indexOf(cid) >= 0 &&
                isRecOnline
            ) {
                count++;
            }
        }

        return count;
    }

    getStatisticClass() {
        return {
            marginBottom: '40px',
            minWidth: '250px'
        }
    }

    getStatisticView() {
        return [
            <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <StatisticFigure
                    title={`Check In`}
                    icon="sign-in"
                    value={this.state.countCheckin}
                    color="#469fec"
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
                        <b>View All Check In &#10230;</b>
                    </NavLink>}
                ></StatisticFigure>
            </div>,
            <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <StatisticFigure
                    title={isRoleRec() ? `Your Profile QR Scanned` : `Exhibitor QR Scanned`}
                    icon="building"
                    value={this.state.countCompanyScanned}
                    color="rgb(255, 97, 62)"
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
                        <b>View All Scan Record &#10230;</b>
                    </NavLink>}
                ></StatisticFigure>
            </div>,
            <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <StatisticFigure
                    title={isRoleRec() ? `${_student_single()} Scanned By You` : `${_student_single()} QR Scanned`}
                    icon="users"
                    value={this.state.countUserScanned}
                    color="#a44ba2"
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
                        <b>View All Scan Record &#10230;</b>
                    </NavLink>}
                ></StatisticFigure>
            </div>,
        ]
    }

    loadChartQrCheckIn() {
        postRequest(StatisticUrl + "/hourly-qr-check-in", { cf: getCF() }).then(res => {
            this.setState({ dataHourlyQrCheckIn: res.data });
            this.renderChartQrCheckIn();
        })
    }
    loadChartExhibitorScanned() {
        postRequest(StatisticUrl + "/hourly-company-scanned", {
            cf: getCF(),
            company_id: isRoleRec() ? getCompanyId() : null
        }).then(res => {
            this.setState({ dataHourlyExhibitorScanned: res.data });
            this.renderChartExhibitorScanned();
        })
    }

    renderChartExhibitorScanned() {
        var element = document.getElementById('chartExhibitorScanned');
        if (!element) {
            setTimeout(() => {
                this.renderChartExhibitorScanned();
            }, 1000)
        }

        let dataLabel = [];
        let dataSet = [];

        for (let d of this.state.dataHourlyExhibitorScanned) {
            dataLabel.push(d.dt);
            dataSet.push(d.ttl);
        }
        let data = {
            labels: dataLabel,
            datasets: [
                {
                    label: '# of Exhibitor\'s QR Scanned',
                    data: dataSet,
                    fill: false,
                    backgroundColor: '#469fec',
                    borderColor: 'rgb(130, 197, 255)',
                },
            ],
        }

        let options = {
            elements: {
                line: {
                    tension: 0
                }
            },
            bezierCurve: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                // when the floored value is the same as the value we have a whole number
                                if (Math.floor(label) === label) {
                                    return label;
                                }

                            },
                        }
                    },
                ],
            },
        }

        new Chart(element, {
            type: 'line',
            data: data,
            options: options
        });
    }
    renderChartQrCheckIn() {
        var element = document.getElementById('chartQrCheckIn');
        if (!element) {
            setTimeout(() => {
                this.renderChartQrCheckIn();
            }, 1000)
        }

        let dataLabel = [];
        let dataSet = [];

        for (let d of this.state.dataHourlyQrCheckIn) {
            dataLabel.push(d.dt);
            dataSet.push(d.ttl);
        }
        let data = {
            labels: dataLabel,
            datasets: [
                {
                    label: '# of Check Ins',
                    data: dataSet,
                    fill: false,
                    backgroundColor: '#469fec',
                    borderColor: 'rgb(130, 197, 255)',
                },
            ],
        }

        let options = {
            elements: {
                line: {
                    tension: 0
                }
            },
            bezierCurve: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                // when the floored value is the same as the value we have a whole number
                                if (Math.floor(label) === label) {
                                    return label;
                                }

                            },
                        }
                    },
                ],
            },
        }

        new Chart(element, {
            type: 'line',
            data: data,
            options: options
        });
    }
    chartQrCheckIn() {
        if (!this.state.dataHourlyQrCheckIn) {
            return <Loader></Loader>
        }
        return <div style={{ paddingRight: '' }}><canvas id="chartQrCheckIn" width="auto" height="100"></canvas></div>
    }
    chartExhibitorScanned() {
        if (!this.state.dataHourlyExhibitorScanned) {
            return <Loader></Loader>
        }
        return <div style={{ paddingRight: '' }}><canvas id="chartExhibitorScanned" width="auto" height="100"></canvas></div>
    }
    render() {
        document.setTitle("Hybrid Event Dashboard");
        return <div>
            <div style={{ margin: '32px 0px', justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
                {this.getStatisticView()}
            </div>
            <div className="container-fluid">
                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}><b>{_student_single()} Check In</b>
                        <br></br>
                        <div style={{ marginTop: '5px' }}>
                            ---:::: (put in listing page, from statistic)
                            <ButtonExport
                                style={{ margin: "5px" }} btnClass="green btn-bold btn-round-5" action="browse_student"
                                text={<span>Download Data </span>}
                                filter={`cf:"${getCF()}", company_id:null`} cf={getCF()}></ButtonExport>
                        </div>
                    </h2>
                    {this.chartQrCheckIn()}
                </div>
            </div>
            <div className="container-fluid">
                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}><b>Exhibitor Profile QR Scanned</b>
                        <br></br>
                        <div style={{ marginTop: '5px' }}>
                        ---:::: (put in listing page, from statistic)

                            <ButtonExport
                                style={{ margin: "5px" }} btnClass="green btn-bold btn-round-5" action="browse_student"
                                text={<span>Download Data</span>}
                                filter={`cf:"${getCF()}", company_id:null`} cf={getCF()}></ButtonExport>
                        </div>
                    </h2>
                    {this.chartExhibitorScanned()}
                </div>
            </div>
        </div>
    }
}



function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        online_users: state.user.online_users,
        online_companies: state.user.online_companies
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(HybridEventDashboard);


    //     // - Total number of check-in
    //     // - Total number of company profile QR scanned
    //     // - Total number of visitor QR scanned by exhibitors

    //     // - Total number of check-in
    //     // - Total number of this particular exhibitor profile QR scanned (unique by user)
    //     // - Total number of visitor QR scanned by this exhibitor
