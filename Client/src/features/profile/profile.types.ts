export interface PlayerStats {
    matches?: number;
    runs?: number;
    wickets?: number;
    catches?: number;
}

export interface ProfileTeam {
    id: string;
    name: string;
    description?: string;
}

export interface PlayerProfileData {
    bio?: string;
    skills?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    profilePhoto?: string;
    achievements?: string[];
    stats?: PlayerStats;
    teams?: ProfileTeam[];
}

export type StatsFieldKey = "statsMatches" | "statsRuns" | "statsWickets" | "statsCatches";

/**
 * Flat form state. The four stats* fields flatten the nested `stats` object on
 * the payload; PlayerProfile owns the flatten (on load) and unflatten (on save).
 * Number inputs hand back strings, so the stats fields hold either.
 */
export interface ProfileFormData {
    bio: string;
    skills: string;
    battingStyle: string;
    bowlingStyle: string;
    profilePhoto: string;
    achievements: string;
    statsMatches: string | number;
    statsRuns: string | number;
    statsWickets: string | number;
    statsCatches: string | number;
}
