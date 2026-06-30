interface IValidateErrorType {
    propertyName: string,
    errorMessage: string,
    attemptedValue: string,
    customState: null,
    severity: number,
    errorCode: string,
    formattedMessagePlaceholderValues: {
        PropertyName: string,
        PropertyValue: string,
        PropertyPath: string

    },
}

interface IError {
    title: string,
    status: number,
    detail: string,
    instance: string,
    traceId: string,
    ValidationErrors: IValidateErrorType[]
}

export type ErrorType1 = IError
export type ErrorType2 = Omit<IError, 'ValidationErrors'>
