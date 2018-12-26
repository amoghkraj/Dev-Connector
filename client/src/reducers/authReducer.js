import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        isAuthenticated: !isEmpty(action.payLoad),
        user: action.payLoad
      };
    default:
      return state;
  }
};
