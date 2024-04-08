/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
    activePath!: string;
    regex = /^(.*?)(\?.*)?$/;
    navigation!: string[];

    constructor(protected router: ActivatedRoute) {}

    ngOnInit(): void {
        // this.router.events.subscribe((urlSegments) => {
        //     urlSegments;

        //     const navigations = this.router.url.replace(this.regex, '$1').split('/').filter(Boolean);
        //     // navigations.shift();

        //     this.navigation = navigations;
        //     // this.activePath = urlSegments.map((segment) => segment.path).join('/');
        //     console.log(urlSegments);
        // });
        const snapshot: ActivatedRouteSnapshot = this.router.snapshot;
        console.log(snapshot);
        this.activePath = this._createUrlFromSnapshot(snapshot);
    }

    private _createUrlFromSnapshot(snapshot: ActivatedRouteSnapshot): string {
        // Build the active path from the snapshot
        const segments: string[] = [];
        let currentSnapshot: ActivatedRouteSnapshot | null = snapshot;

        while (currentSnapshot) {
            if (currentSnapshot.url.length > 0) {
                segments.unshift(currentSnapshot.url[0].path);
            }
            currentSnapshot = currentSnapshot.parent;
        }

        return segments.join('/');
    }
}
