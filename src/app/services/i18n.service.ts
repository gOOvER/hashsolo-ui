import { Injectable } from '@angular/core';

export type UiLang = 'de' | 'en';

const STORAGE_KEY = 'hashsolo_lang';

const TRANSLATIONS: Record<UiLang, Record<string, string>> = {
  de: {
    heroTagline: 'Open-Source Bitcoin Solo-Pool',
    noFees: '0% FEE',
    feeUnder50: '0% FEE < 50 TH/s',
    feeAbove50: 'Ab 50 TH/s:',
    noSecondBest: 'Ohne Kompromisse.',
    connection: 'Verbindung',
    soloBadge: 'Solo',
    soloConnectionHint: 'Findet dein Miner einen Block, geht die Belohnung direkt an deine Bitcoin-Adresse.',
    minerUsername: 'Miner-Benutzername',
    usernameFormatHint: 'Format: <BTC-Adresse>.<Workername> (z. B. worker1, rig1, miner01)',
    quickSetup: 'Geräte-Setup',
    findMiners: 'Miner suchen',
    addressPlaceholder: 'Bitcoin-Adresse (bc1...)',
    myMiners: 'Meine Miner',
    soloMiningTitle: 'Solo-Mining',
    soloMiningDesc: 'Arbeit von Minern, die ihren eigenen Solo-Block finden.',
    ofDifficulty: 'der aktuellen Bitcoin-Difficulty',
    bestDifficulty: 'Beste Difficulty',
    noSoloWorkYet: 'Noch keine Solo-Arbeit',
    soloWork: 'Solo-Arbeit',
    inLastHour: 'in der letzten Stunde',
    recentWork: 'Letzte Arbeit',
    credited10m: 'Gutgeschrieben in den letzten 10m',
    expectedTimeToBlock: 'Erwartete Blockzeit',
    basedOn1h: 'Basierend auf 1h Solo-Hashrate',
    bitcoinNode: 'Bitcoin-Node',
    nodeSynced: 'Synchron',
    nodeSyncing: 'Synchronisiert',
    nodeOffline: 'Offline',
    nodeWaiting: 'Warte auf bitcoind-RPC-Verbindung… (Auto-Refresh 10s)',
    peers: 'Peers',
    nextBlock: 'Nächster Block',
    soloHashrate: 'Solo-Hashrate',
    soloHashrateSub: 'Solo-Mining-Hashrate. Laufzeit:',
    emptyChart: 'Noch kein Hashrate-Verlauf. Verbinde einen Miner oder warte auf den Node-Sync.',
    connectedMiners: 'Verbundene Miner',
    allMiners: 'Alle Miner',
    allMinersTitle: 'Angemeldete Miner',
    session: 'Session',
    lastSeen: 'Zuletzt aktiv',
    nmminerNote: 'Hinweis: Im Feld Wallet Address die reine BTC-Adresse ohne .worker eintragen (Hostname unter Network ist nur lokal). NMMiner unterstützt nur Stratum V1 (stratum+tcp://) – kein TLS/SV2.',
    supportTitle: 'HashSolo unterstützen',
    supportSubtitle: 'Unabhängiger Solo-Pool mit eigenem Bitcoin-Node. Spenden helfen beim Server- & Node-Betrieb:',
    supportMoreOptions: 'Weitere Spendenmöglichkeiten:',
    device: 'Gerät',
    working: 'Aktiv',
    hashrate: 'Hashrate',
    bestDiffCol: 'Beste Difficulty',
    openSourceLegend: '= Open-Source-Software & -Hardware',
    emptyMiners: 'Noch keine Miner verbunden. Verbinde deinen Miner mit',
    highScores: 'Bestenliste',
    rank: 'Rang',
    when: 'Wann',
    emptyHighScores: 'Noch keine Highscores erfasst.',
    foundBlocks: 'Gefundene Blöcke',
    height: 'Höhe',
    address: 'Adresse',
    worker: 'Worker',
    liveAutoRefresh: 'Live (15s)',
    paused: 'Pausiert',
    soloBlockChance: 'Solo-Block-Chance',
    workers: 'Worker',
    password: 'Passwort',
    autoRefresh: 'Auto-Refresh',
    blockHeight: 'Blockhöhe',
    currentBlockWeight: 'Aktuelles Block-Gewicht',
    networkDifficulty: 'Netzwerk-Difficulty',
    networkHashrate: 'Netzwerk-Hashrate',
    pplnsWork: 'PPLNS-Arbeit',
    last10m: 'letzte 10m',
    expectedPayout: 'Erwartete Auszahlung',
    expectedPayoutHint: '% falls der nächste PPLNS-Block gefunden wird',
    bestSubmittedDiffDesc: 'Beste übermittelte Difficulty für diese Adresse',
    workersGroupedDesc: 'Gruppiert nach Worker-Name, aufgeklappt nach aktiver Session.',
    name: 'Name',
    mode: 'Modus',
    sessionId: 'Session-ID',
    rejected: 'Abgelehnt',
    uptime: 'Laufzeit',
    addressHashrate: 'Adress-Hashrate',
    addressHashrateDesc: '10-Minuten-Hashrate aus gutgeschriebener Arbeit nach Auszahlungsmodus.',
    solo10m: 'Solo 10 Minuten',
    pplns10m: 'PPLNS 10 Minuten',
    filterWorkers: 'Worker / Gerät filtern…',
    sortHashrate: 'Hashrate ↓',
    sortBestDiff: 'Beste Diff ↓',
    sortName: 'Name A–Z',
    exportCsv: 'CSV Export'
  },
  en: {
    heroTagline: 'Open-Source Bitcoin Solo Pool',
    noFees: '0% FEE',
    feeUnder50: '0% FEE < 50 TH/s',
    feeAbove50: '≥ 50 TH/s:',
    noSecondBest: 'No second best.',
    connection: 'Connection',
    soloBadge: 'Solo',
    soloConnectionHint: 'If your miner finds a block, the reward goes to your Bitcoin address.',
    minerUsername: 'Miner Username',
    usernameFormatHint: 'Format: <BTC address>.<worker name> (e.g. worker1, rig1, miner01)',
    quickSetup: 'Quick Setup',
    findMiners: 'Find Your Miners',
    addressPlaceholder: 'Address (bc1...)',
    myMiners: 'My Miners',
    soloMiningTitle: 'Solo Mining',
    soloMiningDesc: 'Work from miners trying to find their own direct-payout block.',
    ofDifficulty: 'of current Bitcoin difficulty',
    bestDifficulty: 'Best Difficulty',
    noSoloWorkYet: 'No solo work yet',
    soloWork: 'Solo Work',
    inLastHour: 'in the last hour',
    recentWork: 'Recent Work',
    credited10m: 'Credited work in the last 10m',
    expectedTimeToBlock: 'Expected Time to Block',
    basedOn1h: 'Based on 1h solo hashrate',
    bitcoinNode: 'Bitcoin Node',
    nodeSynced: 'Synced',
    nodeSyncing: 'Syncing',
    nodeOffline: 'Offline',
    nodeWaiting: 'Waiting for bitcoind RPC connection… (auto-refresh 10s)',
    peers: 'peers',
    nextBlock: 'Next block',
    soloHashrate: 'Solo Hashrate',
    soloHashrateSub: 'Solo mining hashrate. Uptime:',
    emptyChart: 'No hashrate history yet. Connect a miner or wait for Bitcoin node sync to complete.',
    connectedMiners: 'Connected Miners',
    allMiners: 'All Miners',
    allMinersTitle: 'Connected Miner Sessions',
    session: 'Session',
    lastSeen: 'Last Seen',
    nmminerNote: 'Note: Enter your plain BTC address without .worker in Wallet Address (Hostname under Network is local only). NMMiner supports Stratum V1 (stratum+tcp://) only — no TLS or SV2.',
    supportTitle: 'Support HashSolo',
    supportSubtitle: 'Independent solo pool with its own Bitcoin node. Donations help cover server & node costs:',
    supportMoreOptions: 'More donation options:',
    device: 'Device',
    working: 'Working',
    hashrate: 'Hashrate',
    bestDiffCol: 'Best Difficulty',
    openSourceLegend: '= Open Source Software & Hardware',
    emptyMiners: 'No miners connected yet. Point your miner to',
    highScores: 'High Scores',
    rank: 'Rank',
    when: 'When',
    emptyHighScores: 'No high scores recorded yet.',
    foundBlocks: 'Found Blocks',
    height: 'Height',
    address: 'Address',
    worker: 'Worker',
    liveAutoRefresh: 'Live (15s)',
    paused: 'Paused',
    soloBlockChance: 'Solo Block Chance',
    workers: 'Workers',
    password: 'Password',
    autoRefresh: 'Auto-Refresh',
    blockHeight: 'Block Height',
    currentBlockWeight: 'Current block weight',
    networkDifficulty: 'Network Difficulty',
    networkHashrate: 'network hashrate',
    pplnsWork: 'PPLNS Work',
    last10m: 'last 10m',
    expectedPayout: 'Expected Payout',
    expectedPayoutHint: '% if the next PPLNS block is found',
    bestSubmittedDiffDesc: 'Best submitted difficulty for this address',
    workersGroupedDesc: 'Grouped by worker name, expanded by active session.',
    name: 'Name',
    mode: 'Mode',
    sessionId: 'Session ID',
    rejected: 'Rejected',
    uptime: 'Uptime',
    addressHashrate: 'Address Hashrate',
    addressHashrateDesc: '10-minute credited-work hashrate split by payout mode.',
    solo10m: 'Solo 10 Minute',
    pplns10m: 'PPLNS 10 Minute',
    filterWorkers: 'Filter worker / device…',
    sortHashrate: 'Hashrate ↓',
    sortBestDiff: 'Best Diff ↓',
    sortName: 'Name A–Z',
    exportCsv: 'Export CSV'
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
