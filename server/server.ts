import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("create-room", (roomId: string, name: string, color: string) => {
      if (io.sockets.adapter.rooms.has(roomId)) {
        socket.emit("error", "Room already exists");
        return;
      }

      socket.join(roomId);
      socket.emit("player-joined", {
        id: socket.id,
        host: true,
        name,
        score: 0,
        color,
      });
    });

    socket.on("join-room", (roomId: string, name: string, color: string) => {
      if (!io.sockets.adapter.rooms.has(roomId)) {
        socket.emit("error", "Room does not exist");
        return;
      }

      socket.join(roomId);
      socket.to(roomId).emit("player-joined", {
        id: socket.id,
        host: false,
        name: name,
        score: 0,
        color,
      });
    });

    socket.on("join-error", ({ message, id }) => {
      socket.to(id).emit("error", message);
    });

    socket.on("new-host", ({ id, roomId }) => {
      socket.to(roomId).emit("new-host", id);
    });

    socket.on("initial-data", ({ players, state, id }) => {
      socket.to(id).emit("initial-data", { players, state });
    });

    socket.on("disconnecting", () => {
      const roomId = Array.from(socket.rooms).filter((id) => id !== socket.id)[0];

      if (!roomId) return;

      socket.to(roomId).emit("player-left", socket.id);
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
