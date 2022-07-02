import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppPath, StatisticUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { StatisticFigure } from '../component/statistic';
import { getAuthUser, getCF } from '../redux/actions/auth-actions';
import EventManagement from './event-management';
import { Loader } from '../component/loader';
import { ButtonExport } from '../component/buttons';
import { getCfEndUnix, isPastCfEnd } from './partial/activity/scheduled-interview';
import { Time } from '../lib/time';
import { _student_plural, _student_single } from '../redux/actions/text-action';
var Chart = require('chart.js');
// import CanvasJSReact from '../lib/canvasjs/canvasjs.react';
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class OrganizerDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = getAuthUser().id;
        this.cf = getCF();
        this.state = {
            countParticipant: "-",
            countExhibitor: "-",
            countJobPost: "-",
            countInterview: "-",
            dataDailyRegistration: null,

            cfUsers: [],
            loadingCfUsers: true,
            cfCompanies: [],
            loadingCfCompanies: true,
        };
    }

    // componentDidMount() {
    //     this.renderChartRegistration();
    // }

    componentWillMount() {

        graphql(`query{ browse_student_count ( cf:"${this.cf}") }`).then(res => {
            this.setState({ countParticipant: res.data.data.browse_student_count })
        })
        graphql(`query{ companies_count (cf:"${this.cf}") }`).then(res => {
            this.setState({ countExhibitor: res.data.data.companies_count })
        })
        graphql(`query{ vacancies_count (cf:"${this.cf}") }`).then(res => {
            this.setState({ countJobPost: res.data.data.vacancies_count })
        })
        graphql(`query{ prescreens_count(not_prescreen:1 ,cf: "${this.cf}") }`).then(res => {
            this.setState({ countInterview: res.data.data.prescreens_count })
        })
        graphql(`query{users(cf:"${getCF()}"){ID}}`).then(res => {
            this.setState({
                cfUsers: res.data.data.users.map(d => d.ID),
                loadingCfUsers: false,
            })
        })
        graphql(`query{companies(cf:"${getCF()}"){ID}}`).then(res => {
            this.setState({
                cfCompanies: res.data.data.companies.map(d => d.ID),
                loadingCfCompanies: false,
            })
        })

        this.loadChartRegistration();
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
        return [<div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title={`Total ${_student_plural()}`}
                icon="users"
                value={this.state.countParticipant}
                color="#469fec"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
                    <b>View All {_student_plural()} &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title={`Online ${_student_plural()}`}
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
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Total Exhibitors" icon="building"
                value={this.state.countExhibitor}
                color="rgb(255, 97, 62)"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/exhibitor-listing"}>
                    <b>View All Exhibitors &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Online Exhibitors"
                icon="building"
                value={this.state.loadingCfCompanies ? '-' : this.getOnlineCompanyCount()}
                valueColor="#3bb44a"
                color="rgb(255, 97, 62)"
                footer={<small>Showing real time data
                        {/* {JSON.stringify(this.props.online_companies)}
                        <br></br>
                        {JSON.stringify(this.state.cfCompanies)} */}
                </small>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Job Positions" icon="suitcase"
                value={this.state.countJobPost}
                color="#a44ba2"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/job-positions"}>
                    <b>View All Job Positions &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Interviews" icon="comments"
                value={this.state.countInterview}
                color="rgb(255, 173, 16)"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/interviews"}>
                    <b>View All Interviews &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div >,
        ]
    }

    // getStatisticView() {
    //     return [<div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Participants"
    //             icon="users"
    //             value={this.state.countParticipant}
    //             color="#469fec"
    //             footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
    //                 <b>View All Participants &#10230;</b>
    //             </NavLink>}
    //         ></StatisticFigure>
    //     </div>,
    //     <div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Online Participants"
    //             icon="users"
    //             value={this.state.loadingCfUsers ? '-' : this.getOnlineUserCount()}
    //             valueColor="#3bb44a"
    //             color="#469fec"
    //             footer={<small>Showing real time data
    //                         {/* {JSON.stringify(this.props.online_users)}
    //                         <br></br>
    //                         {JSON.stringify(this.state.cfUsers)} */}
    //             </small>}

    //         ></StatisticFigure>
    //     </div>,
    //     <div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Exhibitors" icon="building"
    //             value={this.state.countExhibitor}
    //             color="rgb(255, 97, 62)"
    //             footer={<NavLink className="link st-footer-link" to={AppPath + "/exhibitor-listing"}>
    //                 <b>View All Exhibitors &#10230;</b>
    //             </NavLink>}
    //         ></StatisticFigure>
    //     </div>,
    //     <div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Online Exhibitors"
    //             icon="building"
    //             value={this.state.loadingCfCompanies ? '-' : this.getOnlineCompanyCount()}
    //             valueColor="#3bb44a"
    //             color="rgb(255, 97, 62)"
    //             footer={<small>Showing real time data
    //                     {/* {JSON.stringify(this.props.online_companies)}
    //                     <br></br>
    //                     {JSON.stringify(this.state.cfCompanies)} */}
    //             </small>}
    //         ></StatisticFigure>
    //     </div>,
    //     <div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Job Positions" icon="suitcase"
    //             value={this.state.countJobPost}
    //             color="#a44ba2"
    //             footer={<NavLink className="link st-footer-link" to={AppPath + "/job-positions"}>
    //                 <b>View All Job Positions &#10230;</b>
    //             </NavLink>}
    //         ></StatisticFigure>
    //     </div>,
    //     <div className="" style={this.getStatisticClass()}>
    //         <StatisticFigure
    //             title="Interviews" icon="comments"
    //             value={this.state.countInterview}
    //             color="rgb(255, 173, 16)"
    //             footer={<NavLink className="link st-footer-link" to={AppPath + "/interviews"}>
    //                 <b>View All Interviews &#10230;</b>
    //             </NavLink>}
    //         ></StatisticFigure>
    //     </div >,
    //     ]
    // }


    loadChartRegistration() {
        postRequest(StatisticUrl + "/daily-registration", { cf: getCF() }).then(res => {
            this.setState({ dataDailyRegistration: res.data });
            this.renderChartRegistration();
        })
    }

    renderChartRegistration() {
        var element = document.getElementById('myChart');
        if (!element) {
            setTimeout(() => {
                this.renderChartRegistration();
            }, 1000)
        }

        let dataLabel = [];
        let dataSet = [];

        for (let d of this.state.dataDailyRegistration) {
            dataLabel.push(d.dt);
            dataSet.push(d.ttl);
        }
        // console.log("dataLabel", dataLabel);
        // console.log("dataSet", dataSet);
        let data = {
            labels: dataLabel,
            datasets: [
                {
                    label: '# of New Registrations',
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
        if (!this.state.dataDailyRegistration) {
            return <Loader></Loader>
        }
        return <div style={{ paddingRight: '' }}><canvas id="myChart" width="auto" height="100"></canvas></div>
    }
    // chartRegistration2() {
    //     if (!this.state.dataDailyRegistration) {
    //         return <Loader></Loader>
    //     }
    //     var limit = 50;
    //     var y = 100;
    //     var data = [];
    //     var dataSeries = { type: "column" };
    //     var dataPoints = [];

    //     for (var i = 0; i < limit; i += 1) {
    //         y += Math.round(Math.random() * 10 - 5);
    //         dataPoints.push({
    //             x: i,
    //             y: y
    //         });
    //     }
    //     dataSeries.dataPoints = dataPoints;
    //     data.push(dataSeries);

    //     const spanStyle = {
    //         position: 'absolute',
    //         top: '10px',
    //         fontSize: '20px',
    //         fontWeight: 'bold',
    //         backgroundColor: '#d85757',
    //         padding: '0px 4px',
    //         color: '#ffffff'
    //     }

    //     let dataArray = [];

    //     for (let d of this.state.dataDailyRegistration) {
    //         dataArray.push({ label: d.dt, y: d.ttl });
    //     }

    //     const options = {
    //         theme: "light2", // "light1", "light2", "dark1", "dark2"
    //         animationEnabled: true,
    //         title: {
    //             // text: "Try Zooming - Panning"
    //         },
    //         data: [{
    //             type: "column",
    //             dataPoints: dataArray
    //             // [
    //             //     { label: "10 Jan", y: 10 },
    //             //     { label: "11 Jan", y: 4 },
    //             //     { label: "12 Jan", y: 5 },
    //             //     { label: "13 Jan", y: 33 },
    //             //     { label: "14 Jan", y: 54 },
    //             //     { label: "10 Jan", y: 10 },
    //             //     { label: "11 Jan", y: 4 },
    //             //     { label: "12 Jan", y: 5 },
    //             //     { label: "13 Jan", y: 32 },
    //             //     { label: "14 Jan", y: 14 },
    //             //     { label: "10 Jan", y: 10 },
    //             //     { label: "11 Jan", y: 4 },
    //             //     { label: "12 Jan", y: 5 },
    //             //     { label: "13 Jan", y: 43 },
    //             //     { label: "14 Jan", y: 4 },
    //             // ]
    //         }]
    //     }


    //     return (
    //         <div style={{ padding: '10px', background: 'white' }}>
    //             <CanvasJSChart options={options}
    //                 onRef={ref => this.chart = ref}
    //             />
    //         </div >
    //     );
    // }

    render() {
        document.setTitle("Dashboard");
        return <div>
            <div style={{ margin: '32px 0px', justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
                {this.getStatisticView()}
            </div>
            <div className="container-fluid">
                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}><b>{_student_single()} Registrations</b>
                        <br></br>
                        <div style={{ marginTop: '5px' }}>
                            <ButtonExport
                                style={{ margin: "5px" }} btnClass="green btn-bold btn-round-5" action="browse_student"
                                text={<span>Download {_student_plural()} Data</span>}
                                filter={`cf:"${getCF()}", company_id:null`} cf={getCF()}></ButtonExport>
                        </div>
                    </h2>
                    {this.chartRegistration()}
                </div>
                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}><b>Events & Webinars</b></h2>
                    <EventManagement tableOnly={true}></EventManagement>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerDashboard);