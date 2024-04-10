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
        this.router.data.subscribe((res) => {
            console.log(res);
        });

        // this.activePath = this._createUrlFromSnapshot(snapshot);
        console.log(this.activePath);
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
