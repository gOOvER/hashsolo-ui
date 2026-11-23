import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, timeout } from 'rxjs';

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
    connections?: number | null;
}

export interface NextBlockReward {
    rewardSats: number;
    subsidySats: number;
    feeSats: number;
    height: number;
}

export interface ConnectedMiner {
    address: string;
    worker: string;
    sessionId: string;
    userAgent: string;
    hashRate: number;
    bestDifficulty: number;
    startTime: string;
    lastSeen: string;
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

    public connectLiveStream(): Observable<{ type: string; data: any }> {
        return new Observable((subscriber) => {
            if (typeof EventSource === 'undefined') {
                subscriber.complete();
                return;
            }
            const source = new EventSource(`${this.appConfig.apiUrl}/api/stream`);
            const onEvent = (type: string) => (event: MessageEvent) => {
                try {
                    subscriber.next({ type, data: JSON.parse(event.data) });
                } catch {
                    // ignore malformed SSE payloads
                }
            };
            const onBestDiff = onEvent('best_diff');
            const onBlock = onEvent('block');
            source.addEventListener('best_diff', onBestDiff as EventListener);
            source.addEventListener('block', onBlock as EventListener);
            source.onerror = () => {
                // Keep polling fallback active; EventSource reconnects automatically
            };
            return () => {
                source.removeEventListener('best_diff', onBestDiff as EventListener);
                source.removeEventListener('block', onBlock as EventListener);
                source.close();
            };
        });
    }
    public getConnectedMiners(): Observable<ConnectedMiner[]> {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/info/miners`) as Observable<ConnectedMiner[]>).pipe(
            timeout(4000),
            catchError(() => of([]))
        );
    }
    public getNetworkInfo() {
        return this.httpClient.get(`${this.appConfig.apiUrl}/api/network`) as Observable<any>;
    }
    public getNodeStatus(): Observable<NodeStatus | null> {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/node/status`) as Observable<NodeStatus>).pipe(
            timeout(4000),
            catchError(() => of(null))
        );
    }
    public getNextBlockReward(): Observable<NextBlockReward | null> {
        return (this.httpClient.get(`${this.appConfig.apiUrl}/api/info/next-block-reward`) as Observable<NextBlockReward>).pipe(
            timeout(4000),
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
