import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private _headers: HttpHeaders;
    private _baseUrl: string = environment.apiUrl;

    constructor(private _httpClient: HttpClient) {
        this._headers = new HttpHeaders().set('Contetent-Type', 'application/json');
    }

    get<T>(url: string, httpParams?: HttpParams): Observable<T> {
        const requestUrl = `${this._baseUrl}${url}`;
        return this._httpClient
            .get<T>(requestUrl, {
                params: httpParams ? httpParams : undefined,
                headers: this._headers ? this._headers : undefined,
            })
            .pipe(catchError((error: HttpErrorResponse) => this._handleError(error)));
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(error.status);
    }
}
