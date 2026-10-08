export interface TournamentSummary {
    id: string | number;
    type: string;
    title: string;
    description: string;
    venue: string;
    tourStartsDate: string;
    tourEndDate: string;
    spots: string | number;
    entryFee: string | number;
}

export interface TournamentTeamEntry {
    id?: string;
    name: string;
    joined?: boolean;
}

export interface TournamentDetail extends TournamentSummary {
    lastRegistrationDate?: string;
    teams: TournamentTeamEntry[];
}
