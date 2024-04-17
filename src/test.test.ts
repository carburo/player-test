import {test} from 'node:test';
import {video} from './napoleon';
import {transform} from './schemaTransform';

test('Transform to frames', () => {
	const result = transform(video);
	console.log(result);
});
