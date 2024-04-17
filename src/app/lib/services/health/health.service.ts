import { Injectable } from '@angular/core';
import { HttpService } from '../http/http-client-wrapper.service';
import { Observable, BehaviorSubject } from 'rxjs';

const PREFIX = 'health';

@Injectable({
    providedIn: 'root',
})
export class HealthService {
    private _statusSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(''); // Initialize with an empty string
    public readonly status$: Observable<string | null> = this._statusSubject.asObservable();

    constructor(public readonly httpService: HttpService) {
        this._fetchStatus(); // Fetch initial status when the service is instantiated
    }

    public healthCheck(): Observable<{ status: string }> {
        return this.httpService.get<{ status: string }>(`${PREFIX}/status`);
    }

    private _fetchStatus(): void {
        this.healthCheck().subscribe(
            (response) => {
                this._statusSubject.next(response.status);
            },
            () => {
                // console.error('Error fetching status:', error);
                this._statusSubject.next(null);
            },
        );
    }

    public updateStatusManually(): void {
        this._fetchStatus(); // Manually trigger the health check
    }
}
