"use client";

import Countdown from "@/components/Countdown";
import Game from "@/components/game/Game";
import Lobby from "@/components/game/Lobby";
import { UserContext } from "@/context/UserContext";
import { useSocket } from "@/hooks/useSocket";
import { useStateRef } from "@/hooks/useStateRef";
import { Player } from "@/utils/types";
import { useContext, useEffect, useState } from "react";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [players, setPlayers, playersRef] = useStateRef<Player[]>([]);
  const [state, setState, stateRef] = useStateRef<"waiting" | "playing" | "finished">("waiting");
  const [currentPlayer, setCurrentPlayer, currentPlayerRef] = useStateRef<Player | null>(null);

  const [showCountdown, setShowCountdown] = useState(false);

  const roomId = params.id;
  const { socket } = useSocket(roomId);

  const { id } = useContext(UserContext);

  const addPlayer = (player: Player) => {
    setPlayers((players) => [...players, player]);
  };

  const removePlayer = (id: string) => {
    setPlayers((players) => players.filter((player) => player.id !== id));
  };

  const kickPlayer = (id: string) => {
    socket?.emit("player-kicked", roomId, id);
    removePlayer(id);
  };

  const startGame = () => {
    socket?.emit("start-game", roomId);
    setState("playing");
  };

  const stopCountdown = () => {
    setShowCountdown(false);
  };

  useEffect(() => {
    socket?.on("player-joined", (player: Player) => {
      addPlayer(player);
      if (playersRef.current.length >= 10 || state !== "waiting") {
        socket.emit("join-error", { message: "Room is full or game has started", id: player.id });
        return;
      }
      if (currentPlayerRef.current?.host) {
        socket.emit("initial-data", { players: [...playersRef.current, player], state, id: player.id });
      }
    });

    socket?.on("player-left", (id: string) => {
      const wasHost = playersRef.current.find((player) => player.id === id)?.host;
      if (wasHost && playersRef.current.length > 1) {
        if (playersRef.current.length === 2) {
          setPlayers((players) => players.map((player) => ({ ...player, host: player.id === currentPlayerRef.current?.id })));
          removePlayer(id);
          return;
        }
        socket.emit("new-host", { id: playersRef.current.find((player) => player.id !== id)?.id, roomId });
      }
      removePlayer(id);
    });

    socket?.on("new-host", (id: string) => {
      setPlayers((players) => players.map((player) => ({ ...player, host: player.id === id })));
    });

    socket?.on("initial-data", ({ players, state }) => {
      setPlayers(players);
      setState(state);
    });

    socket?.on("start-game", () => {
      setState("playing");
    });

    return () => {
      socket?.off("player-joined");
      socket?.off("player-left");
      socket?.off("new-host");
      socket?.off("initial-data");
      socket?.off("start-game");
    };
  }, [socket]);

  useEffect(() => {
    if (id && players.length > 0) {
      setCurrentPlayer(players.find((player) => player.id === id) || null);
    }
  }, [players, id]);

  useEffect(() => {
    if (currentPlayer) currentPlayerRef.current = currentPlayer;
    if (players) playersRef.current = players;
    if (state) stateRef.current = state;
  }, [currentPlayer, players, state]);

  useEffect(() => {
    if (state !== "waiting") setShowCountdown(true);
  }, [state]);

  return (
    <>
      {showCountdown ? (
        <Countdown stopCountdown={stopCountdown} />
      ) : state === "waiting" ? (
        <Lobby players={players} currentPlayer={currentPlayer} kickPlayer={kickPlayer} startGame={startGame} />
      ) : state === "playing" ? (
        <Game socket={socket} players={players} currentPlayer={currentPlayer} />
      ) : (
        <div>Ended</div>
      )}
    </>
  );
}
