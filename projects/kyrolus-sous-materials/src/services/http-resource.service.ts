import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  inject,
  Injectable,
  Injector,
  resource,
  ResourceLoaderParams,
} from '@angular/core';
import { HttpMethod, resourceParameters } from './http-rx-resource.service';
export type HttpRequestInputs<T, R = any> = {
  url: string;
  opts?: HttpRequestOptions;
  data?: any;
  resourceParams?: resourceParameters<T, R>;
};
interface HttpRequestOptions {
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  integrity?: string;
  keepalive?: boolean;
  mode?: RequestMode;
  priority?: RequestPriority;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  window?: null;
}
@Injectable({
  providedIn: 'root',
})
export class HttpResourceService {
  readonly httpClient = inject(HttpClient);
  private readonly injector = inject(Injector);

  get<T, R>(httpRequestInputs: HttpRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs);
  }

  post<T, R>(httpRequestInputs: HttpRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.POST);
  }

  put<T, R>(httpRequestInputs: HttpRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.PUT);
  }

  delete<T, R>(httpRequestInputs: HttpRequestInputs<T, R>) {
    return this.callApi<T, R>(httpRequestInputs, HttpMethod.DELETE);
  }
  private callApi<T, R>(
    httpRequestInputs: HttpRequestInputs<T, R>,
    httpMethod: HttpMethod = HttpMethod.GET
  ) {
    return resource<T, R>({
      params: httpRequestInputs.resourceParams?.request,
      loader: async (params: ResourceLoaderParams<R>) => {
        if (httpRequestInputs.resourceParams?.request)
          httpRequestInputs.url = this.setParamsAndQueryParams(
            httpRequestInputs.url,
            params.params
          );
        let body;
        if (httpMethod === HttpMethod.GET || httpMethod === HttpMethod.DELETE) {
          body = undefined;
        } else {
          body =
            httpRequestInputs.data instanceof URLSearchParams
              ? httpRequestInputs.data
              : JSON.stringify(httpRequestInputs.data);
        }

        const fetchOptions: RequestInit = {
          method: httpMethod,
          body: body,
          signal: params.abortSignal,
          ...httpRequestInputs.opts,
        };
        try {
          const response = await fetch(httpRequestInputs.url, fetchOptions);
          if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new HttpErrorResponse({
              error: errorBody || `HTTP error! Status: ${response.status}`,
              status: response.status,
              statusText: response.statusText,
              url: httpRequestInputs.url,
            });
          }
          return (await response.json()) as T;
        } catch (error) {
          if (error instanceof HttpErrorResponse) throw error;
          throw new HttpErrorResponse({
            error,
            status: 0,
            statusText: 'Unknown Error',
            url: httpRequestInputs.url,
          });
        }
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
