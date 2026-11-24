import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, filter, forkJoin, map, Observable, of, shareReplay, switchMap, tap, timer } from 'rxjs';

import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { AppService } from '../../services/app.service';
import { ClientService } from '../../services/client.service';
import { I18nService } from '../../services/i18n.service';
import { AppConfigService } from '../../services/app-config.service';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';



@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  public address: string;

  public clientInfo$: Observable<any>;
  public clientInfoByPayoutMode$: Observable<{ pplns: any; solo: any; }>;
  public chartData$: Observable<any>;

  public chartOptions: any;
  public chartScale: 'linear' | 'logarithmic' = 'logarithmic';

  public networkInfo$: Observable<any>;
  private networkInfo: any;
  public autoRefresh = true;
  public pplnsEnabled = false;
  public workerSearch = '';
  public workerSort: 'hashrate' | 'bestDiff' | 'name' = 'hashrate';
  private refreshTrigger$ = new BehaviorSubject<number>(0);

  @ViewChild('dataTable') dataTable!: Table;

  public expandedRowKeys: Record<string, boolean> = {};



  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private appService: AppService,
    private appConfig: AppConfigService,
    public i18n: I18nService
  ) {
    this.pplnsEnabled = Boolean(
      this.appConfig.pplnsStratumUrl ||
      this.appConfig.pplnsSecureStratumUrl ||
      this.appConfig.pplnsStratumV2Url ||
      this.appConfig.pplnsDatumUrl
    );
    timer(15000, 15000).pipe(filter(() => this.autoRefresh), takeUntilDestroyed()).subscribe(() => this.refreshTrigger$.next(this.refreshTrigger$.value + 1));
    this.appService.connectLiveStream().pipe(filter(() => this.autoRefresh), takeUntilDestroyed()).subscribe(() => this.refreshTrigger$.next(this.refreshTrigger$.value + 1));

    this.networkInfo$ = this.refreshTrigger$.pipe(switchMap(() => this.appService.getNetworkInfo().pipe(catchError(() => of(null)))), shareReplay({ refCount: true, bufferSize: 1 }));

    this.address = this.route.snapshot.params['address'];
    const address$ = this.route.paramMap.pipe(
      map(params => params.get('address') ?? ''),
      distinctUntilChanged(),
      tap(address => { this.address = address; }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.clientInfo$ = combineLatest([address$, this.refreshTrigger$]).pipe(
      switchMap(([address]) => this.clientService.getClientInfo(address).pipe(catchError(() => of(null)))),
      tap((info: any) => {
        for (const worker of info?.workers ?? []) {
          if (worker?.name && !(worker.name in this.expandedRowKeys)) {
            this.expandedRowKeys[worker.name] = true;
          }
        }
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.clientInfoByPayoutMode$ = combineLatest([address$, this.refreshTrigger$]).pipe(
      switchMap(([address]) => forkJoin({
        pplns: this.clientService.getClientInfo(address, 'pplns').pipe(catchError(() => of(null))),
        solo: this.clientService.getClientInfo(address, 'solo').pipe(catchError(() => of(null)))
      })),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const primaryColor = documentStyle.getPropertyValue('--primary-color');
    const soloColor = documentStyle.getPropertyValue('--yellow-600') || '#d97706';


    this.chartData$ = combineLatest([
      combineLatest([address$, this.refreshTrigger$]).pipe(switchMap(([address]) => this.clientService.getClientInfoChartByPayoutMode(address, 'all'))),
      this.networkInfo$
    ]).pipe(
      map(([chartData, networkInfo]) => {

        this.networkInfo = networkInfo;
        const datasets = this.toPayoutModeDatasets(chartData, {
          pplns: {
            label: this.i18n.t('pplns10m'),
            borderColor: primaryColor,
            backgroundColor: (context: any) => this.getChartGradient(context, primaryColor)
          },
          solo: {
            label: this.i18n.t('solo10m'),
            borderColor: soloColor,
            backgroundColor: (context: any) => this.getChartGradient(context, soloColor)
          }
        });

        return {
          labels: chartData.map((d: any) => d.label),
          datasets
        }
      })
    );



    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => this.getTooltipLabel(context),
            afterLabel: (context: any) => this.getTooltipDetails(context)
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour', // Set the unit to 'minute'
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            display: true
          }
        },
        yPplns: {
          type: this.chartScale,
          display: this.pplnsEnabled,
          position: 'left',
          min: 1,
          title: {
            display: true,
            text: 'PPLNS',
            color: primaryColor
          },
          ticks: {
            color: primaryColor,
            maxTicksLimit: 8,
            callback: (value: number) => {
              return value <= 0 ? '0 H/s' : HashSuffixPipe.transform(value);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          beginAtZero: false
        },
        ySolo: {
          type: this.chartScale,
          position: 'right',
          min: 1,
          title: {
            display: true,
            text: 'Solo',
            color: soloColor
          },
          ticks: {
            color: soloColor,
            maxTicksLimit: 8,
            callback: (value: number) => {
              return value <= 0 ? '0 H/s' : HashSuffixPipe.transform(value);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            drawOnChartArea: false
          },
          beginAtZero: false
        }
      }
    };

  }

  public setChartScale(scale: 'linear' | 'logarithmic'): void {
    if (this.chartScale === scale) {
      return;
    }
    this.chartScale = scale;
    const isLog = scale === 'logarithmic';
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        ...this.chartOptions.scales,
        yPplns: {
          ...this.chartOptions.scales.yPplns,
          type: scale,
          min: isLog ? 1 : undefined,
          beginAtZero: !isLog
        },
        ySolo: {
          ...this.chartOptions.scales.ySolo,
          type: scale,
          min: isLog ? 1 : undefined,
          beginAtZero: !isLog
        }
      }
    };
  }



  public toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.refreshTrigger$.next(this.refreshTrigger$.value + 1);
    }
  }

  public getFilteredWorkers(workers: any[]): any[] {
    const list = Array.isArray(workers) ? [...workers] : [];
    const query = this.workerSearch.trim().toLowerCase();
    const filtered = query
      ? list.filter((w) =>
          String(w?.name ?? '').toLowerCase().includes(query) ||
          String(w?.userAgent ?? '').toLowerCase().includes(query) ||
          String(w?.sessionId ?? '').toLowerCase().includes(query)
        )
      : list;

    return filtered.sort((a, b) => {
      if (this.workerSort === 'name') {
        return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
      }
      if (this.workerSort === 'bestDiff') {
        return (Number(b?.bestDifficulty) || 0) - (Number(a?.bestDifficulty) || 0);
      }
      return (Number(b?.hashRate) || 0) - (Number(a?.hashRate) || 0);
    });
  }

  public exportWorkersCsv(workers: any[]): void {
    const rows = this.getFilteredWorkers(workers);
    const headers = ['name', 'sessionId', 'userAgent', 'hashRate', 'bestDifficulty', 'rejectedLowDiff', 'rejectedStaleJob', 'rejectedDuplicate', 'startTime', 'lastSeen'];
    const escapeCell = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...rows.map((w) => headers.map((key) => escapeCell(w?.[key])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hashsolo-workers-${this.address || 'export'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  public getClientTotalHashRate(clientInfo: any): number {
    return (clientInfo?.workers ?? []).reduce((acc: number, w: any) => acc + (Number(w?.hashRate) || 0), 0);
  }

  public getSoloBlockChance(clientInfo: any, networkInfo: any): { oddsText: string; yearlyPercent: string } {
    const hashRate = this.getClientTotalHashRate(clientInfo);
    const difficulty = Number(networkInfo?.difficulty) || 0;
    const isDe = this.i18n.lang === 'de';
    if (hashRate <= 0 || difficulty <= 0) {
      return { oddsText: '—', yearlyPercent: isDe ? '0,0000 % pro Jahr' : '0.0000% / year' };
    }
    const secondsPerBlock = (difficulty * Math.pow(2, 32)) / hashRate;
    const daysPerBlock = secondsPerBlock / 86400;
    const yearlyProb = 1 - Math.exp(-(365 * 86400) / secondsPerBlock);
    const locale = isDe ? 'de-DE' : 'en-US';
    const oddsText = daysPerBlock >= 365
      ? (isDe
          ? `1 Block / ${Math.round(daysPerBlock / 365).toLocaleString(locale)} Jahre`
          : `1 block / ${Math.round(daysPerBlock / 365).toLocaleString(locale)} yr`)
      : (isDe
          ? `1 Block / ${Math.round(daysPerBlock).toLocaleString(locale)} Tage`
          : `1 block / ${Math.round(daysPerBlock).toLocaleString(locale)} d`);
    const pct = (yearlyProb * 100).toFixed(4);
    return {
      oddsText,
      yearlyPercent: isDe ? `${pct.replace('.', ',')} % pro Jahr` : `${pct}% / year`
    };
  }

  ngAfterViewInit() {

  }

  public getSessionCount(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    return workersByName.length;
  }

  public getTotalHashRate(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    const sum = workersByName.reduce((pre, cur, idx, arr) => {
      return pre += Math.floor(cur.hashRate);
    }, 0);
    return Math.floor(sum);
  }

  public getBestDifficulty(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    const best = workersByName.reduce((pre, cur, idx, arr) => {
      if (cur.bestDifficulty > pre) {
        return cur.bestDifficulty;
      }
      return pre;
    }, 0);

    return best;
  }

  public getTotalUptime(name: string, workers: any[]) {
    const now = new Date().getTime();
    const workersByName = workers.filter(w => w.name == name);
    const sum = workersByName.reduce((pre, cur, idx, arr) => {
      return pre += now - new Date(cur.startTime).getTime();
    }, 0);
    return new Date(now - sum);
  }

  private toChartPoint(point: any) {
    return {
      y: Number(point.data),
      x: point.label,
      creditedWork: point.shares,
      payoutMode: point.payoutMode
    };
  }

  private toPayoutModeDatasets(chartData: any[], modes: Record<string, { label: string; borderColor: string; backgroundColor: any; }>) {
    return Object.entries(modes)
      .map(([mode, config]) => {
        const rows = chartData.filter(point => point.payoutMode === mode);

        return {
          type: 'line',
          label: config.label,
          data: rows.map((d: any) => this.toChartPoint(d)),
          yAxisID: mode === 'solo' ? 'ySolo' : 'yPplns',
          fill: true,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          tension: .4,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        };
      })
      .filter(dataset => dataset.data.length > 0);
  }

  public getTotalRejected(name: string, workers: any[]): number {
    return (workers ?? [])
      .filter(w => w.name == name)
      .reduce((pre, cur) => pre + (cur.rejectedLowDiff || 0) + (cur.rejectedStaleJob || 0) + (cur.rejectedDuplicate || 0), 0);
  }

  public getGroupStartTime(name: string, workers: any[]): string | null {
    const times = (workers ?? [])
      .filter(w => w.name === name && w.startTime)
      .map(w => new Date(w.startTime).getTime())
      .filter(t => !Number.isNaN(t));
    return times.length ? new Date(Math.min(...times)).toISOString() : null;
  }

  public getGroupLastSeen(name: string, workers: any[]): string | null {
    const times = (workers ?? [])
      .filter(w => w.name === name && w.lastSeen)
      .map(w => new Date(w.lastSeen).getTime())
      .filter(t => !Number.isNaN(t));
    return times.length ? new Date(Math.max(...times)).toISOString() : null;
  }

  public getWorkerPayoutModes(name: string, workers: any[]): string[] {
    const modes = workers
      .filter(worker => worker.name === name)
      .map(worker => worker.payoutMode)
      .filter(mode => mode != null);
    return [...new Set(modes)];
  }

  public formatPayoutMode(mode: string | null | undefined): string {
    return mode === 'pplns' ? 'PPLNS' : 'Solo';
  }

  public getPayoutModeClass(mode: string | null | undefined): string {
    return mode === 'pplns' ? 'mode-badge mode-badge-pplns' : 'mode-badge mode-badge-solo';
  }

  private getTooltipLabel(context: any) {
    return `${context.dataset.label}: ${HashSuffixPipe.transform(context.parsed.y)}`;
  }

  private getTooltipDetails(context: any) {
    const raw = context.raw || {};
    const lines = [];
    if (raw.creditedWork !== undefined) {
      lines.push(`Credited work: ${Number(raw.creditedWork).toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }

    if (this.networkInfo?.difficulty && context.parsed.y > 0) {
      lines.push(`Average time to block: ${AverageTimeToBlockPipe.transform(context.parsed.y, this.networkInfo.difficulty)}`);
    }

    return lines;
  }

  private getChartGradient(context: any, color: string) {
    const chart = context.chart;
    const chartArea = chart.chartArea;

    if (chartArea == null) {
      return this.toRgba(color, 0.2);
    }

    const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, this.toRgba(color, 0.32));
    gradient.addColorStop(0.65, this.toRgba(color, 0.09));
    gradient.addColorStop(1, this.toRgba(color, 0));
    return gradient;
  }

  private toRgba(color: string, alpha: number): string {
    const trimmed = color.trim();
    const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex != null) {
      const value = hex[1].length === 3
        ? hex[1].split('').map(part => part + part).join('')
        : hex[1];
      const red = parseInt(value.slice(0, 2), 16);
      const green = parseInt(value.slice(2, 4), 16);
      const blue = parseInt(value.slice(4, 6), 16);
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    const rgb = trimmed.match(/^rgba?\(([^)]+)\)$/i);
    if (rgb != null) {
      const parts = rgb[1].split(',').map(part => part.trim()).slice(0, 3);
      return `rgba(${parts.join(', ')}, ${alpha})`;
    }

    return trimmed || `rgba(99, 102, 241, ${alpha})`;
  }
}
