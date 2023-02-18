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
import HybridStatisticCheckIn from './partial/hybrid/hybrid-statistic-check-in';
import HybridStatisticExhibitorScanned from './partial/hybrid/hybrid-statistic-exhibitor-scanned';
import HybridStatisticVisitorScanned from './partial/hybrid/hybrid-statistic-visitior-scanned';
var Chart = require('chart.js');
// import CanvasJSReact from '../lib/canvasjs/canvasjs.react';
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class HybridEventDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = getAuthUser().id;
        this.cf = getCF();
        this.state = {
            dataHourlyQrCheckIn: null,
            dataHourlyExhibitorScanned: null,
            cfUsers: [],
            loadingCfUsers: true,
            cfCompanies: [],
            loadingCfCompanies: true,
        };
    }

    componentWillMount() {
        if (!isRoleRec()) {
            this.loadChartQrCheckIn();
        }
        this.loadChartExhibitorScanned();
    }


    getStatisticClass() {
        return {
            marginBottom: '40px',
            minWidth: '250px'
        }
    }

    getStatisticView() {
        return [
            isRoleRec() ? null : <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <HybridStatisticCheckIn
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/hybrid-check-in-list"}>
                        <b>View All Check In &#10230;</b>
                    </NavLink>}
                />
            </div>,
            <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <HybridStatisticExhibitorScanned
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/hybrid-exhibitor-scanned-list"}>
                        <b>View All Scan Record &#10230;</b>
                    </NavLink>}
                />
            </div>,
            <div className="col-sm-4 col-lg-3" style={this.getStatisticClass()}>
                <HybridStatisticVisitorScanned
                    footer={<NavLink className="link st-footer-link" to={AppPath + "/hybrid-visitor-scanned-list"}>
                        <b>View All Scan Record &#10230;</b>
                    </NavLink>}
                />

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
                    label: '# of scans',
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
                    label: '# of check ins',
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
            {isRoleRec() ? null :
                <div className="container-fluid">
                    <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                        <h2 className="text-left" style={{ marginBottom: '25px' }}><b>{_student_single()} Check In</b>
                        </h2>
                        {this.chartQrCheckIn()}
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="col-sm-12" style={{ marginBottom: '45px' }}>
                    <h2 className="text-left" style={{ marginBottom: '25px' }}>
                        <b>
                            {isRoleRec() ? "Your Profile QR Scanned" : "Exhibitor's QR Scanned"}
                        </b>
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
