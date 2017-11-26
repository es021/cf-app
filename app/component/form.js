import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {Loader} from './loader';
require('../css/form.scss');
export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.form = {};
        //this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
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
        var data_form = {};
        for (var i in this.form) {
            var name = this.form[i].name;
            var value = this.form[i].value;
            data_form[name] = value;
        }

        this.props.onSubmit(data_form);
        event.preventDefault();
    }

    getSelectOptions(data) {
        return(data.map((d, i) =>
            <option value={d}>{d}</option>));
    }

    renderItem(d) {

        switch (d.type) {

            case 'textarea':
                return(<textarea 
                    name={d.name}
                    rows={(d.rows) ? d.rows : 4}
                    required={d.required}
                    placeholder={d.placeholder}
                    ref={(v) => this.form[d.name] = v}>
                    {d.defaultValue}
                </textarea>);
                break;
            case 'select':
                return(<select
                    name={d.name}
                    required={d.required}
                    ref={(v) => this.form[d.name] = v}>
                    {this.getSelectOptions(d.data)}
                </select>)
                break;
            default:
                //onChange={this.onChange}
                return(<input 
                    name={d.name}
                    type={d.type}
                    required={d.required}
                    placeholder={d.placeholder}
                    value={d.defaultValue}
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
                        <div className="form-label">{d.label}</div>
                        <div className="form-input">           
                            {this.renderItem(d)}
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
        {formSubmit}
        {formError}
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
    error: PropTypes.string
};