import { prompts } from "@/utils/gameTasks";
import { Player, Response } from "@/utils/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GamePrompt from "./GamePrompt";

export default function Game({ socket, roomId, players, currentPlayer }: { socket: Socket | null; roomId: string; players: Player[]; currentPlayer: Player | null }) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [prompt, setPrompt] = useState("");
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"game" | "switch" | "vote" | "result">("game");

  const insertOrUpdateResponse = (response: Response) => {
    setResponses((responses) => {
      const responseIndex = responses.findIndex((item) => item.playerId === response.playerId);

      if (responseIndex !== -1) {
        return responses.map((item, index) => (index === responseIndex ? response : item));
      } else {
        return [...responses, response];
      }
    });
  };

  const nextPhase = () => {
    if (phase === "game") {
      setPhase("switch");
    } else if (phase === "switch") {
      setPhase("vote");
    } else if (phase === "vote") {
      setPhase("result");
    } else if (phase === "result") {
      setPhase("game");
      setRound((round) => round + 1);
    }
  };

  useEffect(() => {
    socket?.on("new-response", (response: Response) => {
      insertOrUpdateResponse(response);
    });

    socket?.on("response-assigned", (response: Response) => {
      setPrompt(response?.response);
    });

    return () => {
      socket?.off("new-response");
      socket?.off("response-assigned");
    };
  }, []);

  useEffect(() => {
    if (phase === "game" && responses.length === players.length) {
      nextPhase();
    }

    if (phase === "switch" && responses.map((item) => item.switchResponse !== "").length === players.length) {
      console.log("switch phase done");
      nextPhase();
    }
  }, [responses]);

  useEffect(() => {
    if (!currentPlayer?.host) return;
    switch (phase) {
      case "switch":
        socket?.emit("switch-phase", roomId, responses);
        break;
      case "vote":
        socket?.emit("vote-phase", roomId, responses);
        break;
      case "result":
        socket?.emit("result-phase", roomId, responses);
        break;
    }
  }, [phase]);

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [round]);

  return (
    <main className="w-screen h-screen grid place-items-center">
      {phase === "vote" ? (
        <div>Voting</div>
      ) : phase === "switch" ? (
        <GamePrompt id={currentPlayer?.id!} socket={socket} roomId={roomId} prompt={prompt} setResponses={setResponses} type="switch" />
      ) : (
        <GamePrompt id={currentPlayer?.id!} socket={socket} roomId={roomId} prompt={prompt} setResponses={setResponses} type="game" />
      )}
    </main>
  );
}
