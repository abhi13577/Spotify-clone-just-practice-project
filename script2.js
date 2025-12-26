let currentSong = new Audio();
let songs = [];
let currFolder = "";

// ------------------ UTIL ------------------
function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ------------------ LOAD SONGS ------------------
async function getSongs(folder) {
    currFolder = folder;

    // ✅ FIXED: explicit relative path
    let res = await fetch(`./songs/${folder}/info.json`);
    let info = await res.json();

    songs = info.songs.map(song => ({
        name: song.replace(".mp3", "").replaceAll("_", " "),
        url: info.baseUrl + encodeURIComponent(song)
    }));

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    songs.forEach(song => {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="music.svg" alt="music">
            <div class="info">
                <div>${song.name}</div>
                <div>Abbhi Singh</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="play">
            </div>
        </li>`;
    });

    Array.from(songUL.children).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });
}

// ------------------ PLAY MUSIC ------------------
const playMusic = (song, pause = false) => {
    currentSong.src = song.url;

    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = song.name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// ------------------ DISPLAY ALBUMS ------------------
async function displayAlbums() {
    let albums = ["ab", "cs", "ncs", "kannadaoldhits", "tamil hits"];
    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = "";

    for (let folder of albums) {
        try {
            // ✅ FIXED: explicit relative path
            let infoRes = await fetch(`./songs/${folder}/info.json`);
            if (!infoRes.ok) continue;

            let info = await infoRes.json();

            cardContainer.innerHTML += `
                <div class="card" data-folder="${folder}">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="32" fill="#1DB954"/>
                            <path d="M26 20 L26 44 L46 32 Z" fill="#000"/>
                        </svg>
                    </div>
                    <!-- ✅ FIXED: explicit relative image path -->
                    <img src="./songs/${folder}/cover.jpeg">
                    <h3>${info.title}</h3>
                    <p>${info.description}</p>
                </div>`;
        } catch (err) {
            console.error("Album load failed:", folder);
        }
    }

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            await getSongs(folder);
            playMusic(songs[0]);
        });
    });
}

// ------------------ MAIN ------------------
async function main() {
    await getSongs("cs");
    playMusic(songs[0], true);
    await displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML =
                `${secondsToMinutesSecond(currentSong.currentTime)} / ${secondsToMinutesSecond(currentSong.duration)}`;
            document.querySelector(".circle").style.left =
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        let index = songs.findIndex(s => s.url === currentSong.src);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.findIndex(s => s.url === currentSong.src);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
