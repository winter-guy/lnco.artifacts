import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactComponent } from './artifact.component';

describe('ArtifactComponent', () => {
    let component: ArtifactComponent;
    let fixture: ComponentFixture<ArtifactComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArtifactComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtifactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
