const response = (res, {code = 200, message = null, data = null}) => {
    return res.status(code).send({
        success: code < 400,
        message,
        data
    });
};
export default response;
