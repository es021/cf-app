import React, { PropTypes } from "react";
import { graphql } from "../../../../helper/api-helper";
import { Loader } from "../../../component/loader";

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
                    ...filterObj,
                    ...prevState.filters
                }
                console.log(filterObj);
                return { filters: filterObj, loading: this.isStillLoading() }
            })
        })
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
            {this._title("Filter")}
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
            let sel = <select
                className={""}
                name={ch.name}
                onChange={(e) => {
                    let name = e.currentTarget.name;
                    let val = e.currentTarget.value;
                    console.log("SELECT HANDLER", name, val);
                }}
                value={null}
                defaultValue={null}
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
                <div>
                    <input
                        type="checkbox"
                        data-key={k}
                        data-val={f.val}
                        checked={null}
                        onChange={(e) => {
                            let key = e.currentTarget.dataset.key;
                            let val = e.currentTarget.dataset.val;
                            let checked = e.currentTarget.checked;
                            console.log("CHECKBOX HANDLER", key, val, checked);
                        }} />
                    {" "}
                    <span>{f.label} ({f.total})</span>
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
        let filterObj = {};
        for (var i in this.state) {
            filterObj[i] = this.state[i].filters;
        }
        this.props.onChange(filterObj);
    }
    render() {
        let v = null;
        if (this.state.loading) {
            v = <Loader></Loader>
        } else {
            v = <div>
                {this.header()}
                {this.filters()}
                <button onClick={this.onSearch}>Search</button>

                {this.props.whereStr}
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
    whereStr: PropTypes.string,
    onChange: PropTypes.func,
}

BrowseStudentFilter.defaultProps = {
    whereStr: null
}

