import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiUrl: 'http://localhost:3334' } },
      ],
    });
    service = TestBed.inject(AppService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fall back to /api/info/chart when payout-modes endpoint returns 404', (done) => {
    service.getInfoChartByPayoutMode('solo').subscribe((rows) => {
      expect(rows).toEqual([{ label: '2026-01-01T00:00:00Z', data: 42, payoutMode: 'solo' }]);
      done();
    });

    const payoutReq = httpMock.expectOne('http://localhost:3334/api/info/chart/payout-modes?payoutMode=solo');
    payoutReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const fallbackReq = httpMock.expectOne('http://localhost:3334/api/info/chart');
    fallbackReq.flush([{ label: '2026-01-01T00:00:00Z', data: 42 }]);
  });

  it('should return null when /api/info/accounting returns 404', (done) => {
    service.getAccounting('solo').subscribe((res) => {
      expect(res).toBeNull();
      done();
    });

    const req = httpMock.expectOne('http://localhost:3334/api/info/accounting?payoutMode=solo');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
