import { Player, Response } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function VoteScreen({
  socket,
  responses,
  players,
  roomId,
  currentPlayer,
  setResponses,
  setPlayers,
  setRequestNextPhase,
}: {
  socket: Socket | null;
  responses: Response[];
  players: Player[];
  roomId: string;
  currentPlayer: Player | null;
  setResponses: Dispatch<SetStateAction<Response[]>>;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setRequestNextPhase: Dispatch<SetStateAction<number>>;
}) {
  const [voted, setVoted] = useState(false);

  const confirmVote = (voter: string, responseId: string) => {
    setResponses((responses) =>
      responses.map((response) => {
        if (response.playerId !== responseId) return response;
        return { ...response, voteIds: [...response.voteIds, voter] };
      })
    );
  };

  useEffect(() => {
    socket?.on("vote", (voter: string, responseId: string) => {
      confirmVote(voter, responseId);
      setPlayers((players) =>
        players.map((player) => {
          if (player.id === responseId) {
            return { ...player, score: player.score + 1 };
          }
          return player;
        })
      );
    });

    return () => {
      socket?.off("vote");
    };
  }, []);

  return (
    <>
      <div className="py-4 box-border w-4/5 lg:w-screen px-4 lg:h-screen grid gap-4 items-center justify-center place-items-center sm:grid-cols-2 grid-cols-1">
        {responses.map((response, i) => (
          <VoteCard
            key={i}
            socket={socket}
            response={response}
            players={players}
            currentPlayer={currentPlayer}
            roomId={roomId}
            confirmVote={confirmVote}
            voted={voted}
            setVoted={setVoted}
            setRequestNextPhase={setRequestNextPhase}
          />
        ))}
      </div>
    </>
  );
}

function VoteCard({
  socket,
  roomId,
  response,
  players,
  currentPlayer,
  confirmVote,
  voted,
  setVoted,
  setRequestNextPhase,
}: {
  socket: Socket | null;
  roomId: string;
  response: Response;
  players: Player[];
  currentPlayer: Player | null;
  confirmVote: (voter: string, responseId: string) => void;
  voted: boolean;
  setVoted: Dispatch<SetStateAction<boolean>>;
  setRequestNextPhase: Dispatch<SetStateAction<number>>;
}) {
  const [tiltAngle, setTiltAngle] = useState(0);
  const [player, setPlayer] = useState<Player | null>(null);

  const vote = () => {
    socket?.emit("vote", roomId, currentPlayer?.id, player?.id);
    socket?.emit("request-next-phase", roomId);
    setRequestNextPhase((requestNextPhase) => requestNextPhase + 1);
  };

  useEffect(() => {
    setTiltAngle(Math.floor(Math.random() * 3));
  }, []);

  useEffect(() => {
    setPlayer(players.find((player) => response.playerId === player.id) || null);
  }, [players]);

  return (
    <div
      className="relative lg:w-full w-4/5 lg:h-full aspect-[9/16] lg:aspect-auto bg-white rounded-md text-black flex flex-col cursor-pointer"
      style={{ transform: `rotate(${tiltAngle}deg)` }}
      onClick={() => {
        if (currentPlayer?.id !== player?.id && !voted) {
          setVoted(true);
          vote();
        }
      }}
    >
      {response?.voteIds?.map((voter, i) => (
        <div key={i} className="rounded-full h-8 w-8 aspect-square absolute top-2" style={{ background: `${players.find((player) => player.id === voter)?.color}`, right: `${6 + i * (32 + 6)}px` }} />
      ))}
      <p className="text-3xl font-bold px-2">{response.switchResponse}</p>
      <div className="flex items-center gap-2 p-4">
        <div className="rounded-full h-full aspect-square" style={{ background: `${player?.color}` }} />
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold line-clamp-1">{player?.name}</h2>
          <p className="text-2xl font-semibold line-clamp-2">{response.response}</p>
        </div>
      </div>
    </div>
  );
}
