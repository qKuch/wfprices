export interface Mod {
  name: string
  slug: string
  category: string
  maxRank: number
  rarity?: string
}

export const MOD_CATEGORIES = [
  'Warframe',
  'Primary',
  'Secondary',
  'Melee',
  'Companion',
  'Archwing',
  'Corrupted',
  'Nightmare',
  'Aura',
  'Stance',
  'Archon',
] as const

export const MODS: Mod[] = [
  // ── Warframe ─────────────────────────────────────────────
  { name: 'Primed Flow',              slug: 'primed_flow',              category: 'Warframe',  maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Continuity',        slug: 'primed_continuity',        category: 'Warframe',  maxRank: 10, rarity: 'Legendary' },
  { name: 'Adaptation',               slug: 'adaptation',               category: 'Warframe',  maxRank: 10, rarity: 'Rare'      },
  { name: 'Rolling Guard',            slug: 'rolling_guard',            category: 'Warframe',  maxRank: 10, rarity: 'Rare'      },
  { name: 'Blind Rage',               slug: 'blind_rage',               category: 'Warframe',  maxRank: 10, rarity: 'Rare'      },
  { name: 'Fleeting Expertise',       slug: 'fleeting_expertise',       category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },
  { name: 'Narrow Minded',            slug: 'narrow_minded',            category: 'Warframe',  maxRank: 10, rarity: 'Rare'      },
  { name: 'Overextended',             slug: 'overextended',             category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },
  { name: 'Transient Fortitude',      slug: 'transient_fortitude',      category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },
  { name: 'Constitution',             slug: 'constitution',             category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },
  { name: 'Natural Talent',           slug: 'natural_talent',           category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },
  { name: 'Augur Secrets',            slug: 'augur_secrets',            category: 'Warframe',  maxRank: 5,  rarity: 'Rare'      },

  // ── Primary ───────────────────────────────────────────────
  { name: 'Primed Bane of Grineer',   slug: 'primed_bane_of_grineer',   category: 'Primary',   maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Bane of Corpus',    slug: 'primed_bane_of_corpus',    category: 'Primary',   maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Bane of Infested',  slug: 'primed_bane_of_infested',  category: 'Primary',   maxRank: 10, rarity: 'Legendary' },
  { name: 'Vigilante Armaments',      slug: 'vigilante_armaments',      category: 'Primary',   maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Hunter Munitions',         slug: 'hunter_munitions',         category: 'Primary',   maxRank: 3,  rarity: 'Rare'      },
  { name: 'Galvanized Aptitude',      slug: 'galvanized_aptitude',      category: 'Primary',   maxRank: 10, rarity: 'Rare'      },
  { name: 'Galvanized Chamber',       slug: 'galvanized_chamber',       category: 'Primary',   maxRank: 5,  rarity: 'Rare'      },
  { name: 'Galvanized Scope',         slug: 'galvanized_scope',         category: 'Primary',   maxRank: 10, rarity: 'Rare'      },
  { name: 'Merciless',                slug: 'primary_merciless',        category: 'Primary',   maxRank: 10, rarity: 'Rare'      },
  { name: 'Deadhead',                 slug: 'primary_deadhead',         category: 'Primary',   maxRank: 10, rarity: 'Rare'      },
  { name: 'Dexterity',                slug: 'primary_dexterity',        category: 'Primary',   maxRank: 10, rarity: 'Rare'      },

  // ── Secondary ─────────────────────────────────────────────
  { name: 'Primed Heated Charge',     slug: 'primed_heated_charge',     category: 'Secondary', maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Pistol Gambit',     slug: 'primed_pistol_gambit',     category: 'Secondary', maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Target Cracker',    slug: 'primed_target_cracker',    category: 'Secondary', maxRank: 10, rarity: 'Legendary' },
  { name: 'Galvanized Diffusion',     slug: 'galvanized_diffusion',     category: 'Secondary', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Galvanized Crosshairs',    slug: 'galvanized_crosshairs',    category: 'Secondary', maxRank: 10, rarity: 'Rare'      },
  { name: 'Galvanized Shot',          slug: 'galvanized_shot',          category: 'Secondary', maxRank: 10, rarity: 'Rare'      },
  { name: 'Merciless',                slug: 'secondary_merciless',      category: 'Secondary', maxRank: 10, rarity: 'Rare'      },
  { name: 'Deadhead',                 slug: 'secondary_deadhead',       category: 'Secondary', maxRank: 10, rarity: 'Rare'      },
  { name: 'Dexterity',                slug: 'secondary_dexterity',      category: 'Secondary', maxRank: 10, rarity: 'Rare'      },
  { name: 'Magnum Force',             slug: 'magnum_force',             category: 'Secondary', maxRank: 5,  rarity: 'Rare'      },

  // ── Melee ─────────────────────────────────────────────────
  { name: 'Primed Pressure Point',    slug: 'primed_pressure_point',    category: 'Melee',     maxRank: 10, rarity: 'Legendary' },
  { name: 'Primed Fever Strike',      slug: 'primed_fever_strike',      category: 'Melee',     maxRank: 10, rarity: 'Legendary' },
  { name: 'Blood Rush',               slug: 'blood_rush',               category: 'Melee',     maxRank: 5,  rarity: 'Rare'      },
  { name: 'Weeping Wounds',           slug: 'weeping_wounds',           category: 'Melee',     maxRank: 5,  rarity: 'Rare'      },
  { name: 'Condition Overload',       slug: 'condition_overload',       category: 'Melee',     maxRank: 5,  rarity: 'Rare'      },
  { name: 'Gladiator Might',          slug: 'gladiator_might',          category: 'Melee',     maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Berserker Fury',           slug: 'berserker_fury',           category: 'Melee',     maxRank: 5,  rarity: 'Rare'      },
  { name: 'Merciless',                slug: 'melee_merciless',          category: 'Melee',     maxRank: 10, rarity: 'Rare'      },
  { name: 'Deadhead',                 slug: 'melee_deadhead',           category: 'Melee',     maxRank: 10, rarity: 'Rare'      },

  // ── Companion ─────────────────────────────────────────────
  { name: 'Primed Pack Leader',       slug: 'primed_pack_leader',       category: 'Companion', maxRank: 10, rarity: 'Legendary' },
  { name: 'Fetch',                    slug: 'fetch',                    category: 'Companion', maxRank: 3,  rarity: 'Rare'      },
  { name: 'Vacuum',                   slug: 'vacuum',                   category: 'Companion', maxRank: 3,  rarity: 'Rare'      },
  { name: 'Animal Instinct',          slug: 'animal_instinct',          category: 'Companion', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Mecha Empowered',          slug: 'mecha_empowered',          category: 'Companion', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Synth Deconstruct',        slug: 'synth_deconstruct',        category: 'Companion', maxRank: 3,  rarity: 'Rare'      },
  { name: 'Link Armor',               slug: 'link_armor',               category: 'Companion', maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Tek Enhance',              slug: 'tek_enhance',              category: 'Companion', maxRank: 5,  rarity: 'Rare'      },

  // ── Corrupted ─────────────────────────────────────────────
  { name: 'Blind Rage',               slug: 'blind_rage',               category: 'Corrupted', maxRank: 10, rarity: 'Rare'      },
  { name: 'Fleeting Expertise',       slug: 'fleeting_expertise',       category: 'Corrupted', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Narrow Minded',            slug: 'narrow_minded',            category: 'Corrupted', maxRank: 10, rarity: 'Rare'      },
  { name: 'Overextended',             slug: 'overextended',             category: 'Corrupted', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Transient Fortitude',      slug: 'transient_fortitude',      category: 'Corrupted', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Heavy Caliber',            slug: 'heavy_caliber',            category: 'Corrupted', maxRank: 10, rarity: 'Rare'      },
  { name: 'Vicious Spread',           slug: 'vicious_spread',           category: 'Corrupted', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Tainted Mag',              slug: 'tainted_mag',              category: 'Corrupted', maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Tainted Shell',            slug: 'tainted_shell',            category: 'Corrupted', maxRank: 3,  rarity: 'Uncommon'  },
  { name: 'Critical Delay',           slug: 'critical_delay',           category: 'Corrupted', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Anemic Agility',           slug: 'anemic_agility',           category: 'Corrupted', maxRank: 5,  rarity: 'Uncommon'  },

  // ── Nightmare ─────────────────────────────────────────────
  { name: 'Blaze',                    slug: 'blaze',                    category: 'Nightmare', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Shred',                    slug: 'shred',                    category: 'Nightmare', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Focus Energy',             slug: 'focus_energy',             category: 'Nightmare', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Lethal Torrent',           slug: 'lethal_torrent',           category: 'Nightmare', maxRank: 5,  rarity: 'Rare'      },
  { name: 'Stunning Speed',           slug: 'stunning_speed',           category: 'Nightmare', maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Life Strike',              slug: 'life_strike',              category: 'Nightmare', maxRank: 3,  rarity: 'Rare'      },
  { name: 'Accelerated Blast',        slug: 'accelerated_blast',        category: 'Nightmare', maxRank: 5,  rarity: 'Uncommon'  },

  // ── Aura ──────────────────────────────────────────────────
  { name: 'Steel Charge',             slug: 'steel_charge',             category: 'Aura',      maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Corrosive Projection',     slug: 'corrosive_projection',     category: 'Aura',      maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Energy Siphon',            slug: 'energy_siphon',            category: 'Aura',      maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Growing Power',            slug: 'growing_power',            category: 'Aura',      maxRank: 3,  rarity: 'Rare'      },
  { name: 'Rifle Amp',                slug: 'rifle_amp',                category: 'Aura',      maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Dead Eye',                 slug: 'dead_eye',                 category: 'Aura',      maxRank: 5,  rarity: 'Uncommon'  },
  { name: 'Combat Discipline',        slug: 'combat_discipline',        category: 'Aura',      maxRank: 5,  rarity: 'Rare'      },

  // ── Stance ────────────────────────────────────────────────
  { name: 'Blind Justice',            slug: 'blind_justice',            category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Tempo Royale',             slug: 'tempo_royale',             category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Sovereign Outcast',        slug: 'sovereign_outcast',        category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Gemini Cross',             slug: 'gemini_cross',             category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Eleventh Storm',           slug: 'eleventh_storm',           category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Crushing Ruin',            slug: 'crushing_ruin',            category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },
  { name: 'Shimmering Blight',        slug: 'shimmering_blight',        category: 'Stance',    maxRank: 3,  rarity: 'Rare'      },

  // ── Archon ────────────────────────────────────────────────
  { name: 'Archon Continuity',        slug: 'archon_continuity',        category: 'Archon',    maxRank: 5,  rarity: 'Rare'      },
  { name: 'Archon Intensify',         slug: 'archon_intensify',         category: 'Archon',    maxRank: 5,  rarity: 'Rare'      },
  { name: 'Archon Stretch',           slug: 'archon_stretch',           category: 'Archon',    maxRank: 5,  rarity: 'Rare'      },
  { name: 'Archon Vitality',          slug: 'archon_vitality',          category: 'Archon',    maxRank: 5,  rarity: 'Rare'      },
  { name: 'Archon Flow',              slug: 'archon_flow',              category: 'Archon',    maxRank: 5,  rarity: 'Rare'      },
]
