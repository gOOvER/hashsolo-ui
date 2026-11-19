import { Injectable } from '@angular/core';

export type UiLang = 'de' | 'en';

const STORAGE_KEY = 'hashsolo_lang';

const TRANSLATIONS: Record<UiLang, Record<string, string>> = {
  de: {
    connection: 'Verbindung',
    findMiners: 'Miner suchen',
    myMiners: 'Meine Miner',
    connectedMiners: 'Verbundene Miner',
    highScores: 'Bestenliste',
    foundBlocks: 'Gefundene Blöcke',
    soloHashrate: 'Solo-Hashrate',
    quickSetup: 'Geräte-Setup',
    liveAutoRefresh: 'Live (15s)',
    paused: 'Pausiert',
    soloBlockChance: 'Solo-Block-Chance',
    workers: 'Worker',
    address: 'Adresse'
  },
  en: {
    connection: 'Connection',
    findMiners: 'Find Your Miners',
    myMiners: 'My Miners',
    connectedMiners: 'Connected Miners',
    highScores: 'High Scores',
    foundBlocks: 'Found Blocks',
    soloHashrate: 'Solo Hashrate',
    quickSetup: 'Quick Setup',
    liveAutoRefresh: 'Live (15s)',
    paused: 'Paused',
    soloBlockChance: 'Solo Block Chance',
    workers: 'Workers',
    address: 'Address'
  }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private _lang: UiLang;

  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'de' || saved === 'en') {
      this._lang = saved;
    } else {
      const browserLang = typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() : '';
      this._lang = browserLang.startsWith('de') ? 'de' : 'en';
    }
  }

  public get lang(): UiLang {
    return this._lang;
  }

  public setLang(lang: UiLang): void {
    this._lang = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  public t(key: string): string {
    return TRANSLATIONS[this._lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }
}
