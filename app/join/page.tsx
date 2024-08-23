"use client";
import Heading from "@/components/Heading";
import JoinForm from "@/components/JoinForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Join({ searchParams }: { searchParams: { roomId: string } }) {
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

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
