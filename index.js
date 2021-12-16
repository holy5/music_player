const track = document.getElementById("track");
const playBtn = document.querySelector(".play");
const nextBtn = document.querySelector(".forward");
const backBtn = document.querySelector(".back");
const musicName = document.querySelector(".music-name");
const currentPlayingTime = document.querySelector(".current");
const length = document.querySelector(".length");
const slider = document.querySelector(".range");

const tracks = [
  {
    id: 1,
    name: "A(I)Ngel Become God",
    artist: "Virtual Self",
    path: "./music/A_I_Ngel Become God_ - Virtual Self.flac",
  },
  {
    id: 2,
    name: "Angel Voices",
    artist: "Virtual Self",
    path: "./music/Angel Voices - Virtual Self.flac",
  },
  {
    id: 3,
    name: "Eon Break",
    artist: "Virtual Self",
    path: "./music/Eon Break - Virtual Self.mp3",
  },
  {
    id: 4,
    name: "Particle Arts",
    artist: "Virtual Self",
    path: "./music/Particle Arts - Virtual Self.flac",
  },
];

let currentTrack = 0;
track.setAttribute("src", `${tracks[0].path}`);

playBtn.addEventListener("click", playPause);
let isPlaying = true;

let timer;

function loadTrack(currentTrack) {
  track.setAttribute("src", `${tracks[currentTrack].path}`);
}

function playPause() {
  if (isPlaying) {
    track.play();
    playBtn.innerHTML = `<ion-icon name="pause"></ion-icon>`;
    timer = setInterval(displayTime, 900);
  } else {
    track.pause();
    playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
    clearInterval(timer);
  }
  isPlaying = !isPlaying;
}

nextBtn.addEventListener("click", () => {
  changeTrack(1);
});
backBtn.addEventListener("click", () => {
  changeTrack(-1);
});
// Next,prev track
function changeTrack(dir) {
  currentTrack += dir;
  if (currentTrack >= tracks.length) {
    currentTrack = 0;
  } else if (currentTrack < 0) {
    currentTrack = tracks.length - 1;
  }
  changeTitle(currentTrack);
  isPlaying = true;
  loadTrack(currentTrack);
  playPause();
  handlePlaying();
  return currentTrack;
}

function changeTitle(currentTrack) {
  musicName.innerHTML = `${tracks[currentTrack].name}`;
}

