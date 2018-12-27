import axios from "axios";
import { getErrors } from "./errorsActions";
import jwt_decode from "jwt-decode";
import setTokenToReqHeader from "../utils/setTokenToReqHeader";

// reigister user
export const registerUser = (userData, history) => {
  return dispatch => {
    axios
      .post("api/users/register", userData)
      .then(res => history.push("/login"))
      .catch(err => dispatch(getErrors(err)));
  };
};

// Login - Get User Token
export const loginUser = userData => {
  return dispatch => {
    axios
      .post("api/users/login", userData)
      .then(res => {
        // Save token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        //Set token to header
        setTokenToReqHeader(token);
        //decode the token
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err => dispatch(getErrors(err)));
  };
};

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: "SET_CURRENT_USER",
    payLoad: decoded
  };
};

// logout user
export const logoutUser = () => {
  return dispatch => {
    // Remove token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setTokenToReqHeader(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };
};
