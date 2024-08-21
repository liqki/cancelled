"use client";

import { generateRoomId } from "@/utils/generateRoomId";
import { useRouter } from "next/navigation";

export default function Home({ searchParams }: { searchParams: { error: string } }) {
  const router = useRouter();

  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="w-4/5 max-w-96 flex flex-col gap-10 justify-center items-center">
        <div>
          <h1 className="text-7xl font-bold text-center">Cancelled!</h1>
          <p className="text-lg text-center">Play with your friends and get cancelled</p>
        </div>
        <form className="flex flex-col gap-2 w-full" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Enter your name" className="bg-transparent border-2 border-[#FFFFFF]/20 box-border p-3 rounded-full outline-none focus:border-[#FFFFFF]/60" />
          <button
            className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform"
            onClick={() => {
              const roomId = generateRoomId();
              router.push(`/${roomId}/?host=true`);
            }}
            type="submit"
          >
            Create a Room
          </button>
          {searchParams.error && <p className="text-sm text-red-500 text-center">{searchParams?.error}</p>}
        </form>
      </div>
    </main>
  );
}
