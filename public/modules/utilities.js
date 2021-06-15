import Topic from './topic.js';

const getTopicsJson = async (URL) => {
	const topicsResponse = await fetch(URL);
	const topicsJson = await topicsResponse.json();
	const topics = topicsJson['topics'];
	return topics;
};

export const getListOfTopics = async (fromUrl) => {
	const topicsJson = await getTopicsJson(fromUrl);
	const topics = [];

	topicsJson.forEach((topicJson) => {
		topics.push(
			new Topic(
				topicJson['label'],
				topicJson['volume'],
				topicJson['sentimentScore'],
				topicJson['sentiment']
			)
		);
	});

	return topics;
};

export const populateTopicsWithSize = (topics) => {
	topics.sort((a, b) => (a.value > b.value ? 1 : -1));
	for (let i = 0; i < topics.length; i++) {
		topics[i].textSize = i / (topics.length / 6) + 1;
	}
	return topics;
};

export const downloadButtonHandler = (cloud) => {
	const img = cloud.canvas.toDataURL('image/png');
	document.write('<img src="' + img + '"/>');
};

export const windowResizeHandler = (cloud) => {
	cloud.canvas.width = window.innerWidth * cloud.canvasToWindowRatio;
	cloud.canvas.height = cloud.canvas.width * 0.5625;
	cloud.orderCloud();
};

export const mouseClickHandler = (event, cloud) => {
	const topicHeader = document.getElementById('topicHeader');
	const totalParagraph = document.getElementById('totalParagraph');
	const positiveParagraph = document.getElementById('positiveParagraph');
	const neutralParagraph = document.getElementById('neutralParagraph');
	const negativeParagraph = document.getElementById('negativeParagraph');
	var cRect = cloud.canvas.getBoundingClientRect();
	var canvasX = Math.round(event.clientX - cRect.left);
	var canvasY = Math.round(event.clientY - cRect.top);
	cloud.topics.forEach((topic) => {
		if (
			topic.contains([
				canvasX - cloud.drawingOffset[0],
				canvasY - cloud.drawingOffset[1],
			])
		) {
			topicHeader.innerHTML = `Information on topic "${topic.label}":`;
			totalParagraph.innerHTML = `Total Mentions: ${topic.volume}`;
			positiveParagraph.innerHTML = `Positive Mentions: <span style="color: green">${topic.sentiment['positive']}</span>`;
			neutralParagraph.innerHTML = `Neutral Mentions: <span style="color: black">${topic.sentiment['neutral']}</span>`;
			negativeParagraph.innerHTML = `Negative Mentions: <span style="color: red">${topic.sentiment['negative']}</span>`;
		}
	});
};

export const fontSliderChangeHandler = (cloud) => {
	cloud.fontSize = cloud.fontSlider.value;
	cloud.orderCloud();
};

export const paddingSliderChangeHandler = (cloud) => {
	cloud.padding = cloud.paddingSlider.value;
	cloud.orderCloud();
};
