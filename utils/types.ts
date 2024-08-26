export type Player = {
  id: string;
  host: boolean;
  name: string;
  score: number;
  color: string;
};

export type Response = {
  playerId: string;
  response: string;
};
