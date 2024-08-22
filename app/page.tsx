"use client";

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
        <div>
          <h1 className="text-7xl font-bold text-center">Cancelled!</h1>
          <p className="text-lg text-center">Play with your friends and get cancelled</p>
        </div>
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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-transparent border-2 border-[#FFFFFF]/20 box-border p-3 rounded-full outline-none focus:border-[#FFFFFF]/60"
          />
          <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform" type="submit">
            Create a Room
          </button>
          {searchParams.error && <p className="text-sm text-red-500 text-center">{searchParams?.error}</p>}
        </form>
      </div>
    </main>
  );
}
