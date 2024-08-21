"use client";

import { RoomData } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function GameRoom({ params }: { params: { id: string } }) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = params.id;

  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      if (searchParams.get("host") === "true") {
        socket.emit("create-room", roomId, searchParams.get("name"));
      } else {
        socket.emit("join-room", roomId);
      }
    });

    socket.on("room-update", (roomData: RoomData) => {
      setRoomData(roomData);
    });

    socket.on("error", (error: string) => {
      router.push(`/?error=${error}`);
    });

    socket.on("disconnect", () => {
      socket.emit("leave-room", roomId);
    });

    window.addEventListener("beforeunload", () => {
      socket.disconnect();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(roomData);
  }, [roomData]);

  return <div>{}</div>;
}
