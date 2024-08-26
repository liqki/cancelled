import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Response } from "@/utils/types";

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

    socket.on("player-kicked", (roomId: string, id: string) => {
      socket.to(id).emit("kicked");
      socket.to(roomId).emit("player-left", id);
    });

    socket.on("start-game", (roomId: string) => {
      socket.to(roomId).emit("start-game");
    });

    socket.on("new-response", (roomId: string, response: Response) => {
      socket.to(roomId).emit("new-response", response);
    });

    socket.on("switch-phase", (roomId: string, responses: Response[]) => {
      const roomSockets = io.sockets.adapter.rooms.get(roomId);

      if (!roomSockets || !roomSockets.size) return;

      const sockets = Array.from(roomSockets).map((id) => io.sockets.sockets.get(id));

      if (!responses || !responses.length || !sockets.length) return;

      const shuffledResponses = responses.sort(() => Math.random() - 0.5);

      sockets.forEach((socket) => {
        if (shuffledResponses.length > 0) {
          let index = 0;
          let responseToAssign = shuffledResponses[index];
          while (responseToAssign?.playerId === socket?.id) {
            responseToAssign = shuffledResponses[index];
            index++;
          }
          shuffledResponses.splice(index, 1);
          socket?.emit("response-assigned", responseToAssign);
        }
      });
    });

    socket.on("request-next-phase", (roomId: string) => {
      socket.to(roomId).emit("request-next-phase");
    });

    socket.on("vote-phase", (roomId: string, responses: Response[]) => {
      socket.to(roomId).emit("vote-phase", responses);
    });

    socket.on("vote", (roomId: string, voter: string, responseId: string) => {
      socket.to(roomId).emit("vote", voter, responseId);
    });

    socket.on("disconnecting", () => {
      const roomId = Array.from(socket.rooms).filter((id) => id !== socket.id)[0];

      if (!roomId) return;

      socket.to(roomId).emit("player-left", socket.id);
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
