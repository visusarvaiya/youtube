class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.message = message; // err msg
        this.success = false;// always f
        this.errors = errors; // extra details 

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

/*
Instead of using:

throw new Error("User not found");

You can do:

throw new ApiError(404, "User not found");

🔹 Why we use this
✅ Add statusCode
✅ Send structured error response
✅ Keep error handling clean
✅ Used with asyncHandler

Route → asyncHandler → throw ApiError → error middleware → response
*/