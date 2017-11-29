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

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.form = {};
        //this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
        this.state = {
            multiple: {}
        }
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

        var ignore = [];
        var data_form = {};
        for (var i in this.form) {

            var name = this.form[i].name;
            var value = this.form[i].value;

            // ignore the multiple
            if (ignore.indexOf(name) >= 0) {
                continue;
            }

            // handle multiple input
            if (this.state.multiple[name]) {

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

            data_form[name] = value;
        }

        this.props.onSubmit(data_form);

    }

    getSelectOptions(data) {
        return(data.map((d, i) => {
            return <option key={i}  value={d}>{d}</option>;
        }));
    }

    getNewChildItem(d, index) {
        var newData = Object.assign({}, d);
        newData.name += "::" + index;
        return this.renderItem(newData, true);
    }

    addMultiple(d, defArray = null) {
        if (!d.multiple) {
            return null;
        }


        const onClickAdd = () => {
            this.setState((prevState) => {
                var multis = prevState.multiple[d.name];
                var newItem = this.getNewChildItem(d, multis.length + 1);
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

        if (!this.state.multiple[d.name]) {
            this.state.multiple[d.name] = [];
        }

        //console.log("state multiple");
        //console.log(this.state.multiple);
        var multi = this.state.multiple[d.name].map((d, i) => {
            var style = {marginTop: "5px"};
            return <div style={style}>{d}</div>;
        });

        return(<div>{multi}
            <ButtonLink onClick={onClickAdd}
                        label={`Add`}>
            </ButtonLink>{" "}
            {(this.state.multiple[d.name].length <= 0) ? null :
                            <ButtonLink onClick={onClickRemove}
                                        label={`Remove`}>
                            </ButtonLink>}
        </div>);
    }

    getDefaultVal(d) {

    }

    renderItem(d, isAdded = false) {

        // from multiple
        d.required = (!isAdded) ? d.required : false;

        //default value
        var defaultVal = this.props.defaultValues[d.name];

        console.log(d.name);
        console.log(defaultVal);

        //default value for multiple 
        if (d.multiple && false) {
            try {
                var defArray = JSON.parse(defaultVal);
                defaultVal = defArray[0];

                //parent
                if (!isAdded) {

                    //if have def array then add new item
                    if (defArray !== null) {
                        var newState = [];
                        defArray.map((d, i) => {
                            newState.push(this.getNewChildItem(i + 1));
                        });

                        console.log("add new stuff", defArray);
//            
//            this.setState((prevState) => {
//                prevState.multiple[d.name] = newState;
//                return (prevState);
//            })
                    }
                }

            } catch (err) {
                console.log(err);
                defaultVal = defaultVal;
            }

        }



        if (typeof defaultVal === "undefined" || defaultVal == null) {
            defaultVal = "";
        }


        switch (d.type) {

            case 'textarea':
                return(<textarea 
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

    render() {
        // 1. form items ---------
        var formItems = this.props.items.map((d, i) =>
            (d.header)
                    ?
                    <div className="form-header" key={i}>{d.header}</div>
                    :
                    <div className="form-item" key={i}>
                        <div className="form-label">
                            {d.label}{(d.required) ? " *" : null}
                        </div>
                        {(d.sublabel) ? <div className="form-sublabel">{d.sublabel}</div> : null}
                        <div className="form-input">           
                            {this.renderItem(d)}
                            {this.addMultiple(d)}
                        </div>
                    </div>
        );
        // 2. form submit ---------
        var disableSubmit = this.props.disableSubmit;
        var submitText = (this.props.submitText) ? this.props.submitText : "Submit";
        if (disableSubmit) {
            submitText = <Loader text_pos="right" text="Please Wait"></Loader>;
        }

        var formSubmit =
                <div className="form-submit">
                    <button type="submit" 
                            className="btn btn-sm btn-primary" 
                            disabled={disableSubmit}>
                        {submitText}
                    </button>
                </div>;
        // 3. form error ---------
        var formError = (this.props.error) ?
                <div className="form-error alert alert-danger">
                    {this.props.error} </div>
                : null;
        return (<form className={this.props.className} onSubmit={this.onSubmit}>
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
    error: PropTypes.string
};