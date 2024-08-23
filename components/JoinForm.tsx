import { useContext } from "react";
import ColorPicker from "./ColorPicker";
import { UserContext } from "@/context/UserContext";

export default function JoinForm({ error, label }: { error: string; label: string }) {
  const { name, setName } = useContext(UserContext);

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter your name"
          className="bg-transparent border-2 border-[#FFFFFF]/20 box-border p-3 rounded-full outline-none focus:border-[#FFFFFF]/60 flex-1"
        />
        <ColorPicker />
      </div>
      <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform" type="submit">
        {label}
      </button>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </>
  );
}
