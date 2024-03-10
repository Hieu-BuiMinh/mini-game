import { confettiSoundPlay, shootConfetties } from './confetti.js'
import { losingModalCotent, winningModalCotent } from './modal.js'

const winningContent = winningModalCotent()
const losingContent = losingModalCotent()

let boxContainer = null
let originInitData = null
let initImageListData = null
let selectCardElSound = null
let backsoundElSound = null


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded')
    boxContainer = document.getElementById("box-container")
    initGame()
    initSound()

    const onMessageListener = (event) => {
        // initGame()
        // initSound()
    }
    window.addEventListener('message', onMessageListener, false)
})

function sendMessage(message) {
    return window.parent.postMessage(message, '*')
}

const GameFakeData = {
    data: {
        box: "https://cdn-icons-png.flaticon.com/512/12690/12690649.png",
        sounds: {
            confettiSound: '../assets/sound/confetties_sound.mp3',
            selectCardSound: '../assets/sound/select_sound.mp3',
            backSound: '../assets/sound/game_backsound.mp3',
        },
        payload: [
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931311.png', status: 'win' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931323.png', status: 'lose' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931311.png', status: 'win' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931323.png', status: 'lose' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931311.png', status: 'win' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931323.png', status: 'lose' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931311.png', status: 'win' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931323.png', status: 'lose' },
            { url: 'https://cdn-icons-png.flaticon.com/512/6931/6931311.png', status: 'win' },
        ],
    },
}

const initGame = () => {
    for (const image of GameFakeData.data.payload) {
        const box = document.createElement("div")
        box.classList.add("box")
        box.innerHTML = `<img src=${GameFakeData.data.box} alt="">`

        boxContainer.appendChild(box)

        box.addEventListener("click", () => {
            box.classList.add("active")
            setTimeout(() => {
                box.classList.remove("active")
                boxContainer.style.opacity = 0
                SPopupFire(image)
            }, 1000);
        })
    }
}

const SPopupFire = (img) => {
    if (img?.status === "win") {
        setTimeout(shootConfetties, 0)
        confettiSoundPlay()
    }

    Swal.fire({
        imageUrl: img.url,
        imageWidth: 400,
        imageHeight: 400,
        confirmButtonText: img?.status === "win" ? "Nhận quà" : "Opps"
    }).then(res => {
        if (res?.isDismissed || res?.isConfirmed) {
            if (img?.status === "win") {
                sendMessage(winningContent)
            } else {
                sendMessage(losingContent)
            }
        }
        boxContainer.style.opacity = 1
    })

}

const initSound = () => {
    document.getElementById('sound-container').innerHTML = `
	<audio src="${GameFakeData?.data?.sounds?.confettiSound}" id="confetti-sound" type="audio/mpeg" ></audio>
	<audio src="${GameFakeData?.data?.sounds?.backSound}" id="game-back-sound" type="audio/mpeg" loop autoplay></audio>
	`

    backsoundElSound = document.querySelector('#game-back-sound')

    const soundToggle = document.getElementById('backsound-toggle')
    soundToggle.addEventListener('click', () => {
        if (soundToggle.innerHTML.trim() === '<i class="ri-volume-up-fill"></i>') {
            soundToggle.innerHTML = `<i class="ri-volume-mute-fill"></i>`
            backsoundElSound?.pause()
        } else {
            soundToggle.innerHTML = `<i class="ri-volume-up-fill"></i>`
            backsoundElSound?.play()
        }
    })

    document.addEventListener(
        'click',
        () => {
            if (backsoundElSound.paused) {
                backsoundElSound.play()
                soundToggle.innerHTML = `<i class="ri-volume-up-fill"></i>`
            }
        },
        { once: true }
    )
}