import { clientList } from '../discord/Client.js';

const on = (sign) => {
	console.log(`Received "${sign}", starting killing process...`);

	const all = clientList.map(c => {
		if (! c.client.user) {
			return;
		}
		
		const tag = c.client.user.tag;

		return c.destroy().then(() => {
			console.log(`Client "${tag}" properly closed.`);
		});
	});

	Promise.all(all).then(() => {
		console.log(`Properly killed all clients. Shutting down discord bot...`);

		if (sign instanceof Error) {
			console.error(sign.stack);
			process.exit(-1);
		}

		process.exit(0);
	});
};

export default (killOn = 'SIGINT') => {
	process.on(killOn, on);
};
