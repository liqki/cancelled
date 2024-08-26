import { prompts } from "@/utils/gameTasks";
import { Player } from "@/utils/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function Game({ socket, players, currentPlayer }: { socket: Socket | null; players: Player[]; currentPlayer: Player | null }) {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [round, setRound] = useState(0);

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [round]);

  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="w-4/5 flex flex-col gap-4 justify-center items-center">
        <p className="text-xl font-semibold">{prompt}</p>
        <form
          className="flex gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
            }}
            placeholder="Enter your response"
            className="bg-transparent border-2 border-[#FFFFFF]/20 box-border p-3 rounded-full outline-none focus:border-[#FFFFFF]/60 flex-1"
          />
          <button className="rounded-full bg-white text-black aspect-square p-3 hover:scale-[1.01] transition-transform" type="submit">
            {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
