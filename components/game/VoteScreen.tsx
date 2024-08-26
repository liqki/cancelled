import { Response } from "@/utils/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function VoteScreen({ socket, responses }: { socket: Socket | null; responses: Response[] }) {
  return (
    <>
      <div className="py-4 box-border w-4/5 lg:h-4/5 grid gap-4 items-center justify-center place-items-center lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {responses.map((response, i) => (
          <VoteCard key={i} response={response} />
        ))}
      </div>
    </>
  );
}

function VoteCard({ response }: { response: Response }) {
  const [tiltAngle, setTiltAngle] = useState(0);

  useEffect(() => {
    setTiltAngle(Math.floor(Math.random() * 5));
  }, []);

  return (
    <div className="lg:w-full w-4/5 lg:h-full aspect-[9/16] lg:aspect-auto bg-white rounded-md" style={{ transform: `rotate(${tiltAngle}deg)` }}>
      {response.response}
    </div>
  );
}
