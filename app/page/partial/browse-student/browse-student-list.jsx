import React, { PropTypes } from "react";

export class BrowseStudentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="browse-student-list">
                <div>{this.props.filterStr}</div>
            </div>
        );
    }
}


BrowseStudentList.propTypes = {
    filterStr: PropTypes.string,
}

BrowseStudentList.defaultProps = {
    filterStr: null
}
