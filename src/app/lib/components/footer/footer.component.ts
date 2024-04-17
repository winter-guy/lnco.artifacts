import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PACKAGE_JSON, providePackageJson } from '@lib/providers';
import { LogoComponent } from '../logo/logo.component';
import { HttpService } from '@lib/services/http/http-client-wrapper.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoComponent],
    providers: [providePackageJson()],
    templateUrl: './footer.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
    readonly packageJson = inject(PACKAGE_JSON);
    readonly health = inject(HttpService);

    readonly currentYear = new Date().getFullYear();

    state!: number;
    ngOnInit(): void {
        this.health.status$.subscribe((res) => {
            this.state = res;
            console.log(res);
        });
    }

    //create it through behaviour subject
}
