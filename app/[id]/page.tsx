"use client";

import { Player } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const playersRef = useRef<Player[]>([]);
  const [state, setState] = useState<"waiting" | "playing" | "finished">("waiting");
  const stateRef = useRef<"waiting" | "playing" | "finished">("waiting");
  const [socketId, setSocketId] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const currentPlayerRef = useRef<Player | null>(null);
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
      if (playersRef.current.length >= 10 || state !== "waiting") {
        socket.emit("join-error", { message: "Room is full or game has started", id: player.id });
        return;
      }
      if (currentPlayerRef.current?.host) {
        socket.emit("initial-data", { players: [...playersRef.current, player], state, id: player.id });
      }
    });

    socket.on("player-left", (id: string) => {
      const wasHost = playersRef.current.find((player) => player.id === id)?.host;
      removePlayer(id);
      if (wasHost && playersRef.current.length > 1) {
        socket.emit("new-host", { id: playersRef.current.find((player) => player.id !== id)?.id, roomId });
      }
    });

    // TODO: Not working when only 2 players
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
    if (socketId && players.length > 0) {
      setCurrentPlayer(players.find((player) => player.id === socketId) || null);
    }
  }, [players, socketId]);

  useEffect(() => {
    if (currentPlayer) currentPlayerRef.current = currentPlayer;
    if (players) playersRef.current = players;
    if (state) stateRef.current = state;
  }, [currentPlayer, players, state]);

  return (
    <div>
      <h1>Game Room</h1>
      <p>Room ID: {roomId}</p>
      <p>Host: {String(currentPlayer?.host)}</p>
      <p>Name: {currentPlayer?.name}</p>
      <p>ID: {currentPlayer?.id}</p>
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
