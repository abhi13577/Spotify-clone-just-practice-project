// console.log("Hello this is the js");
// let currentSong = new Audio();
// let songs; // Global variable
// let currFolder;

// function secondsToMinutesSecond(seconds) {
//     if (isNaN(seconds) || seconds < 0) {
//         return "00:00";
//     }
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(remainingSeconds).padStart(2, '0');
//     return `${formattedMinutes}:${formattedSeconds}`;
// }

// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`http://127.0.0.1:3000/v84/songs/${folder}/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
    
//     songs = []; 
    
//     for (let i = 0; i < as.length; i++) {
//         const element = as[i];
//         if (element.href.endsWith(".mp3")) {
//             let href = element.href;
//             let parts = href.split(/\/|\\|%5C/);
//             let filename = parts[parts.length - 1];
//             songs.push(filename);
//         }
//     }

//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
//     songUL.innerHTML = "";
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + `<li>  
//                             <img class="invert" src="music.svg" alt="music">
//                             <div class="info">
//                                 <div> ${song.replaceAll("%20", " ")}</div>
//                                 <div>Abbhi Singh</div>
//                             </div>
//                             <div class="playnow">
//                                 <span>Play Now</span>
//                                 <img class="invert" src="play.svg" alt="play">
//                             </div> </li>`;
//     }

//     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener("click", element => {
//             let trackName = e.querySelector(".info").firstElementChild.textContent.trim();
//             playMusic(trackName);
//         });
//     });
// }

// const playMusic = (track, pause = false) => {
//     // CHANGE: Ensure the track name is decoded before using it in the display, 
//     // but encoded for the URL source
//     currentSong.src = `/v84/songs/${currFolder}/` + encodeURI(track);
    
//     if (!pause) {
//         currentSong.play();
//         play.src = "pause.svg";
//     }
//     // CHANGE: Use decodeURI so the song info doesn't show %20 instead of spaces
//     document.querySelector(".songinfo").innerHTML = decodeURI(track);
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
// }

// async function displayAlbums() {
//     console.log("displayAlbums function started");
//     let a = await fetch(`http://127.0.0.1:3000/v84/songs/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".cardContainer");
    
//     cardContainer.innerHTML = ""; // Clear container

//     let array = Array.from(anchors);

//     for (let i = 0; i < array.length; i++) {
//         const e = array[i];
        
//         // IMPROVED CONDITION: This checks for folders and skips files/parent directories
//         if (e.href.includes("/songs") && !e.href.includes(".mp3") && !e.href.includes(".json")) {
            
//             // Extract folder name safely
//             let urlParts = e.href.split("/");
//             // If the URL ends with a /, the folder name is the second to last part
//             let folder = urlParts[urlParts.length - 2];
            
//             // Safety check: if the folder name is "songs", it's the parent directory, so skip it
//             if (folder === "songs") continue;

//             console.log("Processing folder:", folder);

//             try {
//                 let infoFetch = await fetch(`http://127.0.0.1:3000/v84/songs/${folder}/info.json`);
                
//                 if (infoFetch.ok) {
//                     let infoResponse = await infoFetch.json();

//                     cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//                                 <div class="play">
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
//                                         <circle cx="32" cy="32" r="32" fill="#1DB954" />
//                                         <path d="M26 20 L26 44 L46 32 Z" fill="#000000" />
//                                     </svg>
//                                 </div>
//                                 <img src="/v84/songs/${folder}/cover.jpeg" alt="cover">
//                                 <h3>${infoResponse.title}</h3>
//                                 <p>${infoResponse.description}</p>
//                             </div>`;
//                 }
//             } catch (error) {
//                 console.log("Error fetching or parsing info.json for:", folder);
//             }
//         }
//     }

//     // Attach listeners to newly created cards
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             console.log("Card clicked, loading folder:", item.currentTarget.dataset.folder);
//             await getSongs(item.currentTarget.dataset.folder);
//             if (songs.length > 0) {
//                 playMusic(songs[0]);
//             }
//         });
//     });
// }

// async function main() {
//     await getSongs("cs");
//     playMusic(songs[0], true);

//     await displayAlbums(); 

//     play.addEventListener("click", () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             play.src = "pause.svg";
//         } else {
//             currentSong.pause();
//             play.src = "play.svg";
//         }
//     });

//     currentSong.addEventListener("timeupdate", () => {
//         if (!isNaN(currentSong.duration)) {
//             document.querySelector(".songtime").innerHTML = `${secondsToMinutesSecond(currentSong.currentTime)} / ${secondsToMinutesSecond(currentSong.duration)}`;
//             document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
//         }
//     });

//     document.querySelector(".seekbar").addEventListener("click", e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector(".circle").style.left = percent + "%";
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100;
//     });

//     document.querySelector(".hamburger").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "0";
//     });

//     document.querySelector(".close").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "-120%";
//     });

//     previous.addEventListener("click", () => {
//         // CHANGE: Corrected the index matching for Next/Prev to work with cleaned song names
//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
//         if ((index - 1) >= 0) {
//             playMusic(songs[index - 1]);
//         }
//     });

//     next.addEventListener("click", () => {
//         // CHANGE: Corrected the index matching for Next/Prev to work with cleaned song names
//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
//         if ((index + 1) < songs.length) {
//             playMusic(songs[index + 1]);
//         }
//     });

//     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//     });
// }

// main();

let currentSong = new Audio();
let songs; // Global variable
let currFolder;

function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/v84/songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    songs = []; 
    
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            let href = element.href;
            let parts = href.split(/\/|\\|%5C/);
            let filename = parts[parts.length - 1];
            songs.push(filename);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Abbhi Singh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let trackName = e.querySelector(".info").firstElementChild.textContent.trim();
            playMusic(trackName);
        });
    });
}

const playMusic = (track, pause = false) => {
    // CHANGE: Ensure the track name is decoded before using it in the display, 
    // but encoded for the URL source
    currentSong.src = `/v84/songs/${currFolder}/` + encodeURI(track);
    
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    // CHANGE: Use decodeURI so the song info doesn't show %20 instead of spaces
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {

    let res = await fetch("http://127.0.0.1:3000/v84/songs/");
    let html = await res.text();

    let div = document.createElement("div");
    div.innerHTML = html;

    let anchors = div.querySelectorAll("a");
    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = "";

    for (let a of anchors) {

        // 👇 THIS LINE FIXES YOUR BUG
        let href = decodeURIComponent(a.getAttribute("href"));

        // ignore parent directory
        if (href === "../") continue;

        // normalize slashes
        href = href.replace(/\\/g, "/");

        // extract folder name
        let parts = href.split("/").filter(Boolean);
        let folder = parts[parts.length - 1];

        // safety checks
        if (!folder || folder === "songs") continue;


        try {
            let infoRes = await fetch(`/v84/songs/${folder}/info.json`);
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
                    <img src="/v84/songs/${folder}/cover.jpeg">
                    <h3>${info.title}</h3>
                    <p>${info.description}</p>
                </div>`;
        } catch (err) {
            
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
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSecond(currentSong.currentTime)} / ${secondsToMinutesSecond(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        // CHANGE: Corrected the index matching for Next/Prev to work with cleaned song names
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        // CHANGE: Corrected the index matching for Next/Prev to work with cleaned song names
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName(".input")[0].value = 10;
        }
    })
}

main();