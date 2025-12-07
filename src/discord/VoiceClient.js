import DiscordClient from './Client.js';

import { Events } from 'discord.js';

import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } from '@discordjs/voice';

import { VoiceChannelConnectionError, UserCommandError } from './error/ClientError.js';


export default class VoiceDiscordClient extends DiscordClient {
	static INTENTS = [
		"Guilds",
		"GuildVoiceStates",
	];

	constructor(token, clientId, intents = VoiceDiscordClient.INTENTS) {
		super(token, clientId, intents);

		this.voiceChannels = {};
		this.audioPlayers = {};

		this.client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
			if (oldState && oldState.channelId) {
				console.log("VoiceClient:24", oldState);
				await this.checkVoiceChannel(oldState.channelId);
			}
		});
	}

	async getChannel(id) {
		return await this.client.channels.fetch(id);
	}

	// Voice Connection Management //
	// =========================== //

	async checkVoiceChannel(id) {
		const vc = this.voiceChannels[id];
		const channel = await this.getChannel(id);

		console.log("VoiceClient:41", channel);
		// Is connected in the voice channel and is alone in it
		if (vc && channel.members && channel.members.size == 1) {
			vc.destroy();
			this.audioPlayers[id].stop();
		}
	}

	connectToVoiceChannel(channel) {
		const id = channel.id;

		try {
			const vc = joinVoiceChannel({
				channelId: id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			const ap = createAudioPlayer();

			vc.subscribe(ap);

			this.voiceChannels[id] = vc;
			this.audioPlayers[id] = ap;
		} catch (err) {
			console.error(err);
			throw new VoiceChannelConnectionError(`Failed to join the voice channel "${id}"`);
		}
	}

	playInVoiceChannel(channel, audio) {
		console.log(channel.id);
		console.log(this.voiceChannels);
		console.log(this.audioPlayers);
		const player = this.audioPlayers[channel.id];

		console.log(player);
		if (! player) {
			throw new UserCommandError();
		}

		console.log(audio);
		player.play(createAudioResource(audio));
	}
}
