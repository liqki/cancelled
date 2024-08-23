"use client";
import Heading from "@/components/Heading";
import JoinForm from "@/components/JoinForm";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Join({ searchParams }: { searchParams: { roomId: string } }) {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { name } = useContext(UserContext);

  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="w-4/5 max-w-96 flex flex-col gap-10 justify-center items-center">
        <Heading />
        <form
          className="flex flex-col gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name) {
              setError("Name is required");
              return;
            }
            router.replace(`/${searchParams.roomId}?name=${name}`);
          }}
        >
          <JoinForm error={error} label="Join Room" />
        </form>
      </div>
    </main>
  );
}
