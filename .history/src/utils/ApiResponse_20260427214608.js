class ApiResponse { //standard success response format
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };

/*🔥 ApiError vs ApiResponse (very important)
Feature	ApiResponse	ApiError
Used for	Success	Errors
success	true	false
Example	Data fetched	User not found*/