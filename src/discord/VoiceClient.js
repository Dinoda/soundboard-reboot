import DiscordClient from './Client.js';

import { joinVoiceChannel, createAudioResource, VoiceConnectionStatus } from '@discordjs/voice';

import { VoiceChannelConnectionError } from './error/ClientError.js';


export default class VoiceDiscordClient extends DiscordClient {
	static INTENTS = [
		"Guilds",
		"GuildVoiceStates",
	];

	constructor(token, clientId, intents = VoiceDiscordClient.INTENTS) {
		super(token, clientId, intents);

		this.voiceChannels = {};
		this.audioPlayers = {};

		this.client.on('VoiceStateUpdate', async (client, oldState, newState) => {
			if (oldState) {
				await this.checkVoiceChannel(oldState.channelId);
			}
		});
	}

	getChannel(id) {
		return this.client.channels.fetch(id);
	}

	// Voice Connection Management //
	// =========================== //

	async checkVoiceChannel(id) {
		const vc = this.voiceChannels[id];
		const channel = await this.client.getChannel(id);

		// Is connected in the voice channel and is alone in it
		if (vc && channel.members.size == 1) {
			vc.destroy();
			this.audioPlayers[id].stop();
		}
	}

	connectToVoiceChannel(channel) {
		const id = channel.id;

		try {
			const vc = joinChoiceChannel({
				channelId: id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			const ap = createAudioPlayer();

			vc.subscribe(ap);

			this.voiceChannels[id] = vc;
			this.audioPlayers[id] = ap;
		} catch (err) {
			console.log(channel);
			console.error(err);
			throw new VoiceChannelConnectionError(`Failed to join the voice channel "${id}"`);
		}
	}

	playInVoiceChannel(channel, audio) {
		const player = this.audioPlayers[channel.id];

		if (! player) {
			throw new UserCommandError();
		}

		player.play(createAudioResource(audio));
	}
}
