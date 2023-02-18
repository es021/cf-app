import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppPath } from '../../../../config/app-config';
import { graphql } from '../../../../helper/api-helper';
import { StatisticFigure } from '../../../component/statistic';
import { getCF } from '../../../redux/actions/auth-actions';
import { _student_plural, _student_single } from '../../../redux/actions/text-action';

export default class HybridStatisticCheckIn extends React.Component {
    constructor(props) {
        super(props);
        this.cf = getCF();
        this.state = {
            countCheckin: "-",
        };
    }
    componentWillMount() {
        graphql(`query{ qr_check_ins_count ( cf:"${this.cf}") }`).then(res => {
            this.setState({ countCheckin: res.data.data.qr_check_ins_count })
        })
    }
    getStatisticClass() {
        return {
            marginBottom: '40px',
            minWidth: '250px'
        }
    }
    render() {
        return <StatisticFigure
            title={`Visitor Check In`}
            icon="sign-in"
            value={this.state.countCheckin}
            color="#469fec"
            footer={this.props.footer}
        ></StatisticFigure>

    }
}
