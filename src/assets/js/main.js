function setupMarquee(containerId, trackId) {
  const container = document.getElementById(containerId);
  const track = document.getElementById(trackId);

  if (!container || !track) return;

  // Clone the images/content for seamless loop
  track.innerHTML += track.innerHTML;

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// Setup both marquees
setupMarquee('marquee-container2', 'marquee-track2');


// =side menu=
var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});
