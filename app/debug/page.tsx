"use client";

import VoteScreen from "@/components/game/VoteScreen";

export default function page() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <VoteScreen
        socket={null}
        responses={[
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: ["jfdskalö"],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: [],
          },
          {
            playerId: "jfdskalö",
            response: "I am a response",
            switchResponse: "I am a switch response",
            voteIds: ["jfdskalö"],
          },
        ]}
      />
    </main>
  );
}
