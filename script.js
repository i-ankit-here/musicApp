async function spotify() {
    //fetching albums
    async function album() {
        let res = await fetch("http://127.0.0.1:3000/songs/")
        let res1 = await res.text()
        let div = document.createElement("div");
        div.innerHTML = res1;
        let albums = [];
        Array.from(div.getElementsByTagName("a")).forEach(async element => {
            if (element.href.includes("/songs/")) {
                albums.push(element.innerText.slice(0, (element.innerText.length - 1)))
                let res = await fetch(`http://127.0.0.1:3000/songs/${element.innerText.slice(0, (element.innerText.length - 1))}/info.json`)
                let res1 = await res.json()
                document.querySelector(".CardContainer").innerHTML += ` <div data-folder="${element.innerText.slice(0, (element.innerText.length - 1))}" class="card1" style="background-color: rgb(33, 31, 31);">
            <div class="imgplay">
                <img src=${res1.image} class="image"
                    alt="dinner with  friends">
                <div class="play flex justify_center align_center"><svg width="24" height="24"
                        viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                            stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            <div class="flex column gap">
            <h3>${res1.title}</h3>
            <p>${res1.description}</p>
            </div>
        </div>`
            }
        });
    }
    await album()

    //making a function to play the audio
    let currsong = new Audio()
    let folder = "party";
    let currsrc = ""
    let prev_vol;
    function playsong(track) {
        currsong.src = track;
        currsong.play();
        document.querySelector(".SongInfo").innerText = track.slice(7, track.length).split("/")[1].slice(0, -4)
    }

    async function main(folder) {
        let response1 = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
        let response = await response1.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName('a');
        let SongList = document.getElementById("SongList");
        let ul = SongList.firstElementChild;
        ul.innerHTML = ""
        songs = [];


        //making the list of all the songs and presenting then in library section
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href)
                ul.innerHTML = ul.innerHTML + `<li class="Songs">
            <div class="flex row song"><img src="music.svg" alt="music">
                <p class="SongName" class="flex align_center">${element.innerText}</p></div>
            <div class="ply">
                <div class="play1 flex justify_center align_center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                          stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
             </div>
            </div>
        </li>`
            }
        }


        //attaching event listener to every song
        let curridx = 0;
        let allsongs = Array.from(document.querySelectorAll(".Songs"))
        allsongs.forEach(e => {
            e.addEventListener("click", element => {
                currsrc = `/songs/${folder}/` + e.firstElementChild.lastElementChild.innerText
                playsong(currsrc)
                playbtn.style.display = "none";
                pausebtn.style.display = "flex";
                curridx = allsongs.indexOf(e)
            })
        })


        //attaching eventlisteners to previous,play,pause & next
        let prev = document.querySelector(".prev")
        let playbtn = document.querySelector(".playbtn")
        let pausebtn = document.querySelector(".pausebtn")
        let next = document.querySelector(".next")

        prev.addEventListener("click", () => {
            if ((curridx - 1) >= 0) {
                curridx = curridx - 1
                currsrc = `/songs/${folder}/` + allsongs[curridx].firstElementChild.lastElementChild.innerText
                playsong(currsrc)
            }
            else {
                curridx = allsongs.length - 1
                currsrc = `/songs/${folder}/` + allsongs[curridx].firstElementChild.lastElementChild.innerText
                playsong(currsrc)
            }
        })
        playbtn.addEventListener("click", () => {
            if (currsrc == "") {
                currsrc = currsrc = `/songs/${folder}/Daaru Party.mp3`;
                playsong(currsrc)
            }
            else {
                currsong.play();
            }
            playbtn.style.display = "none";
            pausebtn.style.display = "flex";
        })
        pausebtn.addEventListener("click", () => {
            pausebtn.style.display = "none";
            playbtn.style.display = "flex";
            currsong.pause();
        })
        next.addEventListener("click", () => {
            if ((curridx + 1) <= allsongs.length - 1) {
                curridx = curridx + 1
                currsrc = `/songs/${folder}/` + allsongs[curridx].firstElementChild.lastElementChild.innerText
                playsong(currsrc)
            }
            else {
                curridx = 0;
                currsrc = `/songs/${folder}/` + allsongs[curridx].firstElementChild.lastElementChild.innerText
                playsong(currsrc)
            }
        })


        //listen to time update and duration of song
        currsong.addEventListener("timeupdate", () => {
            let duration = sectomin(currsong.duration)
            let curr_time = sectomin(currsong.currentTime)
            document.querySelector(".SongTime").innerText = `${curr_time}/${duration}`;
            document.querySelector(".crcl").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
        })

        //listening to seekbar
        document.querySelector(".seekbar").addEventListener("click", (e) => {
            percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".crcl").style.left = percent + "%";
            currsong.currentTime = ((currsong.duration) * percent) / 100;
        })

        //listening to  volume and its controls
        document.querySelector("#vol_control").addEventListener("change", (e) => {
            currsong.volume = parseInt(e.target.value) / 100
            if (currsong.volume == 0) {
                document.querySelector("#vol").style.display = "none"
                document.querySelector("#vol_mute").style.display = "block"
            }
            else {
                document.querySelector("#vol").style.display = "block"
                document.querySelector("#vol_mute").style.display = "none"
            }
        })
        document.querySelector(".volume").firstElementChild.addEventListener("click", (e) => {
            prev_vol = currsong.volume;
            currsong.volume = 0;
            document.querySelector("#vol").style.display = "none"
            document.querySelector("#vol_mute").style.display = "block"
        })
        document.querySelector("#vol_mute").addEventListener("click", (e) => {
            currsong.volume = prev_vol;
            document.querySelector("#vol").style.display = "block"
            document.querySelector("#vol_mute").style.display = "none"
        })
    }

    function sectomin(sec) {
        let min = Math.floor(sec / 60);
        let rem_sec = Math.floor(sec % 60);
        let tym = min + ":" + rem_sec
        return tym
    }
    await main(folder)

    function loadSongs() {
        //getting folder name for albums
        Array.from(document.querySelectorAll(".card1")).forEach(element => {
            element.addEventListener("click", async (e) => {
                await main(e.currentTarget.dataset.folder)
                document.querySelector(".left").style.left="0%";
            })
        });
    }
    await loadSongs()
}
spotify()