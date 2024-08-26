"use client";

import SwitchPrompt from "@/components/game/SwitchPrompt";

export default function page() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <SwitchPrompt prompt="This is a pretty long test text to test the display of the switch prompt LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" />
    </main>
  );
}
