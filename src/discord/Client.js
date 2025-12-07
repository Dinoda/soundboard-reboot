import { Client, GatewayIntentBits, Events, REST, Routes } from 'discord.js';

export const clientList = [];

const DEFAULT_INTENTS = [
	'Guilds',
	'GuildVoiceStates',
];

const STATUS_FAILURE = -2;
const STATUS_DESTROYED = -1;

const STATUS_CREATED = 0;

const STATUS_STARTING = 1;
const STATUS_STARTED = 2;

const STATUS_SHUTTING_DOWN = 10;


export default class DiscordClient {
	
	static DEFAULT_INTENTS = [
		"Guilds"
	];

	static VOICE_INTENTS = [
		"Guilds",
		"GuildVoiceStates",
	];

	constructor(token, clientId, intents = Client.DEFAULT_INTENTS) {
		this.token = token;
		this.id = clientId;
		this.initIntents(intents);

		this.client = new Client({
			intents: this.intents,
		});

		this.commandList = [];
		this.commands = {};

		this.client.on('InteractionCreate', (interaction) => {
			this.interact(interaction);
		});

		this.client.on(Events.ClientReady, (cl) => {
			console.log(`Client running "${cl.user.tag}"`);
			this.status = STATUS_STARTED;
		});

		this.status = STATUS_CREATED;

		clientList.push(this);
	}

	initIntents(intents) {
		this.intents = [];

		for (const intt of intents) {
			this.intents.push(
				GatewayIntentBits[intt] ?? intt
			);
		}
	}

	// Command Management //
	// ================== //
	
	addCommand(command) {
		this.commandList.push(command);
		this.commands[command.name] = command;
		if (command.shortName) {
			this.commands[command.shortName] = command;
		}
	}

	async updateRESTCommands() {
		const rest = new REST({ version: '10' }).setToken(this.token);

		console.log(`Starting command pushing...`);

		const body = this.commandList.reduce((list, cmd) => {
			for (const restcmd of cmd.restCall()) {
				list.push(restcmd);
			}
		}, []);

		await rest.put(Routes.applicationCommands(this.id), {
			body,
		});

		console.log(`Pushed all commands to Discord`);
	}

	// Lifecycle Management //
	// ==================== //
	
	async start() {
		if (this.status == STATUS_CREATED) {
			this.status = STATUS_STARTING;

			await this.updateRESTCommands();

			this.client.login(this.token).then(() => {
				this.status = STATUS_STARTED;
			}).catch((err) => {
				this.status = STATUS_FAILURE;

				console.error(err);
			});
		}
	}

	async destroy() {
		if (this.status != STATUS_DESTROYED && this.status != STATUS_SHUTTING_DOWN) {
			this.status = STATUS_SHUTTING_DOWN;

			await this.client.destroy().then(() => {
				this.status = STATUS_DESTROYED;
			});
		}
	}

	// Interaction management //
	// ====================== //

	async interact(interaction) {
		if (interact.isChatInputCommand()) {
			const cmd = this.commands[interaction.commandName];

			console.log(`Received command: "${cmd.name}"`);

			await this.callCommand(cmd, interaction);

			if (interaction && ! interaction.replied) {
				await interaction.reply(`Command executed without reply`);
			}
		}
	}

	async callCommand(cmd, interaction) {
		await cmd.execute(this, interaction);
	}
}
