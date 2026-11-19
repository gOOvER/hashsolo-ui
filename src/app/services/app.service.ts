import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { AppConfigService } from './app-config.service';

export type PayoutMode = 'solo' | 'pplns';

export interface NodeStatus {
    reachable: boolean;
    ready: boolean;
    chain: string | null;
    blocks: number;
    headers: number;
    verificationProgress: number;
    initialBlockDownload: boolean;
    pruned: boolean;
    sizeOnDisk: number;
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfigService
    ) { }

    public getInfo() {
        return this.httpClient.get(`${this.appConfig.apiUrl}/api/info`) as Observable<any>;
    }
    public getNetworkInfo() {
        return this.httpClient.get(`${this.appConfig.apiUrl}/api/network`) as Observable<any>;
    }
    public getNodeStatus(): Observable<NodeStatus | null> {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/node/status`) as Observable<NodeStatus>).pipe(
            catchError(() => of(null))
        );
    }
    public getInfoChart() {
        return this.httpClient.get(`${this.appConfig.apiUrl}/api/info/chart`) as Observable<any>;
    }
    public getInfoChartByPayoutMode(payoutMode?: PayoutMode | 'all') {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/info/chart/payout-modes${this.toPayoutModeQuery(payoutMode)}`) as Observable<any[]>).pipe(
            catchError(() =>
                (this.getInfoChart() as Observable<any[]>).pipe(
                    map((rows) => (rows ?? []).map((row) => ({ ...row, payoutMode: row?.payoutMode ?? 'solo' }))),
                    catchError(() => of([]))
                )
            )
        );
    }
    public getAccounting(payoutMode?: PayoutMode | 'all') {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/info/accounting${this.toPayoutModeQuery(payoutMode)}`) as Observable<any>).pipe(
            catchError(() => of(null))
        );
    }

    private toPayoutModeQuery(payoutMode?: PayoutMode | 'all'): string {
        return payoutMode == null ? '' : `?payoutMode=${encodeURIComponent(payoutMode)}`;
    }
}
