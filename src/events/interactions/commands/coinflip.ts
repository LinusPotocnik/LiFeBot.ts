import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from 'discord.js';
import { localize } from '../../../utility/language';

export function create(): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const command = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin')
    .setDMPermission(true);

  return command.toJSON();
}

export function execute(interaction: ChatInputCommandInteraction) {
  const locale = interaction.locale;
  const randomNumber = Math.random();
  const randomString =
    randomNumber < 0.5
      ? localize(locale, 'coinflip.heads')
      : randomNumber > 0.5
      ? localize(locale, 'coinflip.tails')
      : localize(locale, 'coinflip.side');

  interaction.reply({ content: randomString });
}
