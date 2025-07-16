import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  ResourceLoaderParams,
  ValueEqualityFn,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, throwError } from 'rxjs';

export type httpRequestOptions = {
  body?: any;
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
};
export const HTTP_SERVICE_MAP_FUNCTION = new InjectionToken<
  <T, R>(data: R) => T
>('HTTP_SERVICE_MAP_FUNCTION', {
  providedIn: 'root',
  factory:
    () =>
    <T, R>(data: R): T => {
      const result = (data as any).data;
      return result !== undefined ? (result as T) : (data as any);
    },
});
export type resourceParameters<TResponse, TRequest> = {
  request?: () => TRequest;
  equalityFunction?: ValueEqualityFn<TResponse>;
  injector?: Injector;
  abortSignal?: AbortSignal;
};

export type HttpRxRequestInputs<TResponse, TRequest = any> = {
  url: string;
  method?: string;
  opts?: httpRequestOptions;
  data?: TRequest;
  mapFunction?: <T, R>(res: R) => T;
  resourceParams?: resourceParameters<TResponse, TRequest>;
};

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  REQUEST = 'REQUEST',
  PATCH = 'PATCH',
}
@Injectable({
  providedIn: 'root',
})
export class HttpRxResourceService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly injector: Injector,
    @Inject(HTTP_SERVICE_MAP_FUNCTION)
    private readonly mapFunction: <T, R>(data: R) => T
  ) {}
  get<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs);
  }

  post<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.POST);
  }

  put<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.PUT);
  }

  delete<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.DELETE);
  }
  request<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.REQUEST);
  }
  patch<T, R>(httpRequestInputs: HttpRxRequestInputs<T, R>) {
    return this.callApi<T, Partial<R>>(httpRequestInputs, HttpMethod.PATCH);
  }
  private callApi<TResponse, TRequest>(
    httpRequestInputs: HttpRxRequestInputs<TResponse, TRequest>,
    httpMethod: HttpMethod = HttpMethod.GET
  ) {
    return rxResource<TResponse, TRequest>({
      params: httpRequestInputs.resourceParams?.request,
      stream: (params: ResourceLoaderParams<TRequest>) => {
        if (httpRequestInputs.resourceParams?.request)
          httpRequestInputs.url = this.setParamsAndQueryParams(
            httpRequestInputs.url,
            params.params
          );
        let httpRequest;
        switch (httpMethod) {
          case HttpMethod.GET:
            httpRequest = this.httpClient.get<TResponse>(
              httpRequestInputs.url,
              httpRequestInputs.opts
            );
            break;
          case HttpMethod.POST:
            httpRequest = this.httpClient.post<TResponse>(
              httpRequestInputs.url,
              httpRequestInputs.data,
              httpRequestInputs.opts
            );
            break;
          case HttpMethod.PUT:
            httpRequest = this.httpClient.put<TResponse>(
              httpRequestInputs.url,
              httpRequestInputs.data,
              httpRequestInputs.opts
            );
            break;
          case HttpMethod.DELETE:
            httpRequest = this.httpClient.delete<TResponse>(
              httpRequestInputs.url,
              httpRequestInputs.opts
            );
            break;
          case HttpMethod.REQUEST:
            httpRequest = this.httpClient.request<TResponse>(
              httpRequestInputs.method ?? 'GET',
              httpRequestInputs.url,
              httpRequestInputs.opts
            );
            break;
          case HttpMethod.PATCH:
            httpRequest = this.httpClient.patch<TResponse>(
              httpRequestInputs.url,
              httpRequestInputs.data,
              httpRequestInputs.opts
            );
        }
        return httpRequest.pipe(
          map<TResponse, TResponse>(
            httpRequestInputs.mapFunction ?? this.mapFunction
          ),
          catchError((err: HttpErrorResponse) => {
            return throwError(() => err);
          })
        );
      },
      equal: httpRequestInputs.resourceParams?.equalityFunction,
      injector: httpRequestInputs.resourceParams?.injector ?? this.injector,
    });
  }
  private setParamsAndQueryParams(url: string, request: any) {
    if (request && typeof request === 'object') {
      Object.keys(request).forEach((key, index) => {
        url = url.replace(`{${index}}`, request[key]);
      });
    }
    return url;
  }
}
