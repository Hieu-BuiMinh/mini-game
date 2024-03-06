const windowWidth = window.innerWidth
const gameContainer = document.getElementById('flip-card-game')

window.addEventListener('resize', () => {
	const windowWidth = window.innerWidth
	const gameContainer = document.getElementById('flip-card-game')

	if (windowWidth <= gameContainer.offsetWidth) {
		gameContainer.style.zoom = (0.7 * windowWidth) / 320
	} else {
		gameContainer.style.zoom = 1
	}
})

if (windowWidth <= gameContainer.offsetWidth || windowWidth <= 320) {
	gameContainer.style.zoom = (0.7 * windowWidth) / 320
} else {
	gameContainer.style.zoom = 1
}
