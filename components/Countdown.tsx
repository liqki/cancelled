import { useEffect, useState } from "react";

export default function Countdown({ stopCountdown }: { stopCountdown: () => void }) {
  const [time, setTime] = useState(3);

  useEffect(() => {
    if (time === 0) return stopCountdown();
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <p className="text-2xl">Get ready for the next round in</p>
      <div className="grid place-items-center w-32 aspect-square rounded-full bg-white text-black font-bold text-7xl">{time}</div>
    </div>
  );
}
