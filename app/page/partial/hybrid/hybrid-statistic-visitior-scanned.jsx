import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppPath } from '../../../../config/app-config';
import { graphql } from '../../../../helper/api-helper';
import { StatisticFigure } from '../../../component/statistic';
import { getCF, getCompanyId, isRoleRec } from '../../../redux/actions/auth-actions';
import { _student_plural, _student_single } from '../../../redux/actions/text-action';

export default class HybridStatisticVisitorScanned extends React.Component {
    constructor(props) {
        super(props);
        this.cf = getCF();
        this.state = {
            countUserScanned: "-",
        };
    }
    componentWillMount() {
        graphql(`query{ qr_scans_count (cf:"${this.cf}", type:"user" ${isRoleRec() ? `, scanned_by_company_id:${getCompanyId()}` : ``} ) }`).then(res => {
            this.setState({ countUserScanned: res.data.data.qr_scans_count })
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
            title={isRoleRec() ? `${_student_single()} Scanned By You` : `${_student_single()}'s QR Scanned`}
            icon="users"
            value={this.state.countUserScanned}
            color="#a44ba2"
            footer={this.props.footer}
        ></StatisticFigure>

    }
}

