import { expect, test } from '@jest/globals';
import { populateTopicsWithSize } from '../modules/utilities';

test('properly populates topic sizes based on value', () => {
	const mockTopics = [
		{ value: 1 },
		{ value: 231321 },
		{ value: 12 },
		{ value: 9 },
		{ value: 2 },
		{ value: 2222 },
	];
	populateTopicsWithSize(mockTopics);
	expect(mockTopics).toEqual([
		{ value: 1, textSize: 1 },
		{ value: 2, textSize: 2 },
		{ value: 9, textSize: 3 },
		{ value: 12, textSize: 4 },
		{ value: 2222, textSize: 5 },
		{ value: 231321, textSize: 6 },
	]);
});
