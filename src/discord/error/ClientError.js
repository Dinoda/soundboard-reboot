export class DiscordClientError extends Error {}

export class VoiceChannelError extends DiscordClientError {}

export class VoiceChannelConnectionError extends VoiceChannelError {}

export class UserCommandError extends DiscordClientError {}
