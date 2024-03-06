import { Wheel } from '../dist/spin-wheel-esm.js'
import { prop } from './props.js'
import { loadFonts } from './util.js'

import { confettiSoundPlay, shootConfetties } from './confetti.js'
import { losingModalCotent, winningModalCotent } from './modal.js'

const winningContent = winningModalCotent()
const losingContent = losingModalCotent()

let originInitData = null
let selectCardElSound = null
let backsoundElSound = null

window.onload = () => {
	const onMessageListener = async (event) => {
		if (event?.data?.messageType === 'NEXT_JS_MESSAGE') {
			console.log('index js log: ', event?.data)
			//// Next js init data here
			originInitData = event?.data
			await loadFonts(event?.data?.itemLabelFont)
			init()
			initSound()
		}
	}

	window.addEventListener('message', onMessageListener, false)

	;async () => await loadFonts(prop.wheelConfig.itemLabelFont)
	originInitData = prop
	init()
	initSound()
}

function init() {
	const wheel = new Wheel(document.querySelector('.wheel-wrapper'))
	const spinButtonWin = document.getElementById('spin-wheel-btn--win')
	const spinButtonLose = document.getElementById('spin-wheel-btn--lose')

	wheel.init({
		...prop.wheelConfig,
		rotation: wheel.rotation,
	})

	spinButtonWin.addEventListener('click', () => {
		const itemIndex = 10
		const duration = 5000
		const spinToCenter = false
		const numberOfRevolutions = 2 // how many times the wheel will rotate === speed up

		wheel.spinToItem(itemIndex, duration, spinToCenter, numberOfRevolutions)

		setTimeout(() => {
			onWinning()
		}, duration + 1000)
	})

	spinButtonLose.addEventListener('click', () => {
		const itemIndex = 0
		const duration = 5000
		const spinToCenter = false
		const numberOfRevolutions = 2 // how many times the wheel will rotate === speed up

		wheel.spinToItem(itemIndex, duration, spinToCenter, numberOfRevolutions)

		setTimeout(() => {
			onLosing()
		}, duration + 1000)
	})
}

function sendMessage(message) {
	return window.parent.postMessage(message, '*')
}

const initSound = () => {
	document.getElementById('sound-container').innerHTML = `
	<audio src="${originInitData?.sounds?.confettiSound}" id="confetti-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.sounds?.backSound}" id="game-back-sound" type="audio/mpeg" loop autoplay></audio>
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
