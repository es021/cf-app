import React, { PropTypes } from 'react';
import GeneralFormPage from '../component/general-form';
import SubNav from '../component/sub-nav';
import { CustomList } from '../component/list';
import { ManageFeedback } from './partial/analytics/feedback';

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
        console.log(this.props);
    }

    isEncodedUri() {
        var ENCODE = ["org_en", "com_en"];
        return ENCODE.indexOf(this.props.type) >= 0;
    }

    printPrettyJSON(json) {
        if (typeof json == "string") {
            json = JSON.parse(json);
        }

        var items = [];
        for (var k in json) {
            items.push(
                {
                    label: k,
                    icon: "",
                    value: json[k]
                });
        }

        return <CustomList className="icon" items={items}></CustomList>;
    }

    componentWillMount() {
        this.offset = 10;
        this.tableHeader = <thead>
            <tr>
                <th>Value</th>
                <th>Submitted At</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            var fields = "";
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
                meta_value
                created_at}}`);
        };

        this.renderRow = (d, i) => {
            var row = [];
            for (var key in d) {
                if (key == "created_at") {
                    row.push(<td>{Time.getString(d[key])}</td>);
                } else if (key == "meta_value" && this.isEncodedUri()) {
                    var view = decodeURI(d[key]);
                    row.push(<td>{this.printPrettyJSON(view)}</td>);
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
                dataOffset={this.isEncodedUri() ? 5 : 20}
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

    componentWillMount() {
        this.item = {
            "subscriber": {
                label: "Subscriber",
                component: MetaSubPage,
                props: { type: "sub", title: "Subscriber" },
                icon: "envelope"
            }
            , "organization-enquiries": {
                label: "Organization Enquiries",
                component: MetaSubPage,
                props: { type: "org_en", title: "Organization Enquiries" },
                icon: "edit"
            }
            , "company-enquiries": {
                label: "Company Enquiries",
                component: MetaSubPage,
                props: { type: "com_en", title: "Company Enquiries" },
                icon: "edit"
            } 
            , "manage-feedback": {
                label: "Manage Feedback",
                component: ManageFeedback,
                icon: "home"
            }
        };
    }

    render() {
        var title = this.item[this.props.match.params.current].label;
        document.setTitle(title);
        return <SubNav route="analytics" items={this.item} defaultItem={this.props.match.params.current}></SubNav>;
    }
}


