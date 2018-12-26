import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { clearErrors } from "../../actions/errorsActions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(() => ({
      [name]: value
    }));
  }

  onSubmit(e) {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(user);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.auth.isAuthenticated) {
      this.props.clearErrors();
      this.props.history.push("/dashboard");
    }
    if (newProps.errors) {
      this.setState(() => ({
        errors: newProps.errors
      }));
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.email
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  loginUser: user => dispatch(loginUser(user)),
  clearErrors: () => dispatch(clearErrors())
});

const mapStateToProps = (state, props) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
