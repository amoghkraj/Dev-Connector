export const getErrors = errorData => {
  return {
    type: "GET_ERRORS",
    payLoad: errorData.response.data
  };
};

export const clearErrors = () => {
  return {
    type: "CLEAR_ERRORS"
  };
};
