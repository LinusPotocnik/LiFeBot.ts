import { ChatInputCommandInteraction, Client, Interaction } from 'discord.js';
import * as path from 'path';

export function eventHandler(client: Client) {
  client.on('interactionCreate', (interaction) => interactionCreate(interaction));
}

function interactionCreate(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    chatInputCommand(interaction);
  }
}

function chatInputCommand(interaction: ChatInputCommandInteraction) {
  const commandPath = path.join(__dirname, 'interactions', 'commands', interaction.commandName);
  const commandModule = require(commandPath);

  if (typeof commandModule.execute !== 'function') {
    console.error(`${interaction.commandName} does not provide an execute function!`);
    return;
  }

  commandModule.execute(interaction);
}
