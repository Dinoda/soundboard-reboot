import Command from '../discord/Command.js';

import { UserCommandError } from '../discord/error/ClientError.js';

export default new Command("join", "Ask the bot to join your channel", "j", (client, interaction) => {
	const member = interaction.member;

	if (member && member.voice?.channel) {
		client.connectToVoiceChannel(member.voice.channel);
	} else {
		throw new UserCommandError("Can't ask the bot to join your channel when you're in none");
	}
});

