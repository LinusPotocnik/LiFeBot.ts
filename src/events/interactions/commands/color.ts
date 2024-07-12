import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from 'discord.js';

export function create(): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const command = new SlashCommandBuilder()
    .setName('color')
    .setDescription('Sends an image of the color you want')
    .addStringOption((option) =>
      option
        .setName('hex')
        .setDescription('Hex-code of the color. Use format #RRGGBB')
        .setMinLength(6)
        .setMaxLength(7)
        .setRequired(true)
    )
    .setDMPermission(true);

  return command.toJSON();
}

export function execute(interaction: ChatInputCommandInteraction) {
  const hexRegEx: RegExp = /\b#?[0-9A-Fa-f]{6}\b/s;
  let color = interaction.options.getString('hex')!;

  if (!hexRegEx.test(color)) {
    interaction.reply({
      content: 'Illegal input! Please provide a color in the form #RRGGBB',
      ephemeral: true,
    });
    return;
  }

  if (color.startsWith('#')) color = color.substring(1);

  const colorEmbed = new EmbedBuilder()
    .setTitle(`#${color}`)
    .setColor(`#${color}`)
    .setThumbnail('https://singlecolorimage.com/get/' + color + '/500x500');

  return interaction.reply({ embeds: [colorEmbed] });
}
