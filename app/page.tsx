export default function Home() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="w-4/5 max-w-96 flex flex-col gap-10 justify-center items-center">
        <div>
          <h1 className="text-7xl font-bold text-center">Cancelled!</h1>
          <p className="text-lg text-center">Play with your friends and get cancelled</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <input type="text" placeholder="Enter your name" className="bg-transparent border-2 border-[#FFFFFF]/20 box-border p-3 rounded-full outline-none focus:border-[#FFFFFF]/60" />
          <button className="rounded-full bg-white text-black p-3 hover:scale-[1.01] transition-transform">Create a Room</button>
        </div>
      </div>
    </main>
  );
}
