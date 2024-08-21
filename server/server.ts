import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { RoomData } from "@/utils/types";

const activeRooms = new Map<string, RoomData>();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("create-room", (roomId: string, name: string) => {
      if (activeRooms.has(roomId)) {
        socket.emit("error", "Room already exists");
        return;
      }

      activeRooms.set(roomId, {
        players: [
          {
            id: socket.id,
            host: true,
            name,
            score: 0,
            color: "blue",
          },
        ],
        state: "waiting",
      });

      socket.join(roomId);
      socket.emit("room-update", activeRooms.get(roomId));
    });

    socket.on("join-room", (roomId: string, name: string) => {
      const room = activeRooms.get(roomId);

      if (!room) {
        socket.emit("error", "Room does not exist");
        return;
      }

      if (room.state !== "waiting") {
        socket.emit("error", "Room is not accepting players");
        return;
      }

      room.players.push({
        id: socket.id,
        host: false,
        name: name,
        score: 0,
        color: "red",
      });
      socket.join(roomId);
      socket.emit("room-update", room);
      socket.to(roomId).emit("room-update", room);
    });

    socket.on("disconnect", () => {
      const roomId = Array.from(activeRooms.keys()).find((roomId) => activeRooms.get(roomId)?.players.some((player) => player.id === socket.id)) as string;
      const room = activeRooms.get(roomId);

      if (!room) return;

      room.players.map((player) => {
        if (player.id === socket.id && player.host) {
          if (room.players.length > 1) {
            room.players[1].host = true;
          } else {
            activeRooms.delete(roomId);
          }
        }
      });

      room.players = room.players.filter((player) => player.id !== socket.id);

      socket.to(roomId).emit("room-update", room);
      socket.leave(roomId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
