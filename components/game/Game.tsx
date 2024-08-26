import { prompts } from "@/utils/gameTasks";
import { Player, Response } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GamePrompt from "./GamePrompt";
import VoteScreen from "./VoteScreen";

export default function Game({
  socket,
  roomId,
  players,
  currentPlayer,
  setPlayers,
}: {
  socket: Socket | null;
  roomId: string;
  players: Player[];
  currentPlayer: Player | null;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
}) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [prompt, setPrompt] = useState("");
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"game" | "switch" | "vote" | "result">("game");
  const [requestNextPhase, setRequestNextPhase] = useState(0);

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
      setPhase("switch");
      setPrompt(response?.response);
    });

    socket?.on("vote-phase", (responses: Response[]) => {
      setResponses(responses);
      setPhase("vote");
    });

    socket?.on("request-next-phase", () => {
      setRequestNextPhase((requestNextPhase) => requestNextPhase + 1);
    });

    return () => {
      socket?.off("new-response");
      socket?.off("response-assigned");
      socket?.off("vote-phase");
      socket?.off("request-next-phase");
    };
  }, []);

  useEffect(() => {
    console.log(responses);
  }, [responses]);

  useEffect(() => {
    if (requestNextPhase >= players.length) {
      nextPhase();
      setRequestNextPhase(0);
    }
  }, [requestNextPhase]);

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
        <VoteScreen socket={socket} roomId={roomId} responses={responses} players={players} currentPlayer={currentPlayer} setResponses={setResponses} setPlayers={setPlayers} />
      ) : phase === "switch" ? (
        <GamePrompt id={currentPlayer?.id!} socket={socket} roomId={roomId} prompt={prompt} setResponses={setResponses} setRequestNextPhase={setRequestNextPhase} type="switch" />
      ) : (
        <GamePrompt id={currentPlayer?.id!} socket={socket} roomId={roomId} prompt={prompt} setResponses={setResponses} setRequestNextPhase={setRequestNextPhase} type="game" />
      )}
    </main>
  );
}
