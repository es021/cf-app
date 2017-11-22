import React, { Component } from 'react';

/*
 * onSubmit : function(data_form)
 * items : [{name,type,required,placeholder}]
 * className :
 * disableSubmit: boolean
 */
export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.form = {};

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        return;
        console.log("handleChange");
        var name = event.target.name;
        var newState = {};
        newState[name] = event.target.value;
    }

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

    render() {
        var formItems = this.props.items.map((d, i) =>
            <div className="form-item" key={i}>
                <div className="form-label">{d.label}</div>
                <div className="form-input">           
                    <input 
                        name={d.name}
                        type={d.type}
                        required={d.required}
                        placeholder={d.placeholder}
                        onChange={this.onChange}
                        ref={(v) => this.form[d.name] = v} />
                </div>
            </div>);

        return (<form className={this.props.className} onSubmit={this.onSubmit}>
            {formItems}
            <input type="submit" disabled={this.props.disableSubmit} value="Submit" />
        </form>);
    }
}

