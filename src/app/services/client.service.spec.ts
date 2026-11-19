import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiUrl: 'http://localhost:3334' } },
      ],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fall back to /api/client/:address/chart when payout-modes endpoint returns 404', (done) => {
    service.getClientInfoChartByPayoutMode('bc1qtest', 'all').subscribe((rows) => {
      expect(rows).toEqual([{ label: '2026-01-01T00:00:00Z', data: 100, payoutMode: 'solo' }]);
      done();
    });

    const payoutReq = httpMock.expectOne('http://localhost:3334/api/client/bc1qtest/chart/payout-modes?payoutMode=all');
    payoutReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const fallbackReq = httpMock.expectOne('http://localhost:3334/api/client/bc1qtest/chart');
    fallbackReq.flush([{ label: '2026-01-01T00:00:00Z', data: 100 }]);
  });
});
