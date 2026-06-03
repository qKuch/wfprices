// ── Event Configuration ──────────────────────────────────────────────────
// Când vine un eveniment nou, modifică doar acest fișier.

export const EVENT = {
  // Numele evenimentului (apare în UI)
  name: 'Operation: Belly of the Beast',

  // Data de sfârșit a evenimentului (UTC)
  endDate: new Date('2026-06-01T23:59:59Z'),

  // Numărul de copii necesare pentru un R5 complet
  copiesForR5: 21,

  // Numele monedei evenimentului (pentru calculator)
  currency: 'Volatile Motes',

  // Tierurile care fac parte din eveniment (pentru filtre)
  tiers: ['Legendary', 'Rare', 'Uncommon', 'Common', 'Ascension', 'Special'] as string[],

  // Numele monedei per tier (dacă diferă)
  tierCurrency: (tier: string) => tier === 'Ascension' ? 'Vestigial Motes' : 'Volatile Motes',
} as const
