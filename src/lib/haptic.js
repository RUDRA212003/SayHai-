export const triggerHaptic = (pattern = 50) => {
  // Check if the browser supports vibrations
  if ("vibrate" in navigator) {
    // pattern is in milliseconds; 50ms is a subtle "tap"
    navigator.vibrate(pattern);
  }
};