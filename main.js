const header = document.querySelector(".header");
const play_now = document.getElementById("play_now");
const list_music = document.querySelector(".list_music");
var button_plays;
var music = new Audio;
var playing = false;
var playTrack;
var idTrack;

window.addEventListener("scroll", function() {
    header.classList.toggle("active", this.scrollY > 0)
})

play_now.addEventListener("click", playNow)

function playNow() {
    const sfx = new Audio("music/sfx.mp3")
    sfx.play()
    let target = "."+this.dataset.target
    const offsetTop = document.querySelector(target).offsetTop
    scroll({
        top: offsetTop,
        behavior: "smooth"
    });

}

async function getData() {
    let fetchData = await fetch("db.json")
    let responses = await fetchData.json()
    let playlists = responses.playlist
    renderData(playlists)
}

getData()

function renderData(playlists) {
    let template = ''
    let i = 1
    playlists.map((playlist, index) => {
        template += `
        <li>
            <div class="detail">
                <p>${i++}. ${playlist.title}</p>
            </div>
            <div class="play">
                <i class="fa fa-play" id="btn_play" data-id="${playlist.src}" data-list="${index}""></i>
            </div>
        </li>`
    })

    list_music.innerHTML = template
    
    button_plays = document.querySelectorAll("#btn_play");

    button_plays.forEach(btn_play => {
        btn_play.addEventListener("click", PlayMusic)
    })


    music.addEventListener("ended", function() {
        let idList = parseInt(idTrack) + 1
        if(idList > playlists.length) {
            return
        }
        
        idTrack ++

        let src_music = playlists[idTrack].src;
        let listNow = document.querySelector(`[data-list="${idList}"]`)
        if(playing) {
            if(playTrack != src_music) {
                playing = true
                music.src = "music/"+src_music
                listNow.setAttribute("class", "fa fa-pause")
                music.play()
            } else {
                music.pause()
                playing = false
                this.setAttribute("class", "fa fa-play")
            }
        } else {
            playing = true
            this.setAttribute("class", "fa fa-pause")
    
            if(playTrack != src_music) {
                playing = true
                music.src = "music/"+src_music
                idTrack = src_music
            }
            music.play()
        }
    
        playTrack = src_music
    })
    
    
}

function PlayMusic() {

    button_plays.forEach(btn_play => {
        btn_play.setAttribute("class", "fa fa-play")
    })

    if(playing) {
        if(playTrack != this.dataset.id) {
            playing = true
            music.src = "music/"+this.dataset.id
            idTrack = this.dataset.list
            this.setAttribute("class", "fa fa-pause")
            music.play()
        } else {
            music.pause()
            playing = false
            this.setAttribute("class", "fa fa-play")
        }
    } else {
        playing = true
        this.setAttribute("class", "fa fa-pause")

        if(playTrack != this.dataset.id) {
            playing = true
            music.src = "music/"+this.dataset.id
            idTrack = this.dataset.list
        }
        music.play()
    }

    playTrack = this.dataset.id
    
}

music.addEventListener("ended", function() {
    button_plays.forEach(btn_play => {
        btn_play.setAttribute("class", "fa fa-play")
    })
})

