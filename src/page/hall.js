import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hallAction from '../redux/actions/hall-actions';

class CompanyLine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log("render CompanyBooth",this.props.data.name);
        var queue = this.props.data.active_queues.map(
                (d, i) => <li key={i}>Queue {d.student_id}</li>
        );

        var prescreen = this.props.data.active_prescreens.map(
                (d, i) => <li key={i}>PreScreen {d.student_id}</li>
        );

        var body =
                <div>
                    <ul>
                        {queue}
                    </ul>
                    <ul>
                        {prescreen}
                    </ul>
                </div>

        return(<div>{body}</div>);
    }
}

class CompanyBooth extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log("render CompanyBooth",this.props.data.name);
        return(<div>
            <b>{this.props.data.name}</b>
            <br></br>
            <small>{this.props.data.tagline}</small>
        </div>);
    }
}

//state is from redux reducer
// with multiple objects
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

class HallPage extends React.Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.refreshTraffic = this.refreshTraffic.bind(this);

        this.traffic = {};
    }

    componentWillMount() {
        this.props.loadCompanies();

        this.props.loadTraffic();
    }

    refreshTraffic() {
        this.props.loadTraffic();
    }

    render() {
        console.log("render hall page");
        var companies = this.props.companies;
        var traffic = this.props.traffic;
        //console.log(companies);
        //console.log(traffic);

        var title = <h3>Hall</h3>;
        var loading = <div>Loading..</div>;

        var view = [];
        if (companies.fetching && traffic.fetching) {
            view = loading;
        } else {
            for (var i in companies.data.companies) {
                var d_com = companies.data.companies[i];
                var d_tf = traffic.data.companies[i];

                var v = (
                        <div key={i}>
                            <CompanyBooth data={d_com}></CompanyBooth>
                            {(traffic.fetching) ? loading : <CompanyLine data={d_tf}></CompanyLine>}
                        </div>
                        );

                view.push(v);
            }
        }

        var button = <a onClick = {this.refreshTraffic}>Refresh Line</a>

        return(<div> 
            {title}
            {button}
            {view} 
        </div>);

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(HallPage);
