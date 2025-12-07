import Command from '../discord/Command.js';

import random from './random/random.js';
import proximity from './random/proximity.js';

import audioResources from '../audio/resources.js';

import { UserCommandError } from '../discord/error/ClientError.js';

const cmd = new Command('random', 'Plays a random quote of the bot', 'r', async (client, interaction) => {
	const member = interaction.member;
	const channel = member.voice?.channel;

	if (channel) {
		const search = interaction.options.getString('search');
		const audio = search ? proximity(search, audioResources) : random(audioResources);

		client.playInVoiceChannel(channel, audio.file);
		await interaction.reply(audio.name);
	} else {
		throw new UserCommandError('You must be in a voice channel to use this command');
	}
});

cmd.addStringOption('search', 'A search string');

export default cmd;
