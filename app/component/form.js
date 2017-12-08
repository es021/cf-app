import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {Loader} from './loader';
import {ButtonLink} from './buttons';
require('../css/form.scss');

export function toggleSubmit(obj, newState = {}) {
    obj.setState((prevState) => {
        newState.disableSubmit = !prevState.disableSubmit;
        return newState;
    });
}


export function checkDiff(obj, original, d) {
    var hasDiff = false;
    var update = {};
    //get differences
    for (var k in d) {
        if (d[k] !== original[k]) {
            hasDiff = true;
            update[k] = d[k];
        }
    }
    console.log(update);
    //return;
    if (!hasDiff) {
        toggleSubmit(obj, {error: "No Changes Has Been Made"});
        return false;
    } else {
        return update;
    }
}

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.form = {};
        //this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
        this.state = {
            isInit: true,
            multiple: {}
        }

        this.hasInit = false;
    }

    /*
     onChange(event) {
     console.log("handleChange");
     var name = event.target.name;
     var newState = {};
     newState[name] = event.target.value;
     }
     */

    onSubmit(event) {
        event.preventDefault();

        var ignore = []; // to ignore multiple if any
        var data_form = {};

        for (var i in this.form) {
            var formObj = this.form[i];

            if (formObj != null) {
                var name = formObj.name;
                var value = formObj.value;

                // ignore the multiple
                if (ignore.indexOf(name) >= 0) {
                    continue;
                }

                // handle multiple input
                if (this.state.multiple[name]) {
                    // if the parent of multiple is not empty,
                    // search for child input as well
                    if (value !== "") {
                        value = [value];

                        this.state.multiple[name].map((d, i) => {
                            var multiName = `${name}::${i + 1}`;
                            var multiValue = this.form[multiName].value;
                            if (multiValue != "") {
                                value.push(multiValue);
                            }

                            ignore.push(multiName);
                        });
                    }
                }

                data_form[name] = value;
            }
        }

        this.props.onSubmit(data_form);

    }

    getSelectOptions(data)
    {
        return(data.map((d, i) => {
            return <option key={i}  value={d}>{d}</option>;
        }));
    }

    //called in renderItem and addMultiple::onClickAdd
    getChildMultipleItem(d, index, defaultVal = "")
    {
        var newData = Object.assign({}, d);
        newData.name += "::" + index;
        newData.required = false;
        return this.getInputElement(newData, defaultVal);
    }

    //called in render
    addMultiple(d) {
        if (!d.multiple) {
            return null;
        }

        const onClickAdd = () => {
            this.setState((prevState) => {
                var multis = prevState.multiple[d.name];
                var newItem = this.getChildMultipleItem(d, multis.length + 1);
                prevState.multiple[d.name].push(newItem);
                return (prevState);
            });
        }

        const onClickRemove = () => {
            this.setState((prevState) => {
                prevState.multiple[d.name].pop();
                return (prevState);
            });
        }

        //init multi into state
        if (!this.state.multiple[d.name]) {
            this.state.multiple[d.name] = [];
        }

        // create multi element from state
        var multi = this.state.multiple[d.name].map((d, i) => {
            var style = {marginTop: "5px"};
            return <div style={style}>{d}</div>;
        });

        return(<div>
            {multi}
            <ButtonLink onClick={onClickAdd} label={`Add`}></ButtonLink>
            {" "}
            {(this.state.multiple[d.name].length <= 0) ? null :
                            <ButtonLink onClick={onClickRemove}label={`Remove`}></ButtonLink>}
        </div>);
    }

    getInputElement(d, defaultVal) {
        switch (d.type) {

            case 'textarea':
                return(<textarea 
                    hidden={d.hidden}
                    name={d.name}
                    rows={(d.rows) ? d.rows : 4}
                    required={d.required}
                    placeholder={d.placeholder}
                    ref={(v) => this.form[d.name] = v}
                    defaultValue={defaultVal}>
                </textarea>);
                break;
            case 'select':
                return(<select
                    hidden={d.hidden}
                    name={d.name}
                    required={d.required}
                    ref={(v) => this.form[d.name] = v}
                    defaultValue={defaultVal}>
                    {this.getSelectOptions(d.data)}
                </select>)
                break;
            default:
                //onChange={this.onChange}
                return(<input 
                    hidden={d.hidden}
                    name={d.name}
                    type={d.type}
                    min={d.min}
                    max={d.max}
                    step={d.step}
                    required={d.required}
                    placeholder={d.placeholder}
                    defaultValue={defaultVal}
                    ref={(v) => this.form[d.name] = v} />);
                break;
        }
    }

    //called in render
    renderItem(d) {
        //default value
        var defaultVal = "";

        if (this.props.defaultValues) {
            defaultVal = this.props.defaultValues[d.name];
            //default value for multiple 
            if (d.multiple) {
                try {
                    var defArray = JSON.parse(defaultVal);

                    //the first item is parent
                    defaultVal = defArray[0];

                    //if have def array then add new item
                    if (defArray !== null) {
                        var newState = [];
                        defArray.map((data, i) => {
                            if (i > 0) {
                                newState.push(this.getChildMultipleItem(d, i, data));
                            }
                        });


                        if (this.state.isInit) {
                            this.setState((prevState) => {
                                prevState.multiple[d.name] = newState;
                                prevState.isInit = false;
                                return (prevState);
                            })
                        }
                    }
                } catch (err) {
                    console.log("Failed to parse multiple default value");
                    console.log(err);
                    defaultVal = defaultVal;
                }

            }

            if (typeof defaultVal === "undefined" || defaultVal == null) {
                defaultVal = "";
            }
        }

        return this.getInputElement(d, defaultVal);

    }

    render() {
        console.log("render form", this.props.defaultValues);
        // 1. form items ---------
        var formItems = this.props.items.map((d, i) => {
            // a. label ------
            var label = null;

            if (d.label != null && d.hidden !== true) {
                label = <div className="form-label">
                    {d.label}{(d.required) ? " *" : null}
                </div>;
            }

            //b. sublabel ----
            var sublabel = (d.sublabel) ? <div className="form-sublabel">{d.sublabel}</div> : null;


            return (d.header)
                    ?
                    <div className="form-header" key={i}>{d.header}</div>
                    :
                    <div className="form-item" key={i}>
                        {label}
                        {sublabel} 
                        <div className="form-input">           
                            {this.renderItem(d)}
                            {this.addMultiple(d)}
                        </div>
                    </div>
        });

        // 2. form submit ---------
        var disableSubmit = this.props.disableSubmit;
        var submitText = (this.props.submitText) ? this.props.submitText : "Submit";
        if (disableSubmit) {
            submitText = <Loader text_pos="right" text="Please Wait"></Loader>;
        }

        var formSubmit =
                <div className="form-submit">
                    <button type="submit" 
                            className="btn btn-md btn-primary" 
                            disabled={disableSubmit}>
                        {submitText}
                    </button>
                </div>;

        // 3. form error ---------
        var formError = (this.props.error) ?
                <div className="form-error alert alert-danger">
                    {this.props.error} </div>
                : null;

        // 4. form success ---------
        if (this.props.success) {
            window.scrollTo(0, 0);
        }
        var formSuccess = (this.props.success) ?
                <div className="form-error alert alert-success">
                    {this.props.success} </div>
                : null;

        return (<form className={this.props.className} onSubmit={this.onSubmit}>
        {formSuccess}
        {formItems}
        {formError}
        {formSubmit}
    </form>);
    }
}

Form.propTypes = {
    onSubmit: PropTypes.func.isRequired, //function(data_form)
    //[{header} | {name,type,required,placeholder,rows,defaultValue}]
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.oneOf(['form-row', 'form-col']),
    disableSubmit: PropTypes.bool.isRequired,
    submitText: PropTypes.string,
    defaultValues: PropTypes.object,
    error: PropTypes.string,
    success: PropTypes.string
};