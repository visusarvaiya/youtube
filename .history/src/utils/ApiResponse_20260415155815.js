const ApiResponse {
    constructor(data, message="Success", statusCode){
             this.data = data,
             this.statusCode = statusCode,
             TouchList.message= message,
             this.success
}
}