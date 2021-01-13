import React, { PropTypes } from "react";
import { graphql } from "../../../../helper/api-helper";
import { Loader } from "../../../component/loader";
import Tooltip from "../../../component/tooltip";
import { isCfLocal, getCF, getAuthUser, isCfFeatureOn, getCfCustomMeta } from "../../../redux/actions/auth-actions";
import { ButtonExport } from '../../../component/buttons.jsx';
import { getExternalFeedbackBtn } from '../../../page/partial/analytics/feedback';
import { lang, isHasOtherLang, currentLang } from "../../../lib/lang";
import { customBlockLoader } from "../../../redux/actions/layout-actions";
import { CFSMeta } from "../../../../config/db-config";
import { _student_plural_lower, _student_plural } from "../../../redux/actions/text-action";
import { cfCustomFunnel } from "../../../../config/cf-custom-config";
import { isInCustomOrder } from "../../../../config/registration-config";


export function createFilterStr(filterObj, validCf, { isPageStudentListJobPost }) {
    validCf = Array.isArray(validCf) ? validCf : []

    let r = "";
    let filterExist = {};
    for (var k in filterObj) {

        if (isPageStudentListJobPost) {
            if (k == "cf") {
                continue;
            }
        }

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
    if (!isPageStudentListJobPost) {
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

        const originalByCfOrder = [
            "unisza_faculty",
            "unisza_course",
            "current_semester",
            "course_status",
            "employment_status",
            "country_study",
            "local_or_oversea_study",
            "unemployment_period",
            "monash_school",
            "sunway_faculty",
            "sunway_program",
            "university",
            "field_study_main", // @limit_field_of_study_2_before_deploy - uncomment
            // "field_study", // @limit_field_of_study_2_before_deploy - comment
            "looking_for_position",
            "working_availability_from",
            "working_availability_to",
            "local_or_oversea_location",
            "gender",
            "work_experience_year",
            "graduation_from", "graduation_to",
            "interested_job_location",
            "where_in_malaysia", "skill"]
        // 6a. @custom_user_info_by_cf - order filter
        this.orderFilter = [
            "like_job_post_only",
            "interested_only",
            "favourited_only",
            "drop_resume_only",
            // "cf",
            "name",
            ...cfCustomFunnel({ action: 'get_keys_for_filter' }),
            ...originalByCfOrder
        ];
        // @browse_student_only_showing_one_cf
        // remove comment cf above to revert

        this.hiddenFilter = []
        if (this.props.isPageStudentListJobPost) {
            this.hiddenFilter.push("cf");
            this.hiddenFilter.push("interested_only");
            this.hiddenFilter.push("like_job_post_only");
        }
        for (let k of originalByCfOrder) {
            if (!isInCustomOrder(getCF(), k)) {
                this.hiddenFilter.push(k);
            }
        }

        this.customClass = {
            "working_availability_from": "no-border",
            "graduation_from": "no-border",
        }

        this.state = {
            key: 1,
            loading: false,
            filters: {
                "name": {
                    title: lang("Name"),
                    isText: true,
                    placeholder: lang("Search by name")
                },
                ...this.getDateStateObj("working_availability", "from", lang("Working Availability") + " " + lang("From")),
                ...this.getDateStateObj("working_availability", "to", lang("Working Availability") + " " + lang("To")),
                ...this.getDateStateObj("graduation", "from", lang("Graduation Date") + " " + lang("From")),
                ...this.getDateStateObj("graduation", "to", lang("Graduation Date") + " " + lang("To")),
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
                // isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>{lang("Show")} <b>{lang(`shortlisted ${_student_plural_lower()}`)}</b> {lang("only")}
                        <Tooltip
                            bottom="13px"
                            left="-88px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={<i style={{ marginLeft: "7px" }} className="fa fa-question-circle"></i>}
                            tooltip={
                                <div style={{ padding: "0px 5px" }} className="text-left">
                                    <small>{lang(`Click on grey shortlist button to shortlist ${_student_plural_lower()}`)}
                                    </small>
                                </div>
                            }
                        ></Tooltip>
                    </div>,
                    total: null
                }]
            },
            like_job_post_only: {
                // isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>{lang("Show")} <b>{lang("applicants from your job post")}</b> {lang("only")}
                        <Tooltip
                            bottom="13px"
                            left="-90px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={null}
                            tooltip={null}
                        ></Tooltip>
                    </div>,
                    total: null
                }]
            },
            drop_resume_only: {
                // isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>{lang("Show")} <b>{lang("resume drop")}</b> {lang("only")}
                        <Tooltip
                            bottom="13px"
                            left="-90px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={null}
                            tooltip={null}
                        ></Tooltip>
                    </div>,
                    total: null
                }]
            },
            interested_only: {
                // isRecOnly: true,
                title: "",
                filters: [{
                    val: "1",
                    label: <div>{lang("Show")} <b>{lang(`interested ${_student_plural_lower()}`)}</b> {lang("only")}
                        <Tooltip
                            bottom="13px"
                            left="-90px"
                            width="200px"
                            alignCenter={true}
                            debug={false}
                            content={<i style={{ marginLeft: "7px" }} className="fa fa-question-circle"></i>}
                            tooltip={
                                <div style={{ padding: "0px 5px" }} className="text-left">
                                    <small>{lang(`${_student_plural()} that`)} :
                                    <ol>
                                            <li>{lang("Liked your company profile")}</li>
                                            <li>{lang("Liked your job posts")}</li>
                                            <li>{lang("RSVP'ed for your events")}</li>
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
    loadFilter() {
        this.setState({ loading: true })
        let param = `current_cf:"${getCF()}", discard_filter:"${this.discardFilter}"`;

        // limit filter and count untuk initial filter je
        // for case page student list job post, dia akan filter sapa yang like job post je
        if (this.props.isPageStudentListJobPost) {
            let queryParam = this.props.getQueryParam({
                filterStr: this.props.filterStr,
                company_id: this.props.company_id,
                noBracket: true,
            })
            param += ` , ${queryParam} `
        }

        // add lang param
        if (isHasOtherLang()) {
            param += ` , lang:"${currentLang()}" `;
        }

        let q = `query{
            browse_student_filter( ${param} ) {
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

                let label = f._val_label ? f._val_label : f._val;
                // if(k == "cf"){
                //     // label = label.replaceAll("<br>", " ");
                //     label = <span dangerouslySetInnerHTML={{__html : label}}></span>

                // }

                filterObj[k].filters.push({
                    val: f._val,
                    label: lang(label),
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

    addFilter(key, val, isSingleValue = false) {
        if (!this.filterState[key]) {
            this.filterState[key] = [];
        }

        if (isSingleValue) {
            this.filterState[key] = [val]
        } else {
            if (this.filterState[key].indexOf(val) <= -1) {
                this.filterState[key].push(val);
            }
        }


        console.log(this.filterState);

    }
    removeFilter(key, val, isSingleValue = false) {
        console.log("removeFilter", key, val);

        if (this.filterState[key]) {
            if (isSingleValue || this.filterState[key].indexOf(val) >= 0) {
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
        // 6b. @custom_user_info_by_cf - filter label
        return {
            ...cfCustomFunnel({ action: 'get_label_for_filter' }),
            monash_school: lang("School"),
            sunway_faculty: lang("School"),
            sunway_program: lang("Programme"),
            unisza_faculty: lang("Faculty"),
            unisza_course: lang("Study Course"),
            current_semester: lang("Current Semester"),
            course_status: lang("Course Status"),
            employment_status: lang("Employment Status"),
            cf: lang("Career Fair"),
            university: lang("University"),
            country_study: lang("Country Of Study"),
            // field_study: lang("Field Of Study"), // @limit_field_of_study_2_before_deploy - comment 
            field_study_main: lang("Field Of Study"), // @limit_field_of_study_2_before_deploy - uncomment 
            interested_job_location: lang("Preferred Job Location"),
            where_in_malaysia: lang("City/State In Malaysia"),
            looking_for_position: lang("Looking For"),
            skill: lang("Skills"),
            gender: lang("Gender"),
            work_experience_year: lang("Relevant Working Experience"),
            unemployment_period: lang("Unemployment Period"),
            local_or_oversea_study: lang("Study Place"),
            local_or_oversea_location: lang("Currently Located"),
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
            <div style={{ fontWeight: "bold", fontSize: "15px" }}>{lang("Filter")}</div>
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
                        {lang(label)}
                    </option>
                );
            });
        }
    }

    // todo
    filterText(k, keyFilter, placeholder) {
        console.log("k", k)
        console.log("keyFilter", keyFilter)
        return <div>
            {this._title(keyFilter.title)}
            <input
                style={{ width: "80%" }}
                className={"text-style-1"}
                name={k}
                placeholder={placeholder}
                onChange={(e) => {
                    let name = e.currentTarget.name;
                    let val = e.currentTarget.value;
                    console.log("TEXT HANDLER", name, val);
                    let isSingleValue = true;
                    if (!val) {
                        this.removeFilter(name, val, isSingleValue);
                    } else {
                        this.addFilter(name, val, isSingleValue);
                    }
                }}
                type={"text"}
            />
        </div>
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
                        let isSingleValue = true;
                        if (!val) {
                            this.removeFilter(name, val, isSingleValue);
                        } else {
                            this.addFilter(name, val, isSingleValue);
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
                    {isStateShowMore ? lang("Show Less") : lang("Show More") + " " + keyFilter.title}
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

            if (this.hiddenFilter.indexOf(k) >= 0) {
                continue;
            }

            // if (keyFilter.isRecOnly && !this.props.isRec) {
            //     continue;
            // }
            let v = null
            if (keyFilter.isSelect) {
                v = this.filterSelect(k, keyFilter);
            } else if (keyFilter.isText) {
                v = this.filterText(k, keyFilter, keyFilter.placeholder);
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
    getButtonExport() {
        const asyncValidation = (validHandler) => {
            var q = `query {has_feedback(user_id: ${getAuthUser().ID}) }`;
            graphql(q).then((res) => {
                let alreadyHasFeedback = res.data.data.has_feedback
                let isFeatureOff = !isCfFeatureOn(CFSMeta.FEATURE_FEEDBACK)
                let externalUrl = getCfCustomMeta(CFSMeta.LINK_EXTERNAL_FEEDBACK_REC, null);
                if (alreadyHasFeedback || isFeatureOff || !externalUrl) {
                    validHandler();
                } else {
                    var body = <div>
                        <h3 style={{ color: "#286090" }}>
                            {/* {lang("Help Us To Improve")} */}
                            {lang("Your feedback is very valuable to us.")}
                            <br></br>
                            <small>
                                {lang("Please answer a short feedback questions to continue.")}
                            </small>
                        </h3>
                        {getExternalFeedbackBtn(externalUrl)}
                    </div>;
                    customBlockLoader(body, "Open Feedback Form", null, null, true);
                    // customBlockLoader(body, "Open Feedback Form", null, `${RootPath}/app/feedback/recruiter`, true);
                }
            });
        }

        let filter = this.props.filterStr + `, company_id : ${this.props.company_id}`
        return <ButtonExport asyncValidation={asyncValidation}
            style={{ margin: "5px" }} btnClass="gray btn-round-5" action="browse_student"
            text={<span>{lang("Export")} <b>{lang("Searched Result")}</b> {lang("As Excel")}</span>}
            filter={filter} cf={getCF()}></ButtonExport>
    }
    render() {
        let v = null;
        if (this.state.loading) {
            v = <div style={{ fontSize: "14px", textAlign: "center", padding: "20px" }}>
                <Loader text={lang("Loading") + " " + lang("Filter")}></Loader>
            </div>
        } else {
            let btnAction = <div className="text-left">
                <button style={{ margin: "5px" }}
                    className="btn btn-primary btn-round-5 btn-sm" onClick={this.onSearch}>
                    <i className="fa fa-search left"></i>
                    {lang("Search")}
                </button>
                <button style={{ margin: "5px" }} className="btn btn-default btn-round-5 btn-sm" onClick={this.onResetFilter}>
                    <i className="fa fa-times left"></i>
                    {lang("Reset Filter")}
                </button>
                {this.getButtonExport()}
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
    isPageStudentListJobPost: PropTypes.bool,
    isPageInterestedStudent: PropTypes.bool,
    company_id: PropTypes.number,
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

