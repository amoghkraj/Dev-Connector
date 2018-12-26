import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import profileReducer from "./profileReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorsReducer,
  profile: profileReducer
});

export default rootReducer;
