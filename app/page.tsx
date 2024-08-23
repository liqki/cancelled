"use client";

import Heading from "@/components/Heading";
import JoinForm from "@/components/JoinForm";
import { generateRoomId } from "@/utils/generateRoomId";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ searchParams }: { searchParams: { error: string } }) {
  const router = useRouter();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
  }, []);

  useEffect(() => {
    if (name) localStorage.setItem("name", name);
  }, [name]);

  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="w-4/5 max-w-96 flex flex-col gap-10 justify-center items-center">
        <Heading />
        <form
          className="flex flex-col gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name) {
              router.push("/?error=Name is required");
              return;
            }
            const roomId = generateRoomId();
            router.push(`/${roomId}/?host=true&name=${name}`);
          }}
        >
          <JoinForm error={searchParams.error} label="Create a Room" />
        </form>
      </div>
    </main>
  );
}
