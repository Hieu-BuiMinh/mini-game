const answersCount = JSON.parse(localStorage.getItem('answersCount'))
let dropZonesDisable = 0

const initInteractDraggableItem = () => {
	interact('.draggable').draggable({
		listeners: {
			move: dragMoveListener,

			end(event) {
				let target = event.target
				target.style.transform = 'translate(0px, 0px)' // Move it back to its original position
				target.style.zIndex = 9
				target.setAttribute('data-x', 0)
				target.setAttribute('data-y', 0)
			},
		},
	})
}

const initInteractDropZone = (callback) => {
	interact('.dropzone').dropzone({
		accept: '.yes-drop',
		overlap: 0.5,

		ondrop: function (event) {
			let target = event.target
			let relatedTarget = event.relatedTarget

			target.setAttribute('src', relatedTarget.getAttribute('src'))
			target.setAttribute('id', relatedTarget.getAttribute('id'))

			target.classList.remove('dropzone')

			relatedTarget.classList.remove('draggable')
			relatedTarget.style.zIndex = 9

			event.relatedTarget.textContent = 'Dropped'

			dropZonesDisable++

			if (dropZonesDisable === answersCount) {
				callback()
				setDropZonesDisable()
			}
		},
	})
}

const dragMoveListener = (event) => {
	let target = event.target
	let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
	let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

	target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
	target.style.zIndex = 99

	target.setAttribute('data-x', x)
	target.setAttribute('data-y', y)
}

const setDropZonesDisable = () => {
	dropZonesDisable = 0
}

export { initInteractDraggableItem, initInteractDropZone, setDropZonesDisable }
