export const isIOSPWA = (): boolean => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInWebAppiOS = window.matchMedia("(display-mode: standalone)").matches;

  return isIOS && isInWebAppiOS;
};
