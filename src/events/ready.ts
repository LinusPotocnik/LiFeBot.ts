import { Client, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

type CommandInfo = RESTPostAPIChatInputApplicationCommandsJSONBody;

export function eventHandler(client: Client) {
  client.once('ready', (client) => ready(client));
}

function ready(client: Client) {
  const commandsArray: CommandInfo[] = [];

  const commandsPath = path.join(__dirname, 'interactions', 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

  commandFiles.forEach((file) => {
    const commandPath = path.join(commandsPath, file);
    const commandModule = require(commandPath);

    if (typeof commandModule.create !== 'function') {
      console.error(`${file} does not provide a create function!`);
      return;
    }

    commandsArray.push(commandModule.create() as CommandInfo);
  });

  if (process.env.MODE === 'DEV')
    client.application!.commands.set(commandsArray, process.env.GUILDID!);
  else client.application!.commands.set(commandsArray);

  console.log(`Successfully logged in as ${client.user?.tag}`);
}
