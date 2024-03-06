const scalar = 2
const unicorn = confetti.shapeFromText({ text: '🦄', scalar })
const defaults = {
	spread: 360,
	ticks: 50,
	gravity: 0,
	decay: 0.94,
	startVelocity: 30,
	colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
}

function shootConfetties() {
	confetti({
		...defaults,
		particleCount: 40,
		scalar: 1.2,
		shapes: ['star'],
	})

	confetti({
		...defaults,
		particleCount: 10,
		scalar: 0.75,
		shapes: ['circle'],
	})

	confetti({
		...defaults,
		particleCount: 30,
		scalar: 3.5,
		shapes: [unicorn],
	})
}

function confettiSoundPlay() {
	const confettiSoundEl = document.getElementById('confetti-sound')
	confettiSoundEl?.play()
}

// usage
// setTimeout(shootConfetties, 0);
// setTimeout(shootConfetties, 100);
// setTimeout(shootConfetties, 200);

export { confettiSoundPlay, shootConfetties }
