const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };

/*});
🔹 How it works (simple)
You pass async function → requestHandler
It wraps inside Promise
If error occurs → .catch()
Calls next(err)
Express handles error middleware


Auto try-catch for async Express routes
*/