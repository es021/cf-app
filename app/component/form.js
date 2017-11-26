import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {Loader} from './loader';
import {ButtonLink} from './buttons';
require('../css/form.scss');
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
            <option key={i} value={d}>{d}</option>));
    }

    addMultiple(d) {
        if (!d.multiple) {
            return null;
        }

        const onClickAdd = () => {
            this.setState((prevState) => {
                var multis = prevState.multiple[d.name];

                var newData = Object.assign({}, d);

                newData.name += "::" + (multis.length + 1);

                prevState.multiple[d.name].push(this.renderItem(newData, true));
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



        console.log("state multiple");
        console.log(this.state.multiple);
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

    renderItem(d, isAdded = false) {

        d.required = (!isAdded) ? d.required : false;

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