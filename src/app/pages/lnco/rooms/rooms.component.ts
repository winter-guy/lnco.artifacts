import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-rooms',
    standalone: true,
    imports: [MatDatepickerModule],
    templateUrl: './rooms.component.html',
    styleUrl: './rooms.component.css',
})
export class RoomsComponent {
    selected!: Date | null;
}
