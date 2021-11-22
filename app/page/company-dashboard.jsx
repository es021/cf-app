import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppPath, StatisticUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { StatisticFigure } from '../component/statistic';
import { getAuthUser, getCF, getCFObj } from '../redux/actions/auth-actions';
import EventManagement from './event-management';
import { Loader } from '../component/loader';
import { ButtonExport } from '../component/buttons';
import { Time } from '../lib/time';
import { lang } from '../lib/lang';
import { isPastCfEnd } from './partial/activity/scheduled-interview';

var Chart = require('chart.js');
// import CanvasJSReact from '../lib/canvasjs/canvasjs.react';
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CompanyDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = getAuthUser().id;

        this.cf = getCF();
        this.company_id = getAuthUser().rec_company;
        this.cf_start = Time.convertDBTimeToUnix(getCFObj().start);
        this.cf_end = Time.convertDBTimeToUnix(getCFObj().end);

        this.state = {
            countParticipant: "-",
            countVisitor: "-",
            countJobApplication: "-",
            countInterview: "-",
            dataHourlyVisit: null,
            cfUsers: [],
            loadingCfUsers: true,
        };
    }

    // componentDidMount() {
    //     this.renderChartHourlyVisit();
    // }

    componentWillMount() {
        postRequest(StatisticUrl + "/company-statistic-count", {
            company_id: this.company_id,
            cf: this.cf,
            cf_start: this.cf_start,
            cf_end: this.cf_end,
        }).then(res => {
            let d = res.data;
            this.setState({
                countVisitor: d.countVisitor,
                countJobApplication: d.countJobApplication,
                countInterview: d.countInterview,
            });
        });

        postRequest(StatisticUrl + "/company-statistic-count", {
            company_id: this.company_id,
            cf: this.cf,
            cf_start: this.cf_start,
            cf_end: this.cf_end,
            is_graph_profile_visit: true
        }).then(res => {
            this.setState({ dataHourlyVisit: res.data });
            this.renderChartHourlyVisit();
        });


        graphql(`query{ browse_student_count ( cf:"${this.cf}") }`).then(res => {
            this.setState({ countParticipant: res.data.data.browse_student_count })
        })
        graphql(`query{users(cf:"${getCF()}"){ID}}`).then(res => {
            this.setState({
                cfUsers: res.data.data.users.map(d => d.ID),
                loadingCfUsers: false,
            })
        })
    }


    getOnlineUserCount() {
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
    // getOnlineCompanyCount() {
    //     // this.props.online_companies : {"12":{"137":"Online"}}

    //     let count = 0;
    //     for (var cid in this.props.online_companies) {
    //         let isRecOnline = false;
    //         cid = Number.parseInt(cid);
    //         let recObj = this.props.online_companies[cid];
    //         if (recObj) {
    //             for (var recId in recObj) {
    //                 if (recObj[recId] == "Online") {
    //                     isRecOnline = true;
    //                     break;
    //                 }
    //             }
    //         }
    //         if (
    //             this.state.cfCompanies.indexOf(cid) >= 0 &&
    //             isRecOnline
    //         ) {
    //             count++;
    //         }
    //     }

    //     return count;
    // }

    getStatisticClass() {
        return {
            marginBottom: '40px',
            minWidth: '250px'
        }
    }

    getStatisticView() {
        return [<div className="col-sm-4 col-lg-4" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Total Participants"
                icon="users"
                value={this.state.countParticipant}
                color="#469fec"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/browse-student"}>
                    <b>View All Participants &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-4" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Online Participants"
                icon="users"
                value={this.state.loadingCfUsers ? '-' : this.getOnlineUserCount()}
                valueColor="#3bb44a"
                color="#469fec"
                footer={<small>Showing real time data
                            {/* {JSON.stringify(this.props.online_users)}
                            <br></br>
                            {JSON.stringify(this.state.cfUsers)} */}
                </small>}

            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-4" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Total Profile Visit" icon="building"
                value={this.state.countVisitor}
                color="rgb(255, 97, 62)"
                footer={<a className="link st-footer-link">
                    <ButtonExport isOverrideBtnClass={true}
                        btnClass="btn-link"
                        action={'rec_analytic'}
                        text={<b>{lang("Download Data")} &#10230;</b>}
                        filter={{
                            is_export_profile_visit: true,
                            cf: this.cf,
                            cf_start: this.cf_start,
                            cf_end: this.cf_end,
                            company_id: this.company_id,
                        }}>
                    </ButtonExport>
                </a>
                }
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-4" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Total Job Applications" icon="suitcase"
                value={this.state.countJobApplication}
                color="#a44ba2"
                footer={<a className="link st-footer-link">
                    <ButtonExport isOverrideBtnClass={true}
                        btnClass="btn-link"
                        action={'rec_analytic'}
                        text={<b>{lang("Download Data")} &#10230;</b>}
                        filter={{
                            is_export_job_application: true,
                            cf: this.cf,
                            cf_start: this.cf_start,
                            cf_end: this.cf_end,
                            company_id: this.company_id,
                        }}>
                    </ButtonExport>
                </a>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-4" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Total Interviews" icon="comments"
                value={this.state.countInterview}
                color="rgb(255, 173, 16)"
                footer={<a className="link st-footer-link">
                    <ButtonExport isOverrideBtnClass={true}
                        btnClass="btn-link"
                        action={'rec_analytic'}
                        text={<b>{lang("Download Data")} &#10230;</b>}
                        filter={{
                            is_export_interviews: true,
                            cf: this.cf,
                            cf_start: this.cf_start,
                            cf_end: this.cf_end,
                            company_id: this.company_id,
                        }}>
                    </ButtonExport>
                </a>}
            ></StatisticFigure>
        </div >,
        ]
    }

    renderChartHourlyVisit() {
        var element = document.getElementById('myChart');
        if (!element) {
            setTimeout(() => {
                this.renderChartHourlyVisit();
            }, 1000)
        }

        let dataLabel = [];
        let dataSet = [];

        for (let d of this.state.dataHourlyVisit) {
            dataLabel.push(d.dt);
            dataSet.push(d.ttl);
        }
        // console.log("dataLabel", dataLabel);
        // console.log("dataSet", dataSet);
        let data = {
            labels: dataLabel,
            datasets: [
                {
                    label: '# of Visits',
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
    chartRegistration() {
        if (!this.state.dataHourlyVisit) {
            return <Loader></Loader>
        }
        return <div style={{ paddingRight: '' }}><canvas id="myChart" width="auto" height="100"></canvas></div>
    }
    render() {
        document.setTitle("Dashboard");
        return <div>
            <div className="col-sm-12">
                <h1 className="text-left" style={{ marginBottom: '30px' }}><b>Analytics</b></h1>
            </div>
            <div className="col-sm-12">
                <div style={{ margin: '32px 0px', justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
                    {this.getStatisticView()}
                </div>
            </div>
            <div className="container-fluid">

                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}><b>Company Profile Visit</b>
                        <br></br>
                        <div style={{ marginTop: '8px', fontSize: '13px' }}>
                            <ButtonExport isOverrideBtnClass={true}
                                btnClass="btn-link"
                                action={'rec_analytic'}
                                text={<b>{lang("Download Profile Visit Data")} &#10230;</b>}
                                filter={{
                                    is_export_profile_visit: true,
                                    cf: this.cf,
                                    cf_start: this.cf_start,
                                    cf_end: this.cf_end,
                                    company_id: this.company_id,
                                }}>
                            </ButtonExport>
                        </div>
                    </h2>
                    {this.chartRegistration()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDashboard);