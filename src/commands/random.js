import Command from '../discord/Command.js';

import random from './random/random.js';
import audioResources from '../audio/resources.js';

const cmd = new Command('random', 'Plays a random quote of the bot', 'r', async (client, interaction) => {
	const member = interaction.member;
	const search = interaction.options.getString('search');

	const audio = search ? proximity(search, audioResources) : random(audioResources);

	console.log(audio);
	client.play(interaction, audio.file);
	await interaction.reply(audio.name);
});

cmd.addStringOption('search', 'A search string');

export default cmd;
