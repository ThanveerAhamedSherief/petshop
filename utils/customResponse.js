module.exports.customizeResponse = (status,code, description, response) => {
  return status
    ? {
        Status: "SUCCESS",
        Description: description,
        Code:code,
        Data: response,
      }
    : {
        Status: "FAIL",
        Code: code,
        Description: description,
        ...(response && { info: "Please check the error.log"}),
        Data: response,
      };
};
