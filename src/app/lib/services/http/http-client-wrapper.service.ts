import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, EMPTY, Observable, catchError, switchMap, tap, throwError, timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private _headers: HttpHeaders;
    private _baseUrl: string = environment.apiUri;
    private _timeoutDuration = 3000;

    constructor(private _httpClient: HttpClient) {
        this._headers = new HttpHeaders().set('Content-Type', 'application/json');
    }

    get<T>(url: string, httpParams?: HttpParams): Observable<T> {
        const requestUrl = `${this._baseUrl}${url}`;
        return this._httpClient
            .get<T>(requestUrl, {
                params: httpParams ? httpParams : undefined,
                headers: this._headers ? this._headers : undefined,
            })
            .pipe(
                tap(() => this._setStatus(0)),
                catchError((error: HttpErrorResponse) => this._handleHttpError(error)),
            );
    }

    post<T, K>(url: string, model: K | null, httpParams?: HttpParams): Observable<T> {
        const requestUrl = `${this._baseUrl}${url}`;
        return this._httpClient
            .post<T>(requestUrl, model, {
                params: httpParams ? httpParams : undefined,
                headers: this._headers ? this._headers : undefined,
            })
            .pipe(
                tap(() => this._setStatus(0)),
                catchError((error: HttpErrorResponse) => this._handleHttpError(error)),
            );
    }

    patch<T, K>(url: string, model: K | null, httpParams?: HttpParams): Observable<T> {
        const requestUrl = `${this._baseUrl}${url}`;
        return this._httpClient
            .patch<T>(requestUrl, model, {
                params: httpParams ? httpParams : undefined,
                headers: this._headers ? this._headers : undefined,
            })
            .pipe(
                tap(() => this._setStatus(0)),
                catchError((error: HttpErrorResponse) => this._handleHttpError(error)),
            );
    }

    delete<T>(url: string, httpParams?: HttpParams): Observable<T> {
        const requestUrl = `${this._baseUrl}${url}`;
        return this._httpClient
            .delete<T>(requestUrl, {
                params: httpParams ? httpParams : undefined,
                headers: this._headers ? this._headers : undefined,
            })
            .pipe(
                tap(() => this._setStatus(0)),
                catchError((error: HttpErrorResponse) => this._handleHttpError(error)),
            );
    }

    private _handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(error.status);
    }

    private _statusSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); // Initialize with an empty string
    public readonly status$: Observable<number> = this._statusSubject.asObservable();

    private _setStatus(status: number): void {
        this._statusSubject.next(status);
    }

    private _handleHttpError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            // console.error('A client-side or network error occurred:', error.error.message);
            this._setStatus(error.status);
        } else {
            // console.error('The backend returned an unsuccessful response code:', error.status);
            this._setStatus(503);
        }
        return throwError(error);
    }

    private _timeoutHandler<T>(): (source: Observable<T>) => Observable<T> {
        return (source: Observable<T>) =>
            source.pipe(
                switchMap(() =>
                    timer(this._timeoutDuration).pipe(
                        switchMap(() => {
                            this._statusSubject.next(300); // Log timeout status code
                            return EMPTY; // Return an empty observable to terminate the stream
                        }),
                    ),
                ),
            );
    }
}
