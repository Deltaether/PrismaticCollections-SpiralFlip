import { TestBed } from '@angular/core/testing';

import { MenuIntegrationService } from './menu-integration.service';

describe('MenuIntegrationService', () => {
  let service: MenuIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
