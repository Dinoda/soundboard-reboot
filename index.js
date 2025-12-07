import 'dotenv/config';

import VoiceClient from './src/discord/VoiceClient.js';
import killOnSignal from './src/os/onKill.js';

import joinCommand from './src/commands/join.js';
import randomCommand from './src/commands/random.js';

killOnSignal();
killOnSignal('uncaughtException');

const client = new VoiceClient(process.env.DISCORD_TOKEN, process.env.DISCORD_CLIENT_ID);

client.addCommand(joinCommand);

client.start();
