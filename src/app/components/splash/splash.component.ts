import { ChangeDetectorRef, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { catchError, combineLatest, forkJoin, map, Observable, of, shareReplay, switchMap, timer } from 'rxjs';

import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { AppService, ConnectedMiner, NextBlockReward, NodeStatus } from '../../services/app.service';
import { AppConfigService } from '../../services/app-config.service';
import { I18nService } from '../../services/i18n.service';
import { bitcoinAddressValidator } from '../../validators/bitcoin-address.validator';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';


@Component({
  standalone: false,
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent {

  public address: FormControl;

  public chartData$: Observable<any>;
  public blockData$: Observable<any>;
  public userAgents$: Observable<any>;
  public highScores$: Observable<any>;
  public uptime$: Observable<string>;
  public fee$: Observable<number | null>;
  public sv2$: Observable<any>;
  public accounting$: Observable<any>;
  public accountingByPayoutMode$: Observable<{ pplns: any; solo: any; }>;
  public networkInfo$: Observable<any>;
  public nodeStatus$: Observable<NodeStatus | null>;
  public nextBlockReward$: Observable<NextBlockReward | null>;

  public chartOptions: any;
  public chartScale: 'linear' | 'logarithmic' = 'logarithmic';
  public copiedLabel: string | null = null;
  public get donationBtcAddress(): string {
    return this.appConfig.donationBtcAddress;
  }
  public get donationUrl(): string {
    return this.appConfig.donationUrl;
  }
  public get donationLinkLabel(): string {
    return this.appConfig.donationLinkLabel;
  }
  public get donationTitle(): string {
    return this.appConfig.donationTitle || this.i18n.t('supportTitle');
  }
  public get donationSubtitle(): string {
    return this.appConfig.donationSubtitle || this.i18n.t('supportSubtitle');
  }
  public quickSetupOpen = false;
  public quickSetupDevice: 'standard' | 'nmminer' | 'asic' = 'standard';
  public minersModalOpen = false;
  public connectedMiners$: Observable<ConnectedMiner[]> | null = null;

  public openMinersModal(): void {
    this.minersModalOpen = true;
    this.connectedMiners$ = timer(0, 15000).pipe(
      switchMap(() => this.appService.getConnectedMiners())
    );
  }

  public get stratumHost(): string {
    const idx = this.stratumURL.lastIndexOf(':');
    return idx > 0 ? this.stratumURL.slice(0, idx) : this.stratumURL;
  }

  public get stratumPort(): string {
    const idx = this.stratumURL.lastIndexOf(':');
    return idx > 0 ? this.stratumURL.slice(idx + 1) : '3333';
  }

  public get tabWorkerName(): string {
    switch (this.quickSetupDevice) {
      case 'nmminer': return 'nmminer1';
      case 'asic': return 'asic01';
      default: return 'esp01';
    }
  }

  public get minerUsernamePreview(): string {
    const fallbackAddr = this.i18n.lang === 'de' ? 'bc1q...deineadresse' : 'bc1q...youraddress';
    const addr = this.address?.valid && this.address.value?.trim()
      ? this.address.value.trim()
      : fallbackAddr;
    return `${addr}.${this.tabWorkerName}`;
  }

  public get nmminerAddressPreview(): string {
    const fallbackAddr = this.i18n.lang === 'de' ? 'bc1q...deineadresse' : 'bc1q...youraddress';
    return this.address?.valid && this.address.value?.trim()
      ? this.address.value.trim()
      : fallbackAddr;
  }

  public stratumURL = '';
  public secureStratumURL = '';
  public stratumV2URL = '';
  public pplnsStratumURL = '';
  public pplnsSecureStratumURL = '';
  public pplnsStratumV2URL = '';
  public pplnsDatumURL = '';
  public pplnsEnabled = false;

  private info$: Observable<any>;

  private networkInfo: any;
  private copiedTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private appService: AppService,
    private appConfig: AppConfigService,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService
  ) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const primaryColor = documentStyle.getPropertyValue('--primary-color');
    const soloColor = documentStyle.getPropertyValue('--yellow-600') || '#d97706';

    this.info$ = timer(0, 15000).pipe(
      switchMap(() => this.appService.getInfo().pipe(catchError(() => of({})))),
      takeUntilDestroyed(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.stratumURL = this.appConfig.stratumUrl;
    this.secureStratumURL = this.appConfig.secureStratumUrl;
    this.stratumV2URL = this.appConfig.stratumV2Url;
    this.pplnsStratumURL = this.appConfig.pplnsStratumUrl;
    this.pplnsSecureStratumURL = this.appConfig.pplnsSecureStratumUrl;
    this.pplnsStratumV2URL = this.appConfig.pplnsStratumV2Url;
    this.pplnsDatumURL = this.appConfig.pplnsDatumUrl;
    this.pplnsEnabled = this.hasPplnsConnections();

    this.blockData$ = this.info$.pipe(map(info => info?.blockData ?? []));
    this.userAgents$ = this.info$.pipe(map(info => info?.userAgents ?? []));
    this.highScores$ = this.info$.pipe(map(info => info?.highScores ?? []));
    this.sv2$ = this.info$.pipe(map(info => info?.sv2));
    this.uptime$ = this.info$.pipe(map(info => info?.uptime ?? null));
    this.fee$ = this.info$.pipe(map(info => typeof info?.fee === 'number' ? info.fee : null));
    this.accounting$ = timer(0, 15000).pipe(
      switchMap(() => this.appService.getAccounting().pipe(catchError(() => of(null)))),
      takeUntilDestroyed(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    const emptyAccounting = {
      bestSubmissionDifficulty: 0,
      bestSubmissionDifficultyAt: null,
      totalCreditedDifficulty: 0,
      creditedDifficultyLastHour: 0,
      creditedDifficultyLast10Minutes: 0,
      hashRateLast10Minutes: 0,
      hashRateLastHour: 0,
      networkDifficultyPercent: 0
    };
    this.accountingByPayoutMode$ = timer(0, 15000).pipe(
      switchMap(() => forkJoin({
        pplns: this.pplnsEnabled ? this.appService.getAccounting('pplns').pipe(map(v => v ?? emptyAccounting), catchError(() => of(emptyAccounting))) : of(emptyAccounting),
        solo: this.appService.getAccounting('solo').pipe(map(v => v ?? emptyAccounting), catchError(() => of(emptyAccounting)))
      })),
      takeUntilDestroyed(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.networkInfo$ = this.appService.getNetworkInfo().pipe(
      catchError(() => of(null)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.nodeStatus$ = timer(0, 10000).pipe(
      switchMap(() => this.appService.getNodeStatus()),
      takeUntilDestroyed(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.nextBlockReward$ = this.appService.getNextBlockReward().pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.chartData$ = combineLatest([
      this.appService.getInfoChartByPayoutMode(this.pplnsEnabled ? 'all' : 'solo').pipe(catchError(() => of([]))),
      this.networkInfo$
    ]).pipe(
      map(([chartData, networkInfo]) => {
        this.networkInfo = networkInfo;
        const pplnsColor = primaryColor;
        const modes: Record<string, { label: string; borderColor: string; backgroundColor: any; }> = {
          solo: {
            label: 'Solo Hashrate',
            borderColor: soloColor,
            backgroundColor: (context: any) => this.getChartGradient(context, soloColor)
          }
        };

        if (this.pplnsEnabled) {
          modes['pplns'] = {
            label: 'PPLNS Hashrate',
            borderColor: pplnsColor,
            backgroundColor: (context: any) => this.getChartGradient(context, pplnsColor)
          };
        }

        const datasets = this.toPayoutModeDatasets(chartData, modes);

        return {
          labels: [...new Set(chartData.map((d: any) => d.label))],
          datasets
        }
      })
    );

    this.address = new FormControl(null, bitcoinAddressValidator());

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
            unit: 'day', // Set the unit to 'minute'
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
          position: 'left',
          display: this.pplnsEnabled,
          min: 1,
          title: {
            display: this.pplnsEnabled,
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
          position: this.pplnsEnabled ? 'right' : 'left',
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
            drawOnChartArea: !this.pplnsEnabled
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

  private toChartPoint(point: any) {
    return {
      x: point.label,
      y: Number(point.data),
      creditedWork: point.shares,
      payoutMode: point.payoutMode
    };
  }

  private toPayoutModeDatasets(chartData: any[], modes: Record<string, { label: string; borderColor: string; backgroundColor: any; }>) {
    return Object.entries(modes)
      .map(([mode, config]) => {
        const rows = chartData.filter(point => point.payoutMode === mode);

        return {
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

  public formatPayoutMode(mode: string | null | undefined): string {
    return mode === 'pplns' ? 'PPLNS' : 'Solo';
  }

  public hasPplnsConnections(): boolean {
    return [
      this.pplnsStratumURL,
      this.pplnsSecureStratumURL,
      this.pplnsStratumV2URL,
      this.pplnsDatumURL
    ].some(value => value.length > 0);
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

  public getNetworkDifficultyProgress(accounting: any): number {
    const percent = Number(accounting?.networkDifficultyPercent ?? 0);
    if (!Number.isFinite(percent) || percent <= 0) {
      return 0;
    }
    return Math.min(percent, 100);
  }

  public copyText(value: string, label: string) {
    const complete = () => {
      this.copiedLabel = label;
      if (this.copiedTimeout != null) {
        clearTimeout(this.copiedTimeout);
      }
      this.copiedTimeout = setTimeout(() => {
        this.copiedLabel = null;
        this.copiedTimeout = null;
      }, 1500);
    };

    if (window.navigator?.clipboard != null) {
      void window.navigator.clipboard.writeText(value).then(complete, () => this.copyTextFallback(value, complete));
      return;
    }

    this.copyTextFallback(value, complete);
  }

  private copyTextFallback(value: string, complete: () => void) {
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', 'true');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand('copy');
      complete();
    } finally {
      document.body.removeChild(input);
    }
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
