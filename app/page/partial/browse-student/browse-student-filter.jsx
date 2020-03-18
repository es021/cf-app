import React, { PropTypes } from "react";
import { graphql } from "../../../../helper/api-helper";
import { Loader } from "../../../component/loader";
import Tooltip from "../../../component/tooltip";
import { isCfLocal } from "../../../redux/actions/auth-actions";

export function createFilterStr(filterObj, validCf) {
    validCf = Array.isArray(validCf) ? validCf : []

    let r = "";
    let filterExist = {};
    for (var k in filterObj) {

        let combineVal = "";
        for (var i in filterObj[k]) {
            let v = filterObj[k][i];
            if (v != "" && v != null) {
                combineVal += v + "::";
                filterExist[k] = true;
            }
        }
        // buang :: yg last
        combineVal = combineVal.substr(0, combineVal.length - 2);

        if (combineVal != "") {
            r += ` ${k}:"${combineVal}",`;
        }
    }
    // buang , yg last
    r = r.substr(0, r.length - 1);


    // add required filter (cf, event)
    // even user tak pilih pun kita kena filter jugak
    // sbb kalau tak dia akan dpt view semua
    if (filterExist.cf !== true) {
        let cfFilter = ""
        for (var i in validCf) {
            if (validCf[i] != "") {
                cfFilter += validCf[i] + "::";
            }
        }
        cfFilter = cfFilter.substr(0, cfFilter.length - 2);
        if (cfFilter != "") {
            r += ` cf:"${cfFilter}"`;
        }
    }

    console.log("filterExist", filterExist);
    console.log("createFilterStr", filterObj, r);
    return r;

}
export class BrowseStudentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.onResetFilter = this.onResetFilter.bind(this);

        this.discardFilter = "::interested_job_location::";
        if (isCfLocal()) {
            this.discardFilter += "::country_study::";
        } else {
            this.discardFilter += "::university::";
        }

        this.orderFilter = [
            "interested_only", "favourited_only", "cf", "country_study", "university", "field_study",
            "looking_for_position", "working_availability_from", "working_availability_to",
            "graduation_from", "graduation_to", "interested_job_location", "where_in_malaysia", "skill"
        ];

        this.customClass = {
            "working_availability_from": "no-border",
            "graduation_from": "no-border",
        }

        this.state = {
            key: 1,
            loading: false,
            filters: {
                ...this.getDateStateObj("working_availability", "from", "Working Availability From"),
                ...this.getDateStateObj("working_availability", "to", "Working Availability To"),
                ...this.getDateStateObj("graduation", "from", "Graduation Date From"),
                ...this.getDateStateObj("graduation", "to", "Graduation Date To"),
            },
            dataset_year: [],
            dataset_month: [],
        };

        this.initFilterState();
    }

    initFilterState() {
        console.log("defaultFilterState", this.props.defaultFilterState)
        if (this.props.defaultFilterState) {
            this.filterState = JSON.parse(JSON.stringify(this.props.defaultFilterState));
        } else {
            this.filterState = {};
        }
    }

    getExtraFilter() {
        return {
            favourited_only: {
                isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>Show <b>shortlisted students</b> only
                        <Tooltip
                            bottom="13px"
                            left="-88px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={<i style={{ marginLeft: "7px" }} className="fa fa-question-circle"></i>}
                            tooltip={
                                <div style={{ padding: "0px 5px" }} className="text-left">
                                    <small>Click on heart sign to shortlist students
                                    </small>
                                </div>
                            }
                        ></Tooltip>
                    </div>,
                    total: null
                }]
            },
            interested_only: {
                isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>Show <b>interested students</b> only
                         <Tooltip
                            bottom="13px"
                            left="-90px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={<i style={{ marginLeft: "7px" }} className="fa fa-question-circle"></i>}
                            tooltip={
                                <div style={{ padding: "0px 5px" }} className="text-left">
                                    <small>Students that :
                                    <ol>
                                            <li>Liked your company profile</li>
                                            <li>Liked your job posts </li>
                                            <li>RSVP'ed for your events </li>
                                        </ol>
                                    </small>
                                </div>
                            }
                        ></Tooltip>
                    </div>,
                    total: null
                }]
            }
        }
    }

    getQueryParam(page, offset) {
        return this.props.getQueryParam({
            page: page,
            offset: offset,
            filterStr: this.props.filterStr,
            isRec: this.props.isRec,
            company_id: this.props.company_id
        })
    }

    //${this.getQueryParam()}
    loadFilter() {
        this.setState({ loading: true })
        let q = `query{
            browse_student_filter(discard_filter:"${this.discardFilter}") {
              _key
              _val
              _total
              _val_label
            } 
          }
        `;

        graphql(q).then((res) => {
            this.loaded++;

            let filter = res.data.data.browse_student_filter;

            let filterObj = {};
            for (var i in filter) {
                let f = filter[i];
                let k = f._key
                if (!filterObj[k]) {
                    filterObj[k] = {
                        title: this.getTitleFromKey(k),
                        filters: []
                    }
                }
                filterObj[k].filters.push({
                    val: f._val,
                    label: f._val_label ? f._val_label : f._val,
                    total: f._total,
                })
            }

            this.setState((prevState) => {
                filterObj = {
                    ...this.getExtraFilter(),
                    ...filterObj,
                    ...prevState.filters
                }
                console.log(filterObj);
                return { filters: filterObj, loading: this.isStillLoading() }
            })
        })
    }

    getDefault(type, key, val) {
        try {
            if (type == "select") {
                let r = this.props.defaultFilterState[key][0];
                if (r) {
                    return r;
                } else {
                    return "";
                }
            } else if (type == "checkbox") {
                let r = this.props.defaultFilterState[key].indexOf(val) >= 0;
                // console.log(type, key, val, r);
                if (r == true) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (err) {
            return null
        }
    }

    addFilter(key, val, isSelect = false) {
        console.log("addFilter", key, val);
        if (!this.filterState[key]) {
            this.filterState[key] = [];
        }

        if (isSelect) {
            this.filterState[key] = [val]
        } else {
            if (this.filterState[key].indexOf(val) <= -1) {
                this.filterState[key].push(val);
            }
        }


        console.log(this.filterState);

    }
    removeFilter(key, val, isSelect = false) {
        console.log("removeFilter", key, val);

        if (this.filterState[key]) {
            if (isSelect || this.filterState[key].indexOf(val) >= 0) {
                this.filterState[key].splice(this.filterState[key].indexOf(val), 1)
            }
        }

        console.log(this.filterState);
    }

    componentWillMount() {
        this.toLoad = 3;
        this.loaded = 0;
        this.loadFilter();
        this.loadDataset("month");
        this.loadDataset("year");
    }
    isStillLoading() {
        return !(this.loaded >= this.toLoad)
    }

    loadDataset(k) {
        let q = `query{ 
              refs(
                table_name :"${k}", order_by : "ID asc"
              ) {
                ID val table_name
              }
            }`;
        graphql(q).then(res => {
            this.loaded++;
            console.log(k, res.data.data);

            let ret = {}
            ret["dataset_" + k] = res.data.data.refs
            ret.loading = this.isStillLoading()
            this.setState(ret);
        });
    }

    getTitleFromKey(key) {
        return {
            cf: "Career Fair",
            university: "University",
            country_study: "Country Of Study",
            field_study: "Field Of Study",
            interested_job_location: "Preferred Job Location",
            where_in_malaysia: "City/State In Malaysia",
            looking_for_position: "Looking For",
            skill: "Skills",
        }[key];
    }

    getDateStateObj(key, toOrFrom, title) {
        let r = {};
        r[key + "_" + toOrFrom] = {
            title: title,
            isSelect: true,
            children: [{
                name: key + "_month_" + toOrFrom,
                dataset: "month"
            },
            {
                name: key + "_year_" + toOrFrom,
                dataset: "year"
            }]
        }

        return r;
    }



    _section(body, extraClass = "") {
        return <div className={`bsf-section ${extraClass}`}>
            {body}
        </div>
    }
    _title(body) {
        return <div className="bsf-title">
            {body}
        </div>
    }
    header() {
        let v = <div>
            <div style={{ fontWeight: "bold", fontSize: "15px" }}>Filter</div>
        </div>
        return this._section(v);
    }
    getSelectOptions(dataset) {
        let data = this.state[`dataset_` + dataset];
        if (data.length <= 0) {
            return null;
        } else {
            let dataset = ["", ...data];
            return dataset.map((d, i) => {
                let value = d.val;
                let label = d.val;
                return (
                    <option key={i} value={value}>
                        {label}
                    </option>
                );
            });
        }
    }
    filterSelect(k, keyFilter) {
        let valItems = []
        for (var i in keyFilter.children) {
            let ch = keyFilter.children[i];
            let sel =
                <select
                    className={"select-style-1"}
                    style={{ marginRight: "10px" }}
                    name={ch.name}
                    onChange={(e) => {
                        let name = e.currentTarget.name;
                        let val = e.currentTarget.value;
                        console.log("SELECT HANDLER", name, val);
                        let isSelect = true;
                        if (!val) {
                            this.removeFilter(name, val, isSelect);
                        } else {
                            this.addFilter(name, val, isSelect);
                        }
                    }}

                    value={null}
                    defaultValue={this.getDefault("select", ch.name)}
                >
                    {this.getSelectOptions(ch.dataset)}
                </select>


            valItems.push(sel);


        }

        return <div>
            {this._title(keyFilter.title)}
            {valItems}
        </div>
    }
    isFilterDisabled(key, val) {
        let toRet = false;
        try {
            if (Array.isArray(this.props.disabledFilter[key])) {
                if (this.props.disabledFilter[key].indexOf(val) >= 0) {
                    toRet = true;
                }
            } else {
                // kalau bukan array kita assume dia function
                return this.props.disabledFilter[key](val);
            }
        } catch (err) { }

        // console.log("isFilterDisabled", key, val, toRet);
        return toRet
    }
    getTotal(k, f) {
        if (k == "cf") {
            return "";
        }
        return f.total ? `(${f.total})` : ""
    }
    filterCheckbox(k, keyFilter) {
        let isStateShowMore = this.state[k + "show_more"] === true;
        let limitShowLess = 5;
        let exceptionShowLess = ["cf"];

        let valItems = []
        for (var i in keyFilter.filters) {

            let f = keyFilter.filters[i];
            let className = "checkbox-style-1";
            if (this.isFilterDisabled(k, f.val)) {
                className += " disabled";
            }

            if (exceptionShowLess.indexOf(k) <= -1) {
                if (!isStateShowMore) {
                    if (i >= limitShowLess) {
                        className += " hidden"
                    }
                }
            }

            valItems.push(
                <div className={className}>
                    <label className="cb1-container small green">
                        {f.label} {this.getTotal(k, f)}
                        <input
                            disabled={this.isFilterDisabled(k, f.val)}
                            className={"bsf-input"}
                            type="checkbox"
                            data-key={k}
                            data-val={f.val}
                            defaultChecked={this.getDefault("checkbox", k, f.val)}
                            // checked={}
                            onChange={(e) => {
                                let key = e.currentTarget.dataset.key;
                                let val = e.currentTarget.dataset.val;
                                let checked = e.currentTarget.checked;
                                console.log("CHECKBOX HANDLER", key, val, checked);

                                if (!checked) {
                                    this.removeFilter(key, val);
                                } else {
                                    this.addFilter(key, val);
                                }
                            }} />
                        <span className="cb1-checkmark"></span>
                    </label>
                </div>
            )
        }

        // show more / show less
        let showMoreToggle = null;
        if (exceptionShowLess.indexOf(k) <= -1) {
            if (keyFilter.filters.length > limitShowLess) {
                showMoreToggle = <a className="btn-link" onClick={() => {
                    this.setState((prevState) => {
                        let v = prevState[k + "show_more"] == true ? false : true;
                        let ret = {}
                        ret[k + "show_more"] = v;
                        return ret;
                    })
                }}>
                    <br></br>
                    {isStateShowMore ? "Show Less" : "Show More " + keyFilter.title}
                </a>
            }
        }

        return <div>
            {this._title(keyFilter.title)}
            {valItems}
            {showMoreToggle}
        </div>

    }
    filters() {
        let toRet = [];

        for (var i in this.orderFilter) {
            let k = this.orderFilter[i];
            let keyFilter = this.state.filters[k];
            if (!keyFilter) {
                continue;
            }
            if (keyFilter.isRecOnly && !this.props.isRec) {
                continue;
            }
            let v = null
            if (keyFilter.isSelect) {
                v = this.filterSelect(k, keyFilter);
            } else {
                v = this.filterCheckbox(k, keyFilter)
            }

            v = this._section(v, this.customClass[k]);
            toRet.push(v);
        }
        return toRet;
    }
    onSearch() {
        //  this.loadFilter();
        this.props.onChange(this.filterState);
    }
    onResetFilter() {

        this.initFilterState();
        this.props.onChange(this.filterState);
        this.setState((prevState) => {
            return { key: prevState.key + 1 }
        })
    }
    render() {
        let v = null;
        if (this.state.loading) {
            v = <div style={{ fontSize: "14px", textAlign: "center", padding: "20px" }}>
                <Loader text="Loading Filter"></Loader>
            </div>
        } else {
            let btnAction = <div className="text-left">
                <button style={{ marginRight: "10px", paddingRight: "20px", paddingLeft: "20px" }}
                    className="btn btn-success btn-sm" onClick={this.onSearch}>
                    Search
                </button>
                <button className="btn btn-default btn-sm" onClick={this.onResetFilter}>
                    Reset Filter
                </button>
            </div>;
            btnAction = this._section(btnAction);

            v = <div key={this.state.key}>
                {this.header()}
                {btnAction}
                {this.filters()}
                {btnAction}
            </div>
        }
        return (
            <div className="browse-student-filter">
                {v}
            </div>
        );
    }
}

BrowseStudentFilter.propTypes = {
    filterStr: PropTypes.string,
    onChange: PropTypes.func,
    filterState: PropTypes.obj,
    defaultFilterState: PropTypes.obj,
    disabledFilter: PropTypes.obj,
    getQueryParam: PropTypes.func
}

BrowseStudentFilter.defaultProps = {
    filterStr: null,
    filterState: {},
    defaultFilterState: {},
    disabledFilter: {}
}
