// TypeScript equivalent of Response class
export class KsHttpResponse<T = any> {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data?: T;
  exception?: ExceptionResponse;

  constructor(
    code: number,
    message: string,
    isSuccess: boolean = true,
    data?: T,
    exception?: ExceptionResponse
  ) {
    this.statusCode = code;
    this.message = message;
    this.isSuccess = isSuccess;
    this.data = data;
    this.exception = exception;
  }
}

export class ExceptionResponse {
  exceptionType: string = '';
  controller?: string = '';
  action?: string = '';
  path: string = '';
  method: string = '';
  errorDetails: any = {};
  timeOccurred: Date = new Date();
  traceId: string = '';
}

export type HttpDeleteResponse = { id: number };
