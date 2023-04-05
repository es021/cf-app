import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppPath } from '../../../../config/app-config';
import { graphql } from '../../../../helper/api-helper';
import { StatisticFigure } from '../../../component/statistic';
import { getCF, getCFObj, getCompanyId, isRoleRec } from '../../../redux/actions/auth-actions';
import { _student_plural, _student_single } from '../../../redux/actions/text-action';
import { Time } from '../../../lib/time';
import { getCurrentCfStartEnd } from '../../view-helper/view-helper';

export default class HybridStatisticExhibitorScanned extends React.Component {
    constructor(props) {
        super(props);
        this.cf = getCF();
        this.state = {
            countCompanyScanned: "-",
        };
    }
    componentWillMount() {
        let {start, end} = getCurrentCfStartEnd();
        graphql(`query{qr_scans_count (start:"${start}", end:"${end}", cf:"${this.cf}", type:"company" ${isRoleRec() ? `, company_id:${getCompanyId()}` : ``} ) }`).then(res => {
            this.setState({ countCompanyScanned: res.data.data.qr_scans_count })
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
            title={isRoleRec() ? `Your Profile QR Scanned` : `Exhibitor's QR Scanned`}
            icon="building"
            value={this.state.countCompanyScanned}
            color="rgb(255, 97, 62)"
            footer={this.props.footer}
        ></StatisticFigure>

    }
}