import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { AppPath, StatisticUrl } from '../../config/app-config';
import { graphql, postRequest } from '../../helper/api-helper';
import { StatisticFigure } from '../component/statistic';
import { getAuthUser, getCF } from '../redux/actions/auth-actions';
import EventManagement from './event-management';
import CanvasJSReact from '../lib/canvasjs/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

import { Loader } from '../component/loader';
export default class OrganizerDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = getAuthUser().id;
        this.cf = getCF();
        this.state = {
            countParticipant: "-",
            countExhibitor: "-",
            countJobPost: "-",
            countInterview: "-",
            dataDailyRegistration: null
        };
    }

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

        this.loadChartRegistration();
    }

    getStatisticClass() {
        return {
            marginBottom: '40px'
        }
    }
    getStatisticView() {
        return [<div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Participants" icon="users"
                value={this.state.countParticipant}
                color="#3bb44a"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/participant-listing"}>
                    <b>View All Participants &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Exhibitors" icon="building"
                value={this.state.countExhibitor}
                color="rgb(255, 97, 62)"
                footer={<NavLink className="link st-footer-link" to={AppPath + "/exhibitor-listing"}>
                    <b>View All Exhibitors &#10230;</b>
                </NavLink>}
            ></StatisticFigure>
        </div>,
        <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
            <StatisticFigure
                title="Job Positions" icon="suitcase"
                value={this.state.countJobPost}
                color="#469fec"
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
        </div >
        ]
    }

    loadChartRegistration() {
        postRequest(StatisticUrl + "/daily-registration", { cf: getCF() }).then(res => {
            // console.log(res.data);
            this.setState({ dataDailyRegistration: res.data });
        })
    }
    chartRegistration() {
        if (!this.state.dataDailyRegistration) {
            return <Loader></Loader>
        }
        var limit = 50;
        var y = 100;
        var data = [];
        var dataSeries = { type: "column" };
        var dataPoints = [];

        for (var i = 0; i < limit; i += 1) {
            y += Math.round(Math.random() * 10 - 5);
            dataPoints.push({
                x: i,
                y: y
            });
        }
        dataSeries.dataPoints = dataPoints;
        data.push(dataSeries);

        const spanStyle = {
            position: 'absolute',
            top: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#d85757',
            padding: '0px 4px',
            color: '#ffffff'
        }

        let dataArray = [];

        for (let d of this.state.dataDailyRegistration) {
            dataArray.push({ label: d.dt, y: d.ttl });
        }

        const options = {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            title: {
                // text: "Try Zooming - Panning"
            },
            data: [{
                type: "column",
                dataPoints: dataArray
                // [
                //     { label: "10 Jan", y: 10 },
                //     { label: "11 Jan", y: 4 },
                //     { label: "12 Jan", y: 5 },
                //     { label: "13 Jan", y: 33 },
                //     { label: "14 Jan", y: 54 },
                //     { label: "10 Jan", y: 10 },
                //     { label: "11 Jan", y: 4 },
                //     { label: "12 Jan", y: 5 },
                //     { label: "13 Jan", y: 32 },
                //     { label: "14 Jan", y: 14 },
                //     { label: "10 Jan", y: 10 },
                //     { label: "11 Jan", y: 4 },
                //     { label: "12 Jan", y: 5 },
                //     { label: "13 Jan", y: 43 },
                //     { label: "14 Jan", y: 4 },
                // ]
            }]
        }


        return (
            <div style={{ padding: '10px', background: 'white' }}>
                <CanvasJSChart options={options}
                    onRef={ref => this.chart = ref}
                />
            </div >
        );
    }

    render() {
        document.setTitle("Dashboard");
        return <div>
            <div className="container-fluid" style={{ margin: '32px 0px' }}>
                {this.getStatisticView()}
            </div>
            <div className="container-fluid">
                <div className="col-sm-6">
                    <h2 className="text-left" style={{ marginBottom: '15px' }}><b>Participants Registrations</b></h2>
                    {this.chartRegistration()}
                </div>
                <div className="col-sm-6">
                    <h2 className="text-left" style={{ marginBottom: '15px' }}><b>Events & Webinars</b></h2>
                    <EventManagement tableOnly={true}></EventManagement>
                </div>
            </div>
        </div>
    }
}


