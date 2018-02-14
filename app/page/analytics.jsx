import React, { PropTypes } from 'react';
import GeneralFormPage from '../component/general-form';

//importing for list
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { Time } from '../lib/time';

// create sub page
const MetaType = {
    "sub": "Email Subscriber",
    "org_en": "Organization Enquiries",
    "com_en": "Company Enquiries",
};

class MetaSubPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.offset = 10;
        this.tableHeader = <thead>
            <tr>
                <th>key</th>
                <th>meta_value</th>
                <th>created_at</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            switch (this.props.type) {
                case 'sub':
                    fields = `meta_key:"subscriber"`;
                    break;
                case 'org_en':
                    fields = `meta_key:"enquiries",meta_value:"org_name"`;
                    break;
                case 'com_en':
                    fields = `meta_key:"enquiries",meta_value:"comp_name"`;
                    break;
            }

            return getAxiosGraphQLQuery(`
                query{metas(${fields} page:${page}, offset:${offset}){
                meta_key
                meta_value
                created_at}}`);
        };

        this.renderRow = (d, i) => {
            var row = [];
            for (var key in d) {
                if (key == "created_at") {
                    row.push(<td>{Time.getString(d[key])}</td>);
                } else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.metas;
        }
    }

    render() {
        document.setTitle(this.props.title);
        return (<div><h3>{this.props.title}</h3>
            <GeneralFormPage
                dataTitle={this.dataTitle}
                noMutation={true}
                dataOffset={20}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}
            ></GeneralFormPage>
        </div>);
    }
}

MetaSubPage.propTypes = {
    type: PropTypes.oneOf(["sub", "org_en", "com_en"]).isRequired,
    title: PropTypes.string.isRequired
};


// create sub page here
export default class AnalyticPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h3>Analytics</h3>;
    }
}
