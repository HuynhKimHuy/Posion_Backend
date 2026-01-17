const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
};

const ResponseStatusCode = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  PAYMENT_REQUIRED: "Payment Required",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  NOT_ACCEPTABLE: "Not Acceptable",
  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
  REQUEST_TIMEOUT: "Request Timeout",
  CONFLICT: "Conflict",
  GONE: "Gone",
  LENGTH_REQUIRED: "Length Required",
  PRECONDITION_FAILED: "Precondition Failed",
  PAYLOAD_TOO_LARGE: "Payload Too Large",
  URI_TOO_LONG: "URI Too Long",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
  RANGE_NOT_SATISFIABLE: "Range Not Satisfiable",
  EXPECTATION_FAILED: "Expectation Failed",
  IM_A_TEAPOT: "I'm a Teapot",
  MISDIRECTED_REQUEST: "Misdirected Request",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  LOCKED: "Locked",
  FAILED_DEPENDENCY: "Failed Dependency",
  TOO_EARLY: "Too Early",
  UPGRADE_REQUIRED: "Upgrade Required",
  PRECONDITION_REQUIRED: "Precondition Required",
  TOO_MANY_REQUESTS: "Too Many Requests",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",
  UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_IMPLEMENTED: "Not Implemented",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  GATEWAY_TIMEOUT: "Gateway Timeout",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
  VARIANT_ALSO_NEGOTIATES: "Variant Also Negotiates",
  INSUFFICIENT_STORAGE: "Insufficient Storage",
  LOOP_DETECTED: "Loop Detected",
  NOT_EXTENDED: "Not Extended",
  NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message = ResponseStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

export class AuthFailureError extends UnauthorizedError {}

export class PaymentRequiredError extends ErrorResponse {
  constructor(message = ResponseStatusCode.PAYMENT_REQUIRED, statusCode = StatusCode.PAYMENT_REQUIRED) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message = ResponseStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message = ResponseStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}

export class MethodNotAllowedError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.METHOD_NOT_ALLOWED,
    statusCode = StatusCode.METHOD_NOT_ALLOWED
  ) {
    super(message, statusCode);
  }
}

export class NotAcceptableError extends ErrorResponse {
  constructor(message = ResponseStatusCode.NOT_ACCEPTABLE, statusCode = StatusCode.NOT_ACCEPTABLE) {
    super(message, statusCode);
  }
}

export class ProxyAuthenticationRequiredError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.PROXY_AUTHENTICATION_REQUIRED,
    statusCode = StatusCode.PROXY_AUTHENTICATION_REQUIRED
  ) {
    super(message, statusCode);
  }
}

export class RequestTimeoutError extends ErrorResponse {
  constructor(message = ResponseStatusCode.REQUEST_TIMEOUT, statusCode = StatusCode.REQUEST_TIMEOUT) {
    super(message, statusCode);
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(message = ResponseStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode);
  }
}

export class GoneError extends ErrorResponse {
  constructor(message = ResponseStatusCode.GONE, statusCode = StatusCode.GONE) {
    super(message, statusCode);
  }
}

export class LengthRequiredError extends ErrorResponse {
  constructor(message = ResponseStatusCode.LENGTH_REQUIRED, statusCode = StatusCode.LENGTH_REQUIRED) {
    super(message, statusCode);
  }
}

export class PreconditionFailedError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.PRECONDITION_FAILED,
    statusCode = StatusCode.PRECONDITION_FAILED
  ) {
    super(message, statusCode);
  }
}

export class PayloadTooLargeError extends ErrorResponse {
  constructor(message = ResponseStatusCode.PAYLOAD_TOO_LARGE, statusCode = StatusCode.PAYLOAD_TOO_LARGE) {
    super(message, statusCode);
  }
}

export class UriTooLongError extends ErrorResponse {
  constructor(message = ResponseStatusCode.URI_TOO_LONG, statusCode = StatusCode.URI_TOO_LONG) {
    super(message, statusCode);
  }
}

export class UnsupportedMediaTypeError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.UNSUPPORTED_MEDIA_TYPE,
    statusCode = StatusCode.UNSUPPORTED_MEDIA_TYPE
  ) {
    super(message, statusCode);
  }
}

export class RangeNotSatisfiableError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.RANGE_NOT_SATISFIABLE,
    statusCode = StatusCode.RANGE_NOT_SATISFIABLE
  ) {
    super(message, statusCode);
  }
}

