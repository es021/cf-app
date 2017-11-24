import React, { Component } from 'react';
import {PropTypes} from 'prop-types';

require('../css/form.scss');

export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.form = {};

        //this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

        return (<form className={this.props.className} onSubmit={this.onSubmit}>
            {formItems}
            <input type="submit" disabled={this.props.disableSubmit} value="Submit" />
        </form>);
    }
}

Form.propTypes = {
    onSubmit: PropTypes.func.isRequired, //function(data_form)
    //[{header} | {name,type,required,placeholder,rows,defaultValue}]
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.oneOf(['form-row', 'form-col']),
    disableSubmit: PropTypes.bool
};