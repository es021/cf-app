import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { AppPath } from '../../config/app-config';

export default class RestrictedPage extends React.Component {
    handleRedirect() {
    }
    render() {
        document.setTitle("Restricted");
        return (
            <div style={{ padding: "20px 10px" }}>
                <div style={{
                    marginBottom: "5px",
                }}>
                    <span style={{
                        color: "#959595",
                        padding: "5px 2px",
                        fontWeight: "bold", fontSize: "18px"
                    }}>RESTRICTED</span>
                </div>
                <i style={{ color: "#959595" }} className="fa fa-warning fa-4x"></i>
                <div style={{ fontSize: "23px", marginTop: "25px" }}>
                    You are not supposed to be HERE.
                </div>
                <div style={{ marginBottom: "25px" }}>
                    Make sure you typed the correct url.
                </div>
                <div>
                    <NavLink className="btn btn-bold btn-md btn-blue-light btn-round-5"
                        to={`${AppPath}`}>
                        GO TO HOME PAGE
                    </NavLink>
                </div>
            </div>
        );
    }
}


