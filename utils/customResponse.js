module.exports.customizeResponse = (status, description, response) => {
  return status
    ? {
        Status: "SUCCESS",
        Description: description,
        Data: response,
      }
    : {
        Status: "FAIL",
        Description: description,
        ...(response && { info: "Please check the error.log"}),
        Data: response,
      };
};
