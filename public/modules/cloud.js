import {
	downloadButtonHandler,
	windowResizeHandler,
	mouseClickHandler,
	fontSliderChangeHandler,
	paddingSliderChangeHandler,
} from './utilities.js';

class Cloud {
	constructor(topics, canvas, fontSlider, paddingSlider) {
		this.topics = topics;
		this.canvas = canvas;
		this.canvas.addEventListener('click', (event) => {
			mouseClickHandler(event, this);
		});

		this.fontSlider = fontSlider;
		this.fontSlider.oninput = (event) => {
			fontSliderChangeHandler(this);
		};
		this.fontSize = this.fontSlider.value;

		this.paddingSlider = paddingSlider;
		this.paddingSlider.oninput = (event) => {
			paddingSliderChangeHandler(this);
		};
		this.padding = this.paddingSlider.value;

		this.jumpDistance = 5;
		this.drawingOffset = 0;

		this.context = this.canvas.getContext('2d');
		this.canvas.width = document.getElementById('canvas-container').offsetWidth;
		this.canvas.height = this.canvas.width * 0.5625;

		this.canvasToWindowRatio = this.canvas.width / window.innerWidth;

		window.addEventListener('resize', (event) => {
			windowResizeHandler(this);
		});

		document
			.getElementById('download_button')
			.addEventListener('click', (event) => {
				downloadButtonHandler(this);
			});
	}

	drawCloud = () => {
		this.context.fillStyle = '#ffffff';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.topics.forEach((topic) => {
			this.context.fillStyle = '#414a4c';
			if (topic.sentimentScore > 60) this.context.fillStyle = '#007f5c';
			if (topic.sentimentScore < 40) this.context.fillStyle = '#9b111e';
			this.context.font = `${this.fontSize * topic.textSize}px sans serif`;
			this.context.fillText(
				topic.label,
				topic.left + this.drawingOffset[0],
				topic.down + this.drawingOffset[1]
			);
		});
	};

	orderCloud = () => {
		const orderedTopics = [];

		let topmostPos = this.canvas.height;
		let botmostPos = 0;
		let leftmostPos = this.canvas.width;
		let rightmostPos = 0;

		let directionOfDrawing = 0;
		let startPos = [this.canvas.width / 2, this.canvas.height / 2];

		let tilesNotPlaced = 0;

		this.topics.forEach((topic) => {
			this.context.font = `${this.fontSize * topic.textSize}px sans serif`;
			const word = topic.label;
			const currTextSize = this.context.measureText(word);

			topic.padding = this.padding;
			topic.left = startPos[0] - currTextSize.width / 2;
			topic.width = currTextSize.width;
			topic.down =
				startPos[1] +
				currTextSize.actualBoundingBoxAscent / 2 +
				currTextSize.actualBoundingBoxDescent / 2;
			topic.height =
				currTextSize.actualBoundingBoxAscent +
				currTextSize.actualBoundingBoxDescent;

			let directionsTried = 0;
			let canBePlaced = true;

			do {
				canBePlaced = true;

				switch (directionOfDrawing) {
					case 0:
						topic.down -= this.jumpDistance;
						break;
					case 1:
						topic.left += this.jumpDistance;
						break;
					case 2:
						topic.down += this.jumpDistance;
						break;
					case 3:
						topic.left -= this.jumpDistance;
				}

				orderedTopics.forEach((placedTopic) => {
					if (topic.intersects(placedTopic)) {
						canBePlaced = false;
					}
				});

				if (
					topic.left < 0 ||
					topic.left + topic.width > this.canvas.width ||
					topic.down > this.canvas.height ||
					topic.down - topic.height < 0
				) {
					// if the topic is outside of the canvas, reset its position and try again in a different direction
					topic.left = this.canvas.width / 2;
					topic.width = currTextSize.width;
					topic.down = this.canvas.height / 2;
					topic.height =
						currTextSize.actualBoundingBoxAscent +
						currTextSize.actualBoundingBoxDescent;
					canBePlaced = false;
					directionOfDrawing = (directionOfDrawing + 1) % 4;
					directionsTried += 1;
				}
			} while (!canBePlaced && directionsTried < 4);

			orderedTopics.push(topic);

			directionOfDrawing = (directionOfDrawing + 1) % 4;
			startPos = [topic.left, topic.down];
			if (!canBePlaced) {
				tilesNotPlaced++;
			} else {
				// calculate the extremities of the drawing to be able to centre it later on
				if (topic.down + topic.height < topmostPos)
					topmostPos = topic.down + topic.height;
				if (topic.left < leftmostPos) leftmostPos = topic.left;
				if (topic.left + topic.width > rightmostPos)
					rightmostPos = topic.left + topic.width;
				if (topic.down > botmostPos) botmostPos = topic.down;
			}
		});
		if (tilesNotPlaced > 0) {
			// If there is any tile not placed on the screen,
			// lower the padding and font sizes and reorder
			// until you can fit them all
			if (this.padding > 1) {
				this.padding--;
				this.orderCloud();
			} else if (this.fontSize > 5) {
				this.fontSize--;
				this.orderCloud();
			} else {
				console.error(`couldnt fit ${tilesNotPlaced} tiles`);
				this.drawCloud();
			}
		} else {
			const leftGap = leftmostPos;
			const rightGap = this.canvas.width - rightmostPos;
			const leftOffset = (rightGap - (rightGap + leftGap) / 2) / 2;

			const topGap = topmostPos;
			const botGap = this.canvas.height - botmostPos;
			const topOffset = (botGap - (botGap + topGap) / 2) / 2;

			this.drawingOffset = [leftOffset, topOffset]; // How much to offset by to centre the cloud

			this.drawCloud();
		}
	};
}

export default Cloud;
