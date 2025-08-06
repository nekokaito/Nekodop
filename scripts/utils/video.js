document.getElementById('custom-watch-video').addEventListener('click', function(e) {
  e.preventDefault();
  const modal = document.getElementById('custom-video-modal');
  const video = document.getElementById('custom-video-player');
  modal.style.display = 'block';
  video.currentTime = 0;
  video.play();
});

window.addEventListener('click', function(e) {
  const modal = document.getElementById('custom-video-modal');
  const video = document.getElementById('custom-video-player');
  if (e.target === modal) {
    modal.style.display = 'none';
    video.pause();
    video.currentTime = 0; // Reset video to start
  }
});

