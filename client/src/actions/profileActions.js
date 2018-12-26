import axios from "axios";
import { getErrors } from "./errorsActions";

// Get current profile
export const getCurrentProfile = () => {
  return dispatch => {
    dispatch(setProfileLoading());
    axios
      .get("/api/profile")
      .then(res =>
        dispatch({
          type: "GET_PROFILE",
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: "GET_PROFILE",
          payload: {}
        })
      );
  };
};

// Create Profile
export const createProfile = (profileData, history) => {
  return dispatch => {
    axios
      .post("/api/profile", profileData)
      .then(res => history.push("/dashboard"))
      .catch(err => dispatch(getErrors(err)));
  };
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: "PROFILE_LOADING"
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: "CLEAR_CURRENT_PROFILE"
  };
};