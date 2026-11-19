import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

interface RuntimeConfig {
  API_URL?: string;
  STRATUM_URL?: string;
  SECURE_STRATUM_URL?: string;
  STRATUM_V2_URL?: string;
  PPLNS_STRATUM_URL?: string;
  PPLNS_SECURE_STRATUM_URL?: string;
  PPLNS_STRATUM_V2_URL?: string;
  PPLNS_DATUM_URL?: string;
  DONATION_BTC_ADDRESS?: string;
  DONATION_URL?: string;
  DONATION_LINK_LABEL?: string;
  DONATION_TITLE?: string;
  DONATION_SUBTITLE?: string;
}

declare global {
  interface Window {
    __PUBLIC_POOL_CONFIG__?: RuntimeConfig;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public get apiUrl(): string {
    if (this.hasRuntimeValue('API_URL')) {
      return this.normalizeBaseUrl(window.__PUBLIC_POOL_CONFIG__?.API_URL);
    }

    return this.normalizeBaseUrl(environment.API_URL);
  }

  public get stratumUrl(): string {
    if (this.hasRuntimeValue('STRATUM_URL')) {
      return this.resolveStratumUrl(window.__PUBLIC_POOL_CONFIG__?.STRATUM_URL);
    }

    return this.resolveStratumUrl(environment.STRATUM_URL);
  }

  public get secureStratumUrl(): string {
    if (this.hasRuntimeValue('SECURE_STRATUM_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.SECURE_STRATUM_URL);
    }

    return this.resolveOptionalUrl(environment.SECURE_STRATUM_URL);
  }

  public get stratumV2Url(): string {
    if (this.hasRuntimeValue('STRATUM_V2_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.STRATUM_V2_URL);
    }

    return this.resolveOptionalUrl(environment.STRATUM_V2_URL);
  }

  public get pplnsStratumUrl(): string {
    if (this.hasRuntimeValue('PPLNS_STRATUM_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.PPLNS_STRATUM_URL);
    }

    return this.resolveOptionalUrl(environment.PPLNS_STRATUM_URL);
  }

  public get pplnsSecureStratumUrl(): string {
    if (this.hasRuntimeValue('PPLNS_SECURE_STRATUM_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.PPLNS_SECURE_STRATUM_URL);
    }

    return this.resolveOptionalUrl(environment.PPLNS_SECURE_STRATUM_URL);
  }

  public get pplnsStratumV2Url(): string {
    if (this.hasRuntimeValue('PPLNS_STRATUM_V2_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.PPLNS_STRATUM_V2_URL);
    }

    return this.resolveOptionalUrl(environment.PPLNS_STRATUM_V2_URL);
  }

  public get pplnsDatumUrl(): string {
    if (this.hasRuntimeValue('PPLNS_DATUM_URL')) {
      return this.resolveOptionalUrl(window.__PUBLIC_POOL_CONFIG__?.PPLNS_DATUM_URL);
    }

    return this.resolveOptionalUrl(environment.PPLNS_DATUM_URL);
  }

  public get donationBtcAddress(): string {
    return this.resolveFooterSetting('DONATION_BTC_ADDRESS', 'bc1qt6wec64n3gnrhclp4vfckyvr8h27tmqswy28gc');
  }

  public get donationUrl(): string {
    return this.resolveFooterSetting('DONATION_URL', 'https://donate.goover.dev');
  }

  public get donationLinkLabel(): string {
    const custom = this.resolveFooterSetting('DONATION_LINK_LABEL', '');
    if (custom) {
      return custom;
    }
    const url = this.donationUrl;
    if (!url) {
      return '';
    }
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  public get donationTitle(): string {
    return this.resolveFooterSetting('DONATION_TITLE', '');
  }

  public get donationSubtitle(): string {
    return this.resolveFooterSetting('DONATION_SUBTITLE', '');
  }

  private resolveFooterSetting(key: keyof RuntimeConfig, fallback: string): string {
    const raw = window.__PUBLIC_POOL_CONFIG__?.[key]?.trim();
    if (!raw) {
      return fallback;
    }
    const lower = raw.toLowerCase();
    if (lower === 'none' || lower === 'off' || lower === 'false') {
      return '';
    }
    return raw;
  }

  private hasRuntimeValue(key: keyof RuntimeConfig): boolean {
    return typeof window !== 'undefined'
      && !!window.__PUBLIC_POOL_CONFIG__
      && Object.prototype.hasOwnProperty.call(window.__PUBLIC_POOL_CONFIG__, key);
  }

  private normalizeBaseUrl(value: string | undefined): string {
    return (value ?? '').trim().replace(/\/+$/, '');
  }

  private resolveStratumUrl(value: string | undefined): string {
    const configured = (value ?? '').trim();
    if (configured.length > 0) {
      return configured;
    }

    if (typeof window === 'undefined') {
      return 'localhost:3333';
    }

    return `${window.location.hostname}:3333`;
  }

  private resolveOptionalUrl(value: string | undefined): string {
    return (value ?? '').trim();
  }
}
