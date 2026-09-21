class ApiError(Exception):
    status_code = 400

    def __init__(self, message, status_code=None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code


class ValidationError(ApiError):
    status_code = 400


class AuthenticationError(ApiError):
    status_code = 401


class NotFoundError(ApiError):
    status_code = 404


class ConflictError(ApiError):
    status_code = 409
