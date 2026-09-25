/**
 * Capco Monitor — Pro / premium panel registry.
 *
 * Edit this file to change which dashboard panels require Pro.
 * Keep WEB_PREMIUM_PANEL_KEYS ⊇ API_KEY_PREMIUM_PANEL_KEYS (guarded by
 * tests/panel-config-guardrails.test.mjs).
 *
 * Local unlock (no Pro subscription needed):
 *   VITE_CAPCO_UNLOCK_PRO=1  in .env.local, then restart `npm run dev:finance`
 */

export interface PremiumPanelDef {
  /** Panel id (matches settings / layout keys). */
  key: string;
  /** Human label for settings / docs. */
  label: string;
  /**
   * If true, a World Monitor / Capco API key OR Pro unlocks the panel.
   * If false, the panel is still in WEB_PREMIUM_PANELS (layout lock CTA)
   * but may need a Clerk Pro account specifically (see clerkProOnly).
   */
  apiKeyEntitled: boolean;
  /** Requires a signed-in Clerk Pro user (API key alone is not enough). */
  clerkProOnly?: boolean;
  /** Short note for the Settings highlight. */
  note?: string;
}

/**
 * Canonical Pro panel catalog. Add/remove/edit here.
 */
export const PREMIUM_PANEL_CATALOG: readonly PremiumPanelDef[] = [
  {
    key: 'stock-analysis',
    label: 'Premium Stock Analysis',
    apiKeyEntitled: true,
    note: 'Technicals + AI synthesis',
  },
  {
    key: 'stock-backtest',
    label: 'Premium Backtesting',
    apiKeyEntitled: true,
    note: 'Signal backtests',
  },
  {
    key: 'daily-market-brief',
    label: 'Daily Market Brief',
    apiKeyEntitled: true,
    note: 'AI daily markets brief',
  },
  {
    key: 'market-implications',
    label: 'AI Market Implications',
    apiKeyEntitled: true,
    note: 'News → market impact AI',
  },
  {
    key: 'deduction',
    label: 'Deduct Situation',
    apiKeyEntitled: true,
    note: 'Interactive AI forecast',
  },
  {
    key: 'chat-analyst',
    label: 'WM Analyst',
    apiKeyEntitled: true,
    note: 'Chat analyst',
  },
  {
    key: 'wsb-ticker-scanner',
    label: 'WSB Ticker Scanner',
    apiKeyEntitled: true,
    note: 'Reddit WSB scanner',
  },
  {
    key: 'latest-brief',
    label: 'Latest Brief',
    apiKeyEntitled: false,
    clerkProOnly: true,
    note: 'Personal daily brief (Clerk Pro only)',
  },
  {
    key: 'regional-intelligence',
    label: 'Regional Intelligence',
    apiKeyEntitled: true,
    note: 'Regional intel board',
  },
  {
    key: 'trade-policy',
    label: 'Trade Policy',
    apiKeyEntitled: true,
    note: 'WTO / trade policy',
  },
  {
    key: 'global-procurement',
    label: 'Global Procurement',
    apiKeyEntitled: true,
    note: 'Procurement intelligence',
  },
] as const;

/** Layout gate: every panel that shows Sign In / Upgrade CTA on web. */
export const WEB_PREMIUM_PANEL_KEYS: readonly string[] = PREMIUM_PANEL_CATALOG.map((p) => p.key);

/** Settings entitlement: unlocked by API key OR Pro. */
export const API_KEY_PREMIUM_PANEL_KEYS: readonly string[] = PREMIUM_PANEL_CATALOG
  .filter((p) => p.apiKeyEntitled)
  .map((p) => p.key);

/** Needs Clerk Pro account specifically (not API-key alone). */
export const CLERK_PRO_ONLY_PANEL_KEYS: readonly string[] = PREMIUM_PANEL_CATALOG
  .filter((p) => p.clerkProOnly)
  .map((p) => p.key);

export const PREMIUM_PANEL_BY_KEY: ReadonlyMap<string, PremiumPanelDef> = new Map(
  PREMIUM_PANEL_CATALOG.map((p) => [p.key, p]),
);

export function isWebPremiumPanel(key: string): boolean {
  return PREMIUM_PANEL_BY_KEY.has(key);
}

export function isApiKeyPremiumPanel(key: string): boolean {
  return PREMIUM_PANEL_BY_KEY.get(key)?.apiKeyEntitled === true;
}

export function isClerkProOnlyPanel(key: string): boolean {
  return PREMIUM_PANEL_BY_KEY.get(key)?.clerkProOnly === true;
}

/** Capco local fork: unlock all Pro panels without a subscription. */
export function isCapcoProUnlocked(): boolean {
  try {
    return import.meta.env.VITE_CAPCO_UNLOCK_PRO === '1'
      || import.meta.env.VITE_CAPCO_UNLOCK_PRO === 'true';
  } catch {
    return false;
  }
}
