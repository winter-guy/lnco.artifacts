import { Component, OnInit } from '@angular/core';

@Component({
    standalone: true,
    imports: [],
    templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
    ngOnInit(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
