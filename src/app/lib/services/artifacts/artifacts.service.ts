import { Injectable } from '@angular/core';
import { HttpService } from '../http/http-client-wrapper.service';
import { Artifact } from '@lib/interfaces/artifact';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArtifactService {
    constructor(protected httpService: HttpService) {}

    public getArtifacts(): Observable<Artifact> {
        return this.httpService.get<Artifact>('/articles');
    }
}
