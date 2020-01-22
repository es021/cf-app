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
                {this.props.whereStr}
                BrowseStudentList
            </div>
        );
    }
}


BrowseStudentList.propTypes = {
    whereStr: PropTypes.string,
}

BrowseStudentList.defaultProps = {
    whereStr: null
}
