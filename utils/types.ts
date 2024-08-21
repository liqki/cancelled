type Player = {
  id: string;
  host: boolean;
  name: string;
  score: number;
  color: string;
};

export type RoomData = {
  players: Player[];
  state: "waiting" | "playing" | "finished";
};
