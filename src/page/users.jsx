import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../redux/actions/user-actions';
import {NavLink} from 'react-router-dom';
import {ButtonLink} from '../component/buttons';

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadUser: userActions.loadUser
    }, dispatch);
}



class UsersPage extends React.Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.loadNext = this.loadNext.bind(this);
    }

    componentWillMount() {
        console.log("UsersPage", "componentWillMount");

        this.props.loadUser(this.page);
    }

    loadNext() {

        this.page++;
        this.props.loadUser(this.page);
    }

    render() {
        var data = this.props.redux.data.users;
        var fetching = this.props.redux.fetching;

        if (data) {
            var dataItems = data.map((d, i) =>
                <li key={i}><NavLink to={`/app/user/${d.ID}`} activeClassName="active">{d.first_name} {d.last_name}</NavLink></li>
            );
        }

        var title = <h6>Users</h6>;
        var loading = <div>Loading..</div>;

        var content = <div>
            <ul>{dataItems}</ul>
            <ButtonLink onClick={this.loadNext} label="Next"></ButtonLink>
        </div>;

        return(<div> 
            {title}
            {(fetching) ? loading : content} 
        </div>);

    }
}

UsersPage.propTypes = {
    //cats: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
