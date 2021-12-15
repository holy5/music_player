const track = document.getElementById("track");
const playBtn = document.querySelector(".play");
const nextBtn = document.querySelector(".forward");
const backBtn = document.querySelector(".back");
const musicName = document.querySelector(".music-name");
const currentPlayingTime = document.querySelector(".current");
const length = document.querySelector(".length");
const slider = document.querySelector(".range");

let musicNames = [
  "A(I)Ngel Become God",
  "Angel Voices",
  "Eon Break",
  "Particle Arts",
];
let currentName = 0;

const tracks = [
  "A_I_Ngel Become God_ - Virtual Self.flac",
  "Angel Voices - Virtual Self.flac",
  "Eon Break - Virtual Self.mp3",
  "Particle Arts - Virtual Self.flac",
];

let currentTrack = 0;
track.setAttribute("src", `./music/${tracks[currentTrack]}`);

playBtn.addEventListener("click", playPause);
let isPlaying = true;

let timer;

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
  currentName += dir;
  if (currentTrack >= tracks.length) {
    currentTrack = 0;
    currentName = 0;
  } else if (currentTrack < 0) {
    currentTrack = tracks.length - 1;
    currentName = musicNames.length - 1;
  }
  musicName.innerHTML = `${musicNames[currentName]}`;
  isPlaying = true;
  track.setAttribute("src", `./music/${tracks[currentTrack]}`);
  playPause();
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
  document.querySelector("body").classList.toggle("light-body");
  document.querySelector(".music").classList.toggle("dark-background");

  if (!isDark) {
    icon.innerHTML = `<ion-icon name="sunny"></ion-icon>`;
  } else {
    icon.innerHTML = `<ion-icon name="moon"></ion-icon>`;
  }
  icon.classList.toggle("dark-icon");
  isDark = !isDark;

  document.querySelector(".music-name").classList.toggle("dark-text");
  document.querySelector(".music-artist").classList.toggle("dark-text");
  document.querySelector(".range").classList.toggle("dark-slider");
  document.querySelector(".time").classList.toggle("dark-text");
  document.querySelector(".forward").classList.toggle("dark-color");
  document.querySelector(".shuffle").classList.toggle("dark-color");
  document.querySelector(".repeat").classList.toggle("dark-color");
  document.querySelector(".back").classList.toggle("dark-color");
  document.querySelector(".play").classList.toggle("dark-play");
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
  randomDir = Math.floor(Math.random() * (max - min) + min);
  const changeRandom = () => {
    changeTrack(randomDir);
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
}
