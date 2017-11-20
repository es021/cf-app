import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';
/*
 * props
 * loadData: function (page)
 * renderList: function (data)
 * className:
 * offset:
 * query: string of graphql query
 * dataKey: key for query response
 */
export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.page = 0;
        this.load = this.load.bind(this);

        this.state = {
            listItem: null,
            fetching: true,
            empty: false
        }

        this.NEXT = "Next";
        this.PREV = "Prev";
    }

    componentWillMount() {
        this.load(this.NEXT);
    }

    load(type) {
        // set new page
        if (type == this.NEXT) {
            this.page++;
        }

        if (type == this.PREV) {
            if (this.page == 1) {
                return false;
            }

            this.page--;
        }

        // set fetching to true
        this.setState(() => {
            return {
                fetching: true,
            }
        });

        // fetch data start
        this.props.loadData(this.page, this.props.offset).then((res) => {
            var data = res.data.data[this.props.dataKey];
            var listItem = null;
            var empty = false;
            try {

                //empty list
                if (data.length <= 0) {
                    listItem = `Nothing To Show Here`
                    empty = true;
                }
                //success
                else {
                    listItem = data.map((d, i) => {
                        return this.props.renderList(d, i)
                    });
                }

            }
            // error render
            catch (err) {
                listItem = `[Error While Rendering List] ${err}`;
            }

            this.setState(() => {
                return {listItem: listItem, fetching: false, empty: empty}
            });

        }
        // error fetching
        , (err) => {
            var listItem = `[Error While Fetching List Data] ${err}`;
            this.setState(() => {
                return {listItem: listItem, fetching: false}
            });
        });
    }

    render() {

        var loading = (this.props.loading) ? this.props.loading : <div>Loading..</div>;

        var paging = <div>
            Page <b>{this.page}</b>
            <br></br>
            {(this.page > 1) ?
                            <ButtonLink onClick={() => this.load(this.PREV)} label="Prev"></ButtonLink>
                                : null
            }
        
            {(!this.state.empty) ?
                            <ButtonLink onClick={() => this.load(this.NEXT)} label="Next"></ButtonLink>
                                : null
            }
            <br></br>
        </div>;

        var content = <div>
            <ul className={`${this.props.className}`}>
                {this.state.listItem}
            </ul>
            {paging}
        </div>;

        return (this.state.fetching) ? loading : content;
    }
}