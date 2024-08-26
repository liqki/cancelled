"use client";

import VoteScreen from "@/components/game/VoteScreen";

export default function page() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <VoteScreen
        socket={null}
        players={[
          {
            id: "jfdskalö",
            name: "Player 1",
            host: true,
            score: 0,
            color: "#5b5c39",
          },
        ]}
        responses={[
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            switchPlayerId: "jfdskalö",
            voteIds: ["jfdskalö"],
          },
        ]}
      />
    </main>
  );
}
