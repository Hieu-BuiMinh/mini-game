import { confettiSoundPlay, shootConfetties } from './confetti.js'
import { losingModalCotent, winningModalCotent } from './modal.js'

const winningContent = winningModalCotent()
const losingContent = losingModalCotent()

let originInitData = null
let initImageListData = null
let backsoundElSound = null

const slotContainer = document.getElementById('slot-container')
const animationDuration = 6000

let GameFakeData = {
	data: {
		sounds: {
			confettiSound: '../assets/sound/confetties_sound.mp3',
			backSound: '../assets/sound/game_backsound.mp3',
		},
		images: [
			'https://cdn-icons-png.flaticon.com/256/14699/14699677.png',
			'https://cdn-icons-png.flaticon.com/256/14699/14699686.png',
			'https://cdn-icons-png.flaticon.com/256/14699/14699678.png',
			'https://cdn-icons-png.flaticon.com/256/14699/14699692.png',
			'https://cdn-icons-png.flaticon.com/256/14699/14699684.png',
			'https://cdn-icons-png.flaticon.com/256/14699/14699695.png',
			'https://cdn-icons-png.flaticon.com/256/15054/15054885.png',
			'https://cdn-icons-png.flaticon.com/256/8548/8548875.png',
			'https://cdn-icons-png.flaticon.com/256/14477/14477421.png',
			'https://cdn-icons-png.flaticon.com/256/15135/15135842.png',
		],
	},
}

document.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	// initImageListData = [...Array(5).keys()].flatMap(() => GameFakeData?.data?.images)
	// initSound()
	// initGame()

	const onMessageListener = (event) => {
		if (event?.data?.messageType === 'NEXT_JS_MESSAGE') {
			console.log('index js log: ', event?.data)
			//// Next js init data here
			originInitData = event.data
			initImageListData = [...Array(5).keys()].flatMap(() => originInitData?.data?.images)

			initSound()
			initGame()
		}
	}

	window.addEventListener('message', onMessageListener, false)
})

function sendMessage(message) {
	return window.parent.postMessage(message, '*')
}

const initGame = () => {
	const winBtn = document.getElementById('win-btn')
	const loseBtn = document.getElementById('lose-btn')
	slotContainer.innerHTML = ''

	for (let i = 1; i <= 4; i++) {
		const reelEl = document.createElement('span')
		const charContainer = document.createElement('span')

		reelEl.classList.add('reel')
		reelEl.setAttribute('style', `--reel-num:${i};`)
		charContainer.classList.add('char-container')

		for (const element of initImageListData.toSorted(() => {
			//create a random number from 0 to 1.
			//if number more than 0.5, this func return 2, else -1
			return Math.random() > 0.5 ? 2 : -1
		})) {
			const dummyChar = document.createElement('div')

			dummyChar.classList.add('dummy-char')
			dummyChar.innerHTML = `<img src="${element}" alt="">`

			//step 1
			charContainer.appendChild(dummyChar)
		}

		//step 2
		reelEl.appendChild(charContainer)
		//step 3
		slotContainer.appendChild(reelEl)
	}

	winBtn.addEventListener('click', () => {
		roll(true)
	})
	loseBtn.addEventListener('click', () => {
		roll(false)
	})
}

const roll = (isWin) => {
	const charContainers = document.getElementsByClassName('char-container')
	let randomIndexArray = []

	randomIndexArray = Array.from({ length: charContainers.length }, () => Math.floor(Math.random() * 50))

	for (let i = 0; i < charContainers.length; i++) {
		const charContainer = charContainers[i]
		const dummyChar = document.createElement('div')
		dummyChar.classList.add('dummy-char')

		if (isWin) {
			dummyChar.innerHTML = `<img src="${initImageListData[randomIndexArray[0]]}" alt="">`
			charContainer.appendChild(dummyChar)
		}

		charContainer.style.animation = `roll ${animationDuration / 1000}s cubic-bezier(.52, .1, .18, .91) forwards`
		charContainer.style.animationDelay = `calc(${i + 1} * 0.3s)`
	}

	setTimeout(() => {
		if (isWin) {
			onWinning()
      setTimeout(() => {
        initGame()
      }, 500);
		} else {
      setTimeout(() => {
        initGame()
      }, 500);
			onLosing()
		}
	}, animationDuration + 2000)
}

const initSound = () => {
	document.getElementById('sound-container').innerHTML = `
	<audio src="${originInitData?.data?.sounds?.confettiSound}" id="confetti-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.data?.sounds?.selectCardSound}" id="select-card-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.data?.sounds?.backSound}" id="game-back-sound" type="audio/mpeg" loop autoplay></audio>
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

const onWinning = () => {
	setTimeout(shootConfetties, 100)
	confettiSoundPlay()
	setTimeout(() => {
		// alert('You Win')
		sendMessage(winningContent)
	}, 500)
}
const onLosing = () => {
	setTimeout(() => {
		// alert('You Lose')
		sendMessage(losingContent)
	}, 500)
}
