import { confettiSoundPlay, shootConfetties } from './confetti.js'
import { losingModalCotent, winningModalCotent } from './modal.js'

const winningContent = winningModalCotent()
const losingContent = losingModalCotent()

let originInitData = null
let initImageListData = null
let selectCardElSound = null
let backsoundElSound = null

let GameFakeData = {
	// 3x2 => 03 img | 3x4 => 06 img
	// 4x4 => 08 img | 4x3 => 06 img | 4x5 => 10 img
	// 5x4 => 10 img | 5x6 => 15 img
	// 6x5 => 15 img
	data: {
		col: 4,
		row: 5,
		cel: 20,
		logo: 'https://i.postimg.cc/V64z86jz/logo.png',
		background: 'https://cdn-icons-png.flaticon.com/256/14699/14699677.png',
		sounds: {
			confettiSound: './assets/sound/confetties_sound.mp3',
			selectCardSound: './assets/sound/select_sound.mp3',
			backSound: './assets/sound/game_backsound.mp3',
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
// You can use the data returned by these functions as needed.

///=========================
///Next js - index.js comunicator
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')

	//// dev initial data
	// originInitData = GameFakeData
	// initImageListData = GameFakeData?.data?.images?.flatMap((item) => [item, item])

	// initSound()
	// initGame()

	// set backsound mp3
	// document.querySelector('#game-back-sound')?.play()

	const onMessageListener = (event) => {
		if (event?.data?.messageType === 'NEXT_JS_MESSAGE') {
			console.log('index js log: ', event?.data)
			//// Next js init data here
			originInitData = event.data
			initImageListData = originInitData?.data?.images?.flatMap((item) => [item, item])

			initSound()
			initGame()

			// set backsound mp3
			// document.querySelector('#game-back-sound')?.play()
		}
	}

	window.addEventListener('message', onMessageListener, false)
})

function sendMessage(message) {
	return window.parent.postMessage(message, '*')
}
///==========================
let timerInterval
let playTime = 2 // => 0.5 = 30s
let endGame = false
const gameElement = document.querySelector('#flip-card-game')

const emojis = [
	'🍕',
	'🍕',
	'🍔',
	'🍔',
	'🍖',
	'🍖',
	'🍧',
	'🍧',
	'🍩',
	'🍩',
	'🎄',
	'🎄',
	'🎃',
	'🎃',
	'💎',
	'💎',
	'⏰',
	'⏰',
	'🚀',
	'🚀',
]

const initGame = () => {
	let ImageListData = initImageListData?.length > 0 ? initImageListData : emojis

	gameElement.innerHTML = ''
	document.querySelector('#reset-btn').addEventListener('click', restartGame)
	initGridTemplateColums() // grid columns

	let shuf_images = ImageListData.toSorted(() => {
		//create a random number from 0 to 1.
		//if number more than 0.5, this func return 2, else -1
		return Math.random() > 0.5 ? 2 : -1
	})

	return ImageListData.map((_, i) => {
		let card = document.createElement('div')
		let cardInner = document.createElement('div')
		let cardFront = document.createElement('img')
		let cardBack = document.createElement('img')

		card.className = 'card'
		card.classList.add('card--foo')
		cardInner.className = 'card--inner'
		cardFront.className = 'card--front'
		cardBack.className = 'card--back'
		cardBack.setAttribute('src', shuf_images[i])
		cardBack.setAttribute('alt', 'img-card')

		card.appendChild(cardInner)
		cardInner.appendChild(cardFront)
		cardInner.appendChild(cardBack)

		cardFront.setAttribute('src', originInitData?.data?.logo)
		cardFront.setAttribute('alt', 'logo-img')

		card.setAttribute('id', 'card_no.' + i)

		card.onclick = () => {
			if (endGame) return

			if (selectCardElSound) {
				selectCardElSound?.play()
			}

			// close card if double clicked
			if (card.classList.value.includes('card--opened')) {
				card.classList.remove('card--opened')
				return
			}

			// open card if first time clicked
			card.classList.add('card--opened')

			// get list card opened
			let opendItems = document.querySelectorAll('.card--opened')

			// compair 2 opened items in list
			if (opendItems?.length >= 2) {
				setTimeout(() => {
					if (opendItems[0].innerHTML === opendItems[1].innerHTML) {
						opendItems[0].classList.add('card--match')
						opendItems[1].classList.add('card--match')
						opendItems[0].classList.remove('card--opened')
						opendItems[1].classList.remove('card--opened')

						if (document.querySelectorAll('.card--match')?.length === ImageListData.length) {
							onWinning()
						}
					} else {
						opendItems[0].classList.remove('card--opened')
						opendItems[1].classList.remove('card--opened')
					}
				}, 500)
			}
		}

		gameElement.appendChild(card)
		if (i === ImageListData.length - 1) {
			setTimeout(() => {
				initTimer(playTime)
			}, 2000)
		}
		return null
	})
}
const onWinning = () => {
	endGame = true
	setTimeout(shootConfetties, 100)
	confettiSoundPlay()
	setTimeout(() => {
		// alert('You Win')
		console.log(winningContent)
		sendMessage(winningContent)
	}, 500)
}
const onLosing = () => {
	endGame = true
	setTimeout(() => {
		// alert('You Lose')
		sendMessage(losingContent)
	}, 500)
}
const restartGame = () => {
	clearInterval(timerInterval)
	endGame = false
	initGame()
}

const initTimer = (defaultMinutes) => {
	if (defaultMinutes > 60) return

	let minuteElement = document.getElementById('minute')
	let secondElement = document.getElementById('second')

	let minutes = Math.floor(defaultMinutes)
	let seconds = (defaultMinutes - minutes) * 60
	let totalSeconds = minutes * 60 + seconds

	const handleSetInnerTimer = (min, sec) => {
		minuteElement.innerHTML = min < 10 ? '0' + min : min
		secondElement.innerHTML = sec < 10 ? '0' + sec : sec
	}

	handleSetInnerTimer(minutes, seconds)

	const updateTimer = () => {
		if (endGame) {
			clearInterval(timerInterval)
			return
		}
		if (totalSeconds > 0) {
			const min = Math.floor(totalSeconds / 60)
			const sec = totalSeconds % 60
			handleSetInnerTimer(min, sec)
			totalSeconds--
		} else {
			endGame = true
			handleSetInnerTimer(0, 0)
			clearInterval(timerInterval)
			onLosing()
		}
	}

	// Update the timer every second
	clearInterval(timerInterval)
	timerInterval = setInterval(updateTimer, 1000)
}

const initSound = () => {
	document.getElementById('sound-container').innerHTML = `
	<audio src="${originInitData?.data?.sounds?.confettiSound}" id="confetti-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.data?.sounds?.selectCardSound}" id="select-card-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.data?.sounds?.backSound}" id="game-back-sound" type="audio/mpeg" loop autoplay></audio>
	`

	selectCardElSound = document.getElementById('select-card-sound')
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

const initGridTemplateColums = () => {
	document.getElementById('flip-card-game').style.gridTemplateColumns = `repeat(${
		originInitData?.data?.col ?? 5
	}, min(60px))`
}
