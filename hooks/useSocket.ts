import { UserContext } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const { setId, color } = useContext(UserContext);

  useEffect(() => {
    if (!socket) setSocket(io({ autoConnect: searchParams.has("name") }));

    socket?.once("connect", () => {
      if (socket.id) setId(socket.id);
      if (searchParams.get("host") === "true") {
        socket.emit("create-room", roomId, searchParams.get("name"), color);
      } else {
        socket.emit("join-room", roomId, searchParams.get("name"), color);
      }
      window.history.replaceState(null, "", `/${roomId}`);
    });

    socket?.on("error", (error: string) => {
      router.replace(`/?error=${error}`);
    });

    socket?.on("kicked", () => {
      router.replace("/?error=You were kicked from the room");
    });

    window.addEventListener("beforeunload", () => {
      router.replace("/?error=Disconnected from the room");
    });

    return () => {
      socket?.off("connect");
      socket?.off("error");
      socket?.off("kicked");
      window.removeEventListener("beforeunload", () => {});
    };
  }, [socket]);

  return { socket };
};
