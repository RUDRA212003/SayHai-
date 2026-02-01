function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full relative p-[2px] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-yellow-500 rounded-tl-2xl z-20" />
      
      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-yellow-500 rounded-br-2xl z-20" />

      <div className="w-full h-full rounded-[14px] bg-zinc-950/50 backdrop-blur-md overflow-hidden flex relative z-10">
        {children}
      </div>
    </div>
  );
}

export default BorderAnimatedContainer;