import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export default function ColorPicker() {
  const { color, setColor } = useContext(UserContext);

  return (
    <div
      className={`rounded-full h-10 aspect-square hover:scale-[1.1] transition-transform cursor-pointer`}
      style={{ background: color }}
      onClick={() => {
        setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
      }}
    ></div>
  );
}
