import { TestBed } from '@angular/core/testing';

import { AuthyService } from './auth.service';

describe('AuthService', () => {
    let service: AuthyService;

    beforeEach(() => {
        TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
        service = TestBed.inject(AuthyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
