import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { localize } from '../../../utility/language';

export function create(): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const command = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes any amout of messages from this channel')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages you want to delete')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDMPermission(false);

  return command.toJSON();
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const locale = interaction.locale;
  const amount = interaction.options.getInteger('amount', true);
  const channel = interaction.channel as TextChannel;

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
    interaction.reply({
      content: localize(locale, 'clear.error.user'),
      ephemeral: true,
    });
    return;
  }

  const botMember = await interaction.guild?.members.fetchMe();
  if (!botMember?.permissionsIn(channel).has(PermissionFlagsBits.ManageMessages)) {
    await interaction.reply({
      content: localize(locale, 'clear.error.bot'),
      ephemeral: true,
    });
    return;
  }

  // true parameter ensures that only messages less than two weeks old get deleted
  // in consequence, the real deleted amount can differ from the provided one
  const deletedMessages = (await channel.bulkDelete(amount, true)).size.toString();

  interaction.reply({
    content: localize(locale, 'clear.confirmation', deletedMessages),
    ephemeral: true,
  });
}
