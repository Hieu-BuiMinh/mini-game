import { confettiSoundPlay, shootConfetties } from './confetti.js'
import { losingModalCotent, winningModalCotent } from './modal.js'
import { initInteractDraggableItem, initInteractDropZone, setDropZonesDisable } from './drag-drop.js'

const winningContent = winningModalCotent()
const losingContent = losingModalCotent()

let originInitData = null
let backsoundElSound = null

let answersCount = 0

const GameFakeData = {
	data: {
		sounds: {
			confettiSound: './assets/sound/confetties_sound.mp3',
			backSound: './assets/sound/game_backsound.mp3',
		},
		payload: {
			quizs: [
				{ fallback: './assets/img/empty.png', brand: 'Phuc Long', id: 'phuc-long' },
				{ fallback: './assets/img/empty.png', brand: 'Starbucks', id: 'starbucks' },
				{ fallback: './assets/img/empty.png', brand: 'HighLand', id: 'highland' },
			],
			answers: [
				{ fallback: './assets/img/phuc-long.png', brand: 'Phuc Long', id: 'phuc-long' },
				{ fallback: './assets/img/react-js.png', brand: 'ReactJs', id: 'react-js' },
				{ fallback: './assets/img/starbucks.png', brand: 'Starbucks', id: 'starbucks' },
				{ fallback: './assets/img/next-js.png', brand: 'NextJs', id: 'next-js' },
				{ fallback: './assets/img/highland.png', brand: 'HighLand', id: 'highland' },
			],
		},
	},
}

document.addEventListener('DOMContentLoaded', () => {
	// initInteractDraggableItem()
	// initInteractDropZone(compairItems)

	// initSound()
	// initGame()

	const onMessageListener = (event) => {
		if (event?.data?.messageType === 'NEXT_JS_MESSAGE') {
			console.log('index js log: ', event?.data)
			initInteractDraggableItem()
			initInteractDropZone(compairItems)
			//// Next js init data here
			originInitData = event.data

			initSound()
			initGame()
		}
	}

	window.addEventListener('message', onMessageListener, false)
})

const initGame = () => {
	setDropZonesDisable()
	answersCount = originInitData.data.payload.quizs.length
	localStorage.setItem('answersCount', answersCount)

	const itemContainer = document.getElementsByClassName('item-container')[0]
	const dropArea = document.getElementsByClassName('drop-area')[0]

	itemContainer.innerHTML = ''
	dropArea.innerHTML = ''
	dropArea.innerHTML = `
    <button type="button" id="reset-game">
      <i class="ri-refresh-line"></i>
    </button>
  `

	const resetgame = document.getElementById('reset-game')
	resetgame.addEventListener('click', () => {
		initGame()
	})

	for (const answer of originInitData.data.payload.answers) {
		const answerImgEl = document.createElement('img')
		answerImgEl.className = 'item draggable yes-drop'
		answerImgEl.setAttribute('src', answer.fallback)
		answerImgEl.setAttribute('id', answer.id)

		itemContainer.appendChild(answerImgEl)
	}

	for (const quiz of originInitData.data.payload.quizs) {
		const brandDrop = document.createElement('div')
		brandDrop.className = 'brand-drop'
		brandDrop.innerHTML = `
        <img src=${quiz.fallback} alt="" class="dropzone img-dropzone" id=${quiz.id}>
        <p>${quiz.brand}</p>`

		dropArea.appendChild(brandDrop)
	}
}

const compairItems = () => {
	let isWin = true
	const userAnswerList = document.getElementsByClassName('img-dropzone')
	// document.getElementById('reset-game').style.display = 'none'

	for (let i = 0; i < userAnswerList.length; i++) {
		if (userAnswerList[i].getAttribute('id') !== originInitData.data.payload.quizs[i].id) {
			isWin = false
			break
		}
	}
	for (let i = 0; i < userAnswerList.length; i++) {
		if (userAnswerList[i].getAttribute('id') !== originInitData.data.payload.quizs[i].id) {
			userAnswerList[i].style.border = '1px dashed #e36b6b'
			userAnswerList[i].style.background = '#ffa5a5'
		} else {
			userAnswerList[i].style.border = '1px dashed #41a917'
			userAnswerList[i].style.background = '#d9ffd9'
		}
	}

	if (isWin) {
		onWinning()
	} else {
		onLosing()
	}
}

function sendMessage(message) {
	return window.parent.postMessage(message, '*')
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
