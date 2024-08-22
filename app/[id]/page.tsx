"use client";

import { Player } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [state, setState] = useState<"waiting" | "playing" | "finished">("waiting");
  const [socketId, setSocketId] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.id;
  const socket = io({ autoConnect: searchParams.has("name") });

  const addPlayer = (player: Player) => {
    setPlayers((players) => [...players, player]);
  };

  const removePlayer = (id: string) => {
    setPlayers((players) => players.filter((player) => player.id !== id));
  };

  useEffect(() => {
    // if (!searchParams.get("name")) router.push(`/join?roomId=${roomId}`);

    socket.once("connect", () => {
      if (socket.id) setSocketId(socket.id);
      if (searchParams.get("host") === "true") {
        socket.emit("create-room", roomId, searchParams.get("name"));
      } else {
        socket.emit("join-room", roomId, searchParams.get("name"));
      }
    });

    socket.on("player-joined", (player: Player) => {
      addPlayer(player);
      if (players.length >= 10 || state !== "waiting") {
        socket.emit("join-error", { message: "Room is full or game has started", id: player.id });
        return;
      }
      if (currentPlayer?.host) {
        socket.emit("initial-data", { players, state, id: player.id });
      }
    });

    socket.on("player-left", (id: string) => {
      const wasHost = players.find((player) => player.id === id)?.host;
      removePlayer(id);
      if (wasHost && players.length > 0) {
        socket.emit("new-host", { id: players[0].id, roomId });
      }
    });

    socket.on("new-host", (id: string) => {
      setPlayers((players) => players.map((player) => ({ ...player, host: player.id === id })));
    });

    socket.on("initial-data", ({ players, state }) => {
      setPlayers(players);
      setState(state);
    });

    socket.on("error", (error: string) => {
      router.push(`/?error=${error}`);
    });

    return () => {
      socket.off("connect");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("new-host");
      socket.off("initial-data");
      socket.off("error");
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  useEffect(() => {
    if (socketId && players.length > 0 && !currentPlayer) {
      setCurrentPlayer(players.find((player) => player.id === socketId) || null);
    }
  }, [players, socketId]);

  return (
    <div>
      <h1>Game Room</h1>
      <p>Room ID: {roomId}</p>
      <p>Host: {String(players.find((player) => player.id === socketId)?.host)}</p>
      <p>Name: {players.find((player) => player.id === socketId)?.name}</p>
      <p>State: {state}</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <p className={`text-${player.color}-500`}>
              {player.name} - {player.score}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
