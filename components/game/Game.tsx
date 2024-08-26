import { prompts } from "@/utils/gameTasks";
import { Player, Response } from "@/utils/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GamePrompt from "./GamePrompt";
import SwitchPrompt from "./SwitchPrompt";

export default function Game({ socket, roomId, players, currentPlayer }: { socket: Socket | null; roomId: string; players: Player[]; currentPlayer: Player | null }) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [prompt, setPrompt] = useState("");
  const [round, setRound] = useState(1);
  const [switchPhase, setSwitchPhase] = useState(false);
  const [votingPhase, setVotingPhase] = useState(false);

  useEffect(() => {
    socket?.on("new-response", (response: Response) => {
      setResponses((responses) => [...responses, response]);
    });

    socket?.on("response-assigned", (response: Response) => {
      console.log(response);
      setPrompt(response.response);
    });

    return () => {
      socket?.off("new-response");
      socket?.off("response-assigned");
    };
  }, []);

  useEffect(() => {
    if (responses.length === players.length) {
      setSwitchPhase(true);
      if (currentPlayer?.host) socket?.emit("switch-phase", roomId, responses);
    }
  }, [responses]);

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [round]);

  return (
    <main className="w-screen h-screen grid place-items-center">
      {switchPhase ? <SwitchPrompt prompt={prompt} /> : <GamePrompt id={currentPlayer?.id!} socket={socket} roomId={roomId} prompt={prompt} setResponses={setResponses} />}
    </main>
  );
}
