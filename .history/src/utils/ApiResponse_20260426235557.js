class ApiResponse { //standard success response format
    constructor(data, statusCode, message = "success") {
        this.data = data;
        this.statusCode = statusCode;
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