function displayTime() {
  const { duration, currentTime } = track;
  slider.max = duration;
  slider.value = currentTime;
  currentPlayingTime.textContent = formatTime(currentTime);
  if (!duration) {
    length.textContent = "00:00";
  } else {
    length.textContent = formatTime(duration);
  }
}
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  if (seconds < 10) {
    return `${minutes}:0${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

displayTime();
// const timer = setInterval(displayTime, 900);

slider.addEventListener("change", handleChangeSlider);

function handleChangeSlider() {
  track.currentTime = slider.value;
}

track.addEventListener("ended", handleEndTrack);
function handleEndTrack() {
  changeTrack(1);
}

// DarkMode
const toggle = document.querySelector(".dark-mode");
let isDark = false;
toggle.addEventListener("click", toggleTheme);
function toggleTheme() {
  const icon = document.querySelector(".theme-icon");
  const body = document.querySelector("body");
  const music = document.querySelector(".music");
  const musicName = document.querySelector(".music-name");
  const musicArtist = document.querySelector(".music-artist");
  const slider = document.querySelector(".range");
  const timer = document.querySelector(".time");
  const control = document.querySelector(".controls");
  const progressBar = document.querySelector(".progress-bar");
  const play = document.querySelector(".play");

  body.classList.toggle("light-body");
  music.classList.toggle("dark-background");

  if (!isDark) {
    icon.innerHTML = `<ion-icon name="sunny"></ion-icon>`;
  } else {
    icon.innerHTML = `<ion-icon name="moon"></ion-icon>`;
  }
  icon.classList.toggle("dark-icon");
  isDark = !isDark;

  musicName.classList.toggle("dark-text");
  musicArtist.classList.toggle("dark-text");
  slider.classList.toggle("dark-slider");
  timer.classList.toggle("dark-text");
  control.classList.toggle("dark-color");
  play.classList.toggle("dark-play");
  progressBar.classList.toggle("progress-bar-dark");
}
// Loop
let isRepeat = false;
const repeatBtn = document.querySelector(".repeat");
repeatBtn.addEventListener("click", handleRepeat);
function handleRepeat() {
  repeatBtn.classList.remove("active");

  if (!isRepeat) {
    repeatBtn.classList.add("active");
    track.setAttribute("loop", "");
  } else {
    track.removeAttribute("loop");
  }
  isRepeat = !isRepeat;
}
// Shuffle
const shuffleBtn = document.querySelector(".shuffle");
let isShuffle = false;
shuffleBtn.addEventListener("click", handleShuffle);

function handleShuffle() {
  track.removeEventListener("ended", handleEndTrack);
  const max = tracks.length;
  const min = 1;
  currentTrack = Math.floor(Math.random() * (max - min) + min);
  const changeRandom = () => {
    changeTrack(currentTrack);
  };
  if (!isShuffle) {
    shuffleBtn.classList.toggle("active");
    track.addEventListener("ended", changeRandom);
  } else {
    shuffleBtn.classList.toggle("active");
    track.removeEventListener("ended", changeRandom);
    track.addEventListener("ended", handleEndTrack);
  }
  isShuffle = !isShuffle;
  return currentTrack;
}
// Progress Bar
const progressBar = document.querySelector(".progress-bar");
track.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let currentProgress = `${Math.floor((currentTime * 100) / duration)}%`;
  progressBar.style.width = currentProgress;
});
// Volume
const volumeIconWrapper = document.querySelector(".volume-icon-wrapper");
const volumeControl = document.querySelector(".volume-control");
const volumeSlider = document.querySelector(".volume-slider");
let isMuted = false;
volumeSlider.max = 1;
volumeSlider.min = 0;
volumeSlider.step = 0.02;

volumeIconWrapper.addEventListener("click", handleVolume);
volumeIconWrapper.addEventListener("mouseenter", displayVolume);
volumeControl.addEventListener("mouseleave", hideVolume);

function displayVolume() {
  volumeControl.style.display = "flex";
}
function hideVolume() {
  volumeControl.style.display = "none";
}

function handleVolume() {
  if (!isMuted) {
    track.volume = 0;
    volumeSlider.value = 0;
    volumeIconWrapper.innerHTML = `<ion-icon name="volume-mute" class="volume"></ion-icon>`;
  } else {
    track.volume = 0.5;
    volumeSlider.value = 0.5;
    volumeIconWrapper.innerHTML = `<ion-icon name="volume-high" class="volume"> </ion-icon>`;
  }
  isMuted = !isMuted;
}
volumeSlider.addEventListener("change", handleVolumeChange);
function handleVolumeChange() {
  track.volume = volumeSlider.value;
  if (volumeSlider.value > 0 && volumeSlider.value <= 0.3) {
    volumeIconWrapper.innerHTML = `<ion-icon name="volume-low" class="volume"></ion-icon>`;
  } else if (volumeSlider.value > 0.3 && volumeSlider.value <= 0.6) {
    volumeIconWrapper.innerHTML = `<ion-icon name="volume-medium" class="volume"></ion-icon>`;
  } else if (volumeSlider.value > 0.6) {
    volumeIconWrapper.innerHTML = `<ion-icon name="volume-high" class="volume"> </ion-icon>`;
  }
}
// List
const dropdownIcon = document.querySelector(".dropdown-icon");
const listWrapper = document.querySelector(".list-item-wrapper");
const amount = document.querySelector(".amount");
const trackItems = document.querySelectorAll(".list-item");
const trackNames = document.querySelectorAll(".track-name");

trackNames.forEach((name, index) => {
  name.textContent = tracks[index].name;
});

amount.textContent =
  tracks.length < 10 ? `0${tracks.length}` : `${tracks.length}`;
dropdownIcon.addEventListener("click", handleDropdown);

function handleDropdown() {
  dropdownIcon.classList.toggle("active");
  listWrapper.classList.toggle("active");
}

function handlePlaying() {
  for (let i = 0; i < tracks.length; i++) {
    if (trackItems[i].classList.contains("active")) {
      trackItems[i].classList.remove("active");
    }
    if (trackItems[i].getAttribute("li-index") == currentTrack) {
      trackItems[i].classList.add("active");
    }
    trackItems[i].setAttribute("onclick", "handleClickedTrack(this)");
  }
}
handlePlaying();
function handleClickedTrack(element) {
  let getIndexOfTrack = element.getAttribute("li-index");
  currentTrack = getIndexOfTrack;
  changeTitle(currentTrack);
  loadTrack(currentTrack);
  isPlaying = true;
  playPause();
  handlePlaying();
}
