"use client";

import { socket } from "@/utils/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GameRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("host") === "true") {
      if (!socket.connected) socket.connect();
      socket.emit("create-room", params.id);
    } else {
      if (!socket.connected) socket.connect();
      socket.emit("join-room", params.id);
    }

    socket.on("error", (error: string) => {
      router.push(`/?error=${error}`);
    });
  }, []);

  return <div>{}</div>;
}
