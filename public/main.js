import {
	getListOfTopics,
	populateTopicsWithSize,
} from './modules/utilities.js';
import Cloud from './modules/cloud.js';

const fontSlider = document.getElementById('fontSlider');
const paddingSlider = document.getElementById('paddingSlider');
const canvas = document.getElementById('cloudCanvas');

getListOfTopics('topics.json').then((topics) => {
	populateTopicsWithSize(topics);
	const wordcloud = new Cloud(topics, canvas, fontSlider, paddingSlider);

	wordcloud.orderCloud();
});
