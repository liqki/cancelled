import { Player } from "@/utils/types";
import Heading from "../Heading";
import { Dispatch, SetStateAction } from "react";

export default function ResultScreen({ players, round, currentPlayer, setRound }: { players: Player[]; round: number; currentPlayer: Player | null; setRound: Dispatch<SetStateAction<number>> }) {
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  return (
    <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
      <Heading />
      <section className="w-4/5 max-w-96">
        <h2 className="text-2xl font-bold text-center">Results for Round {round}</h2>
        <ul className="flex flex-col gap-2 mt-4 max-h-80 overflow-y-scroll no-scrollbar">
          {sortedPlayers.map((player) => (
            <li key={player.id} style={{ background: player.color }} className={`flex justify-between items-center p-3 rounded-full border-2 border-[#FFFFFF]/20`}>
              <span className="text-outline">
                {player.name} - {player.score} Points
              </span>
              {player.host && (
                // <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <svg className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                </svg>
              )}
            </li>
          ))}
        </ul>
        <button
          className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform w-full mt-4"
          disabled={!currentPlayer?.host}
          onClick={() => {
            setRound((round) => round + 1);
          }}
        >
          {currentPlayer?.host ? "Start another Round" : "Waiting for Host"}
        </button>
      </section>
    </div>
  );
}
