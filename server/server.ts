import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

export type RoomData = {
  host: string;
  players: string[];
  state: "waiting" | "playing" | "finished";
};

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
    socket.on("create-room", (roomId: string) => {
      if (activeRooms.has(roomId)) {
        socket.emit("error", "Room already exists");
        return;
      }

      activeRooms.set(roomId, {
        host: socket.id,
        players: [],
        state: "waiting",
      });

      socket.join(roomId);
    });

    socket.on("join-room", (roomId: string) => {
      const room = activeRooms.get(roomId);

      console.log(room);

      if (!room) {
        socket.emit("error", "Room does not exist");
        return;
      }

      if (room.state !== "waiting") {
        socket.emit("error", "Room is not accepting players");
        return;
      }

      room.players.push(socket.id);
      socket.join(roomId);
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
