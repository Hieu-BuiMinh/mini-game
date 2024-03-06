import { AlignText } from './constants.js'

export const prop = {
  sounds: {
    confettiSound: './assets/sound/confetties_sound.mp3',
    selectCardSound: './assets/sound/select_sound.mp3',
    backSound: './assets/sound/game_backsound.mp3',
  },
	wheelConfig: {
		name: 'Workout',
		radius: 0.84,
		itemLabelRadius: 0.93,
		itemLabelRadiusMax: 0.35,
		itemLabelRotation: 180,
		itemLabelAlign: AlignText.left,
		itemLabelColors: ['#fff'],
		itemLabelBaselineOffset: -0.07,
		itemLabelFont: 'Tilt Neon',
		itemLabelFontSizeMax: 40,
		itemBackgroundColors: ['#ffc93c', '#66bfbf', '#a2d5f2', '#515070', '#43658b', '#ed6663', '#d54062'],
		rotationSpeedMax: 500,
		rotationResistance: -100,
		lineWidth: 1,
		lineColor: '#fff',
		// image: './assets/img/example-0-image.svg', //center
		image: './assets/img/example-0-image.svg', //center
		overlayImage: './assets/img/example-0-overlay.svg', // border,
		isInteractive: false,
		items: [
			{
				label: '$0',
			},
			{
				label: '$10',
			},
			{
				label: '$20',
			},
			{
				label: '$30',
			},
			{
				label: '$40',
			},
			{
				label: '$50',
			},
			{
				label: '$60',
			},
			{
				label: '$70',
			},
			{
				label: '$80',
			},
			{
				label: '$90',
			},
			{
				label: '$100',
			},
			{
				label: '$110',
			},
			{
				label: '$120',
			},
			{
				label: '$130',
			},
		],
	},
}
