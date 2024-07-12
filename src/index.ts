import { Client, GatewayIntentBits } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    status: 'dnd',
  },
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath, { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name);

eventFiles.forEach((file) => {
  const eventPath = path.join(eventsPath, file);
  const eventModule = require(eventPath);

  if (typeof eventModule.eventHandler !== 'function') {
    console.error(`${file} does not provide an eventHandler function!`);
    return;
  }

  eventModule.eventHandler(client);
});

client.login(process.env.DISCORD_TOKEN!);
