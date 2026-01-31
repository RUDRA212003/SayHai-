// Optimized for the Yellow & Dark (Noir) Theme
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full 
      [background:linear-gradient(45deg,theme(colors.zinc.950),theme(colors.zinc.900)_50%,theme(colors.zinc.950))_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.800/.48)_80%,_theme(colors.yellow.500)_86%,_theme(colors.yellow.200)_90%,_theme(colors.yellow.500)_94%,_theme(colors.zinc.800/.48))_border-box] 
      rounded-2xl border border-transparent animate-border flex overflow-hidden shadow-2xl">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;