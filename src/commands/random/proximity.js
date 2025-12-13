import { diceCoefficient } from 'dice-coefficient';

import resources from '../../audio/resources.js';
import { randomLogReverse } from './random.js';

class Proximity {
	constructor(str) {
		this.search = str;
		this.best = 0;
		this.values = [];
	}

	add(value, data) {
		const coeff = diceCoefficient(this.search, value) * value.length;

		this.values.push({ coeff, data });

		if (coeff > this.best) {
			this.best = coeff;
		}
	}

	getResources() {
		if (! this.filtered) {
			return this.getFiltered();
		}

		return this.filtered;
	}

	lastStep() {
		this.sorted = true;

		this.values.sort((a, b) => {
			return b.coeff - a.coeff;
		});
	}

	getRandom() {
		return randomLogReverse(this.values).data;
	}
}

const proximities = {};

export default (str, resources) => {
	str = str.toLowerCase();

	if (! proximities[str]) {
		const p = new Proximity(str);

		for (const res of resources) {
			console.log(res);
			p.add(res.name, res);
		}

		p.lastStep();

		console.log(p.values);

		proximities[str] = p;
	}

	return proximities[str].getRandom();
}

