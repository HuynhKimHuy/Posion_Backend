
const StatusCode = {
    SUCCESS:200,
    CREATED:201
}

const ResponseStatusCode = {
    SUCCESS:"OK",
    CREATED:"CREATED"
}

class SuccessRespone{
    constructor({message, statusCode,ResponseStatus, metadata={}}){
        this.message = message,
        this.status= statusCode,
        this.metadata = metadata
        this.ResponseStatus = ResponseStatus
    }
    send(res){
        return res.status(this.status).json(this)
    }
}

export class OK extends SuccessRespone{
    constructor({message , statusCode = StatusCode.SUCCESS, ResponseStatus = ResponseStatusCode.SUCCESS ,metadata}){
        super({message,statusCode,ResponseStatus,metadata} )
    }
}

export class Created extends SuccessRespone{
    constructor({message , statusCode = StatusCode.CREATED, ResponseStatus = ResponseStatusCode.CREATED ,metadata}){
        super({message,statusCode,ResponseStatus,metadata})
    }
}