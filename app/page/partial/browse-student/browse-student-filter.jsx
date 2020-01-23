import React, { PropTypes } from "react";
import { graphql } from "../../../../helper/api-helper";
import { Loader } from "../../../component/loader";

export function createFilterStr(filterObj) {
    let r = "";
    for (var k in filterObj) {

        let combineVal = "";
        for (var i in filterObj[k]) {
            let v = filterObj[k][i];
            if (v != "" && v != null) {
                combineVal += v + "::";
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

    console.log("createFilterStr", filterObj, r);
    return r;

}
export class BrowseStudentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);

        this.state = {
            loading: false,
            filters: {
                ...this.getDateStateObj("working_availability", "to", "Working Availability"),
                ...this.getDateStateObj("graduation", "from", "Graduation Date From"),
                ...this.getDateStateObj("graduation", "to", "Graduation Date To"),
            },
            dataset_year: [],
            dataset_month: [],
        };

        if (this.props.defaultFilterState) {
            this.filterState = JSON.parse(JSON.stringify(this.props.defaultFilterState));
        } else {
            this.filterState = {};
        }
    }

    getFavouriteFilter() {
        return {
            favourited_only: {
                title: "",
                filters: [{
                    val: "1",
                    label: "Show Favourite Student Only",
                    total: null
                }]
            }
        }
    }

    loadFilter() {
        this.setState({ loading: true })
        let q = `query{
            browse_student_filter {
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
                    ...this.getFavouriteFilter(),
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
                table_name :"${k}"
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



    _section(body) {
        return <div className="bsf-section">
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
    filterCheckbox(k, keyFilter) {
        let valItems = []
        for (var i in keyFilter.filters) {
            let f = keyFilter.filters[i];
            valItems.push(
                <div className="checkbox-style-1">
                    <label className="cb1-container small green">
                        {f.label} {f.total ? `(${f.total})` : ""}
                        <input
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
        return <div>
            {this._title(keyFilter.title)}
            {valItems}
        </div>

    }
    filters() {
        let toRet = [];

        for (var k in this.state.filters) {
            let keyFilter = this.state.filters[k];
            let v = null
            if (keyFilter.isSelect) {
                v = this.filterSelect(k, keyFilter);
            } else {
                v = this.filterCheckbox(k, keyFilter)
            }

            v = this._section(v);
            toRet.push(v);
        }


        return toRet;
    }
    onSearch() {
        this.props.onChange(this.filterState);
    }
    onResetFilter() {

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

            v = <div>
                {this.header()}
                {btnAction}
                {this.filters()}
                {btnAction}
                {/* {this._section(this.props.filterStr)} */}
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
    defaultFilterState: PropTypes.obj,
}

BrowseStudentFilter.defaultProps = {
    filterStr: null,
    defaultFilterState: {}
}

