import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from 'discord.js';

export function create(): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const command = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin')
    .setDMPermission(true);

  return command.toJSON();
}

export function execute(interaction: ChatInputCommandInteraction) {
  const randomNumber = Math.random();
  const randomString =
    randomNumber < 0.5
      ? 'Heads'
      : randomNumber > 0.5
      ? 'Tails'
      : 'The coin landed on its side, try again!';

  interaction.reply({ content: randomString });
}
