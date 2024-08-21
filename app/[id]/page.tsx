"use client";

import { RoomData } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.id;
  const socket = io({ autoConnect: searchParams.has("name") });

  useEffect(() => {
    if (!searchParams.get("name")) router.push(`/join?roomId=${roomId}`);

    socket.on("connect", () => {
      if (searchParams.get("host") === "true") {
        socket.emit("create-room", roomId, searchParams.get("name"));
        router.replace(`/${roomId}`);
      } else {
        socket.emit("join-room", roomId, searchParams.get("name"));
        router.replace(`/${roomId}`);
      }
    });

    socket.on("room-update", (roomData: RoomData) => {
      setRoomData(roomData);
    });

    socket.on("error", (error: string) => {
      router.push(`/?error=${error}`);
    });

    return () => {
      socket.off("connect");
      socket.off("room-update");
      socket.off("error");
      socket.off("disconnect");
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  useEffect(() => {
    console.log(roomData);
  }, [roomData]);

  return (
    <div>
      <h1>Game Room</h1>
      <p>Room ID: {roomId}</p>
      <p>Host: {roomData?.players.find((player) => player.id === socket.id)?.host}</p>
      <p>Name: {roomData?.players.find((player) => player.id === socket.id)?.name}</p>
      <p>State: {roomData?.state}</p>
      <ul>
        {roomData?.players.map((player) => (
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
