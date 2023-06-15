export interface iUser {
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  confirmPassword: string;
  predict: any[];
  token: string;
  OTP: string;
  verified: boolean;
}

export interface iMatch {
  startPlay: boolean;
  stopPlay: boolean;
  teamA: string;
  teamB: string;
  teamBOdds: number;
  Odds: number;
  teamAScore: number;
  teamBScore: number;
  dateTime: string;
  scoreEntry: string;
  predict: any[];
}

export interface Ipredict {
  teamA: string;
  teamB: string;
  teamAScore: number;
  teamBScore: number;
  dateTime: string;
  amount: number;
  prize: number;
  scoreEntry: string;
  user: {};
}
