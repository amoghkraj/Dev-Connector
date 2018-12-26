import React, { Component } from "react";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getCurrentProfile: () => dispatch(getCurrentProfile())
});

const mapStateToProps = (state, props) => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
