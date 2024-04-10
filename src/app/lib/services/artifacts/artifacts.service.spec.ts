import { TestBed } from '@angular/core/testing';

import { ArtifactsService } from './artifacts.service';

describe('ArtifactsService', () => {
  let service: ArtifactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