export class ExpectationFailedError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.EXPECTATION_FAILED,
    statusCode = StatusCode.EXPECTATION_FAILED
  ) {
    super(message, statusCode);
  }
}

export class ImATeapotError extends ErrorResponse {
  constructor(message = ResponseStatusCode.IM_A_TEAPOT, statusCode = StatusCode.IM_A_TEAPOT) {
    super(message, statusCode);
  }
}

export class MisdirectedRequestError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.MISDIRECTED_REQUEST,
    statusCode = StatusCode.MISDIRECTED_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnprocessableEntityError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.UNPROCESSABLE_ENTITY,
    statusCode = StatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
  }
}

export class LockedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.LOCKED, statusCode = StatusCode.LOCKED) {
    super(message, statusCode);
  }
}

export class FailedDependencyError extends ErrorResponse {
  constructor(message = ResponseStatusCode.FAILED_DEPENDENCY, statusCode = StatusCode.FAILED_DEPENDENCY) {
    super(message, statusCode);
  }
}

export class TooEarlyError extends ErrorResponse {
  constructor(message = ResponseStatusCode.TOO_EARLY, statusCode = StatusCode.TOO_EARLY) {
    super(message, statusCode);
  }
}

export class UpgradeRequiredError extends ErrorResponse {
  constructor(message = ResponseStatusCode.UPGRADE_REQUIRED, statusCode = StatusCode.UPGRADE_REQUIRED) {
    super(message, statusCode);
  }
}

export class PreconditionRequiredError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.PRECONDITION_REQUIRED,
    statusCode = StatusCode.PRECONDITION_REQUIRED
  ) {
    super(message, statusCode);
  }
}

export class TooManyRequestsError extends ErrorResponse {
  constructor(message = ResponseStatusCode.TOO_MANY_REQUESTS, statusCode = StatusCode.TOO_MANY_REQUESTS) {
    super(message, statusCode);
  }
}

export class RequestHeaderFieldsTooLargeError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE,
    statusCode = StatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE
  ) {
    super(message, statusCode);
  }
}

export class UnavailableForLegalReasonsError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS,
    statusCode = StatusCode.UNAVAILABLE_FOR_LEGAL_REASONS
  ) {
    super(message, statusCode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

export class NotImplementedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.NOT_IMPLEMENTED, statusCode = StatusCode.NOT_IMPLEMENTED) {
    super(message, statusCode);
  }
}

export class BadGatewayError extends ErrorResponse {
  constructor(message = ResponseStatusCode.BAD_GATEWAY, statusCode = StatusCode.BAD_GATEWAY) {
    super(message, statusCode);
  }
}

export class ServiceUnavailableError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.SERVICE_UNAVAILABLE,
    statusCode = StatusCode.SERVICE_UNAVAILABLE
  ) {
    super(message, statusCode);
  }
}

export class GatewayTimeoutError extends ErrorResponse {
  constructor(message = ResponseStatusCode.GATEWAY_TIMEOUT, statusCode = StatusCode.GATEWAY_TIMEOUT) {
    super(message, statusCode);
  }
}

export class HttpVersionNotSupportedError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.HTTP_VERSION_NOT_SUPPORTED,
    statusCode = StatusCode.HTTP_VERSION_NOT_SUPPORTED
  ) {
    super(message, statusCode);
  }
}

export class VariantAlsoNegotiatesError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.VARIANT_ALSO_NEGOTIATES,
    statusCode = StatusCode.VARIANT_ALSO_NEGOTIATES
  ) {
    super(message, statusCode);
  }
}

export class InsufficientStorageError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.INSUFFICIENT_STORAGE,
    statusCode = StatusCode.INSUFFICIENT_STORAGE
  ) {
    super(message, statusCode);
  }
}

export class LoopDetectedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.LOOP_DETECTED, statusCode = StatusCode.LOOP_DETECTED) {
    super(message, statusCode);
  }
}

export class NotExtendedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.NOT_EXTENDED, statusCode = StatusCode.NOT_EXTENDED) {
    super(message, statusCode);
  }
}

export class NetworkAuthenticationRequiredError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.NETWORK_AUTHENTICATION_REQUIRED,
    statusCode = StatusCode.NETWORK_AUTHENTICATION_REQUIRED
  ) {
    super(message, statusCode);
  }
}

export { StatusCode, ResponseStatusCode, ErrorResponse };
