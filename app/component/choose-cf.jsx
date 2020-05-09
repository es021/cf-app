import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { RootPath } from '../../config/app-config';
import { CFSMeta } from '../../config/db-config';
import * as layoutAction from "../redux/actions/layout-actions";
import { getLocalStorageCf, getCFCustom, getCFObj } from '../redux/actions/auth-actions';
import { Time } from "../lib/time"

export class ChooseCfPage extends React.Component {
    orderByStartTime(cfs) {
        let objKeyStartTime = {};
        for (var k in cfs) {
            let cf = cfs[k];
            let unixStart = Time.convertDBTimeToUnix(cf.start);
            objKeyStartTime[unixStart] = cf;
        }

        let ordered = {};
        Object.keys(objKeyStartTime).sort().forEach(function (key) {
            ordered[key] = objKeyStartTime[key];
        });

        let orderedDesc = [];
        for (var k in ordered) {
            orderedDesc.unshift(ordered[k])
        }
        return orderedDesc;
    }
    render() {
        let cfs = getLocalStorageCf();
        let COLORS = ["#bd3044", "#00b9a9", "#2d3e50", "#e24443", "#235494"]
        cfs = this.orderByStartTime(cfs);
        let cfObj = getCFObj();

        let cfsView = [];
        let index = -1;
        for (var i in cfs) {
            let cf = cfs[i];
            if (cf.name == "TEST") {
                continue;
            }
            index++;
            let desc = cfObj[CFSMeta.TEXT_HEADER_DESC];
            if (desc == "Powered By Seeds") {
                desc = null;
            }

            let day = Time.getStringDay(cf.start)
            let month = Time.getStringMonth(cf.start)
            let year = Time.getStringYear(cf.start)

            let action = <a className="btn btn-block btn-sm text-bold btn-gray" href={`${location.origin}${RootPath}/auth?cf=${cf.name}`}>
                Go To Event<i className="fa fa-long-arrow-right right"></i>
            </a>

            cfsView.push(<div className="choose-cf-card" style={{ background: COLORS[index % COLORS.length] }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 no-padding">
                            <div className="ccf-date">
                                <div style={{ fontSize: "48px", lineHeight: "34px", letterSpacing: "3px" }}>{day}</div>
                                <div style={{ fontSize: "25px", lineHeight: "34px", fontWeight: "bold" }}>{month.toUpperCase()}</div>
                                <div style={{ fontSize: "17px", lineHeight: "12px", letterSpacing: "4px" }}>{year}</div>
                            </div>
                        </div>
                        <div className="col-sm-9 ccf-body">
                            <div className="ccf-title">
                                {cf.title}
                                {!desc ? null : <small style={{ fontWeight: "initial" }} className="text-muted"><br></br>{desc}</small>}
                            </div>
                            <div className="ccf-action">
                                {action}
                            </div>
                        </div>

                    </div>
                </div>

            </div>)
        }
        console.log("cfs", cfs);
        return <div>
            <h3>Choose Event</h3>
            {cfsView}
        </div>
    }
}