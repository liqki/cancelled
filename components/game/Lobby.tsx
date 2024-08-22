import { Player } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import Heading from "../Heading";

export default function Lobby({ players, setPlayers, currentPlayer }: { players: Player[]; setPlayers: Dispatch<SetStateAction<Player[]>>; currentPlayer: Player | null }) {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
      <Heading />
      <section className="w-4/5 max-w-96">
        <h2 className="text-2xl font-bold text-center">Players</h2>
        <ul className="flex flex-col gap-2 mt-4 max-h-80 overflow-y-scroll no-scrollbar">
          {players.map((player) => (
            <li key={player.id} style={{ background: "#120949" }} className={`flex justify-between items-center p-3 rounded-full border-2 border-[#FFFFFF]/20`}>
              <span>{player.name}</span>
              {player.host && <span className="text-xs bg-white text-black p-1 rounded-full">Host</span>}
            </li>
          ))}
        </ul>
        {currentPlayer?.host ? (
          <div className="flex gap-2">
            <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform w-full mt-4">Start Game</button>
            <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform w-full mt-4">Share this Link</button>
          </div>
        ) : (
          <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform w-full mt-4">Share this Link</button>
        )}
      </section>
    </div>
  );
}
