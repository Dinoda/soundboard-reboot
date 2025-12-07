import { SlashCommandBuilder } from 'discord.js';


export default class Command {
	constructor(name, description, shortName = null, execute = null) {
		if (typeof shortName === "function") {
			execute = shortName;
			shortName = null;
		}

		this.name = name;
		this.description = description;
		this.shortName = shortName;

		this.command = this.build(name, description);

		if (this.shortName) {
			this.shortCommand = this.build(this.shortName, `Short version of command "${name}"`);
		}

		if (execute) {
			this.execute = execute;
		}
	}

	is(name) {
		return name ? name == this.name || name == this.short : false;
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}

	build(name, description) {
		const builder = new SlashCommandBuilder();

		builder.setName(name).setDescription(description);

		return builder;
	}

	addStringOption(name, description, options = {}) {
		console.log(this);
		this.__addStringOption(this.command, name, description, options);

		if (this.shortCommand) {
			this.__addStringOption(this.shortCommand, name, description, options);
		}
	}

	__addStringOption(cmd, name, description, options) {
		console.log(cmd);
		cmd.addStringOption(opt => {
			opt.setName(name)
				.setDescription(description)
				.setRequired(!!options.required)
			;

			if (options.autocomplete) {
				opt.setAutocomplete(true);

				this.autocomplete[name] = options.autocomplete;
			}

			return opt;
		});
	}

	restCall() {
		if (this.shortCommand) {
			return [
				this.command.toJSON(),
				this.shortCommand.toJSON(),
			];
		}

		return [
			this.command.toJSON(),
		];
	}

	setExecute(execute) {
		this.execute = execute;
	}

	async execute(client, interaction) {
		await interaction.reply('This looks like it was not implemented correctly by your dev... What a dick !');
	}
}
