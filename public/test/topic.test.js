import { expect, test } from '@jest/globals';
import Topic from '../modules/topic';

test('distant topics should not intersect', () => {
	const topicOne = new Topic('', '', '', {});
	topicOne.left = -100;
	topicOne.down = -100;
	topicOne.width = 10;
	topicOne.height = 10;

	const topicTwo = new Topic('', '', '', {});
	topicTwo.left = 100;
	topicTwo.down = 100;
	topicTwo.width = 10;
	topicTwo.height = 10;

	expect(topicOne.intersects(topicTwo)).toBe(false);
});

test('overlapping topics should intersect', () => {
	const topicOne = new Topic('', '', '', {});
	topicOne.left = 0;
	topicOne.down = 0;
	topicOne.width = 10;
	topicOne.height = 10;

	const topicTwo = new Topic('', '', '', {});
	topicTwo.left = 5;
	topicTwo.down = 5;
	topicTwo.width = 10;
	topicTwo.height = 10;

	expect(topicOne.intersects(topicTwo)).toBe(true);
});

test('point overlapping a topic should be contained by said topic', () => {
	const topic = new Topic('', '', '', {});
	topic.left = 10;
	topic.down = 10;
	topic.width = 10;
	topic.height = 10;

	const point = [15, 8];

	expect(topic.contains(point)).toBe(true);
});

test('a point should not overlap a distant topic', () => {
	const topic = new Topic('', '', '', {});
	topic.left = 10;
	topic.down = 10;
	topic.width = 10;
	topic.height = 10;

	const point = [1500, 80];

	expect(topic.contains(point)).toBe(false);
});
