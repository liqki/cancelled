import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform w-full mt-4"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
      }}
    >
      {copied ? "Copied Link" : "Share this Link"}
    </button>
  );
}
