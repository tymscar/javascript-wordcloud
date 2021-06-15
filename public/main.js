import Topic from './modules/topic.js';
import Cloud from './modules/cloud.js';

const fontSlider = document.getElementById('fontSlider');
const paddingSlider = document.getElementById('paddingSlider');
const canvas = document.getElementById('cloudCanvas');

const getTopicsJson = async (URL) => {
	const topicsResponse = await fetch(URL);
	const topicsJson = await topicsResponse.json();
	const topics = topicsJson['topics'];
	return topics;
};

getTopicsJson('topics.json').then((topicsJson) => {
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

	topics.sort((a, b) => (a.value > b.value ? 1 : -1));
	for (let i = 0; i < topics.length; i++) {
		topics[i].textSize = i / (topics.length / 6) + 1;
	}

	const currentCloud = new Cloud(topics, canvas, fontSlider, paddingSlider);

	currentCloud.orderCloud();
});
