// Static derivatives of the original footage, deliberately independent of the CMS/API.
export const staticVideo = {
  src: '/videos/rm-film-05a48f56bd9a-v1.mp4',
  poster: '/videos/rm-film-05a48f56bd9a-v1-poster.webp',
};

export function shouldPlayVideo({ near, visible, hidden, reducedMotion, saveData, manual, pausedByUser }) {
  return near && visible && !hidden && !pausedByUser && (manual || (!reducedMotion && !saveData));
}
