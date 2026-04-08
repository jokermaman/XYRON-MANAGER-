const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create embed')
    .addStringOption(opt => opt.setName('title').setDescription('Title'))
    .addStringOption(opt => opt.setName('desc').setDescription('Description'))
    .addStringOption(opt => opt.setName('color').setDescription('Color HEX')),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(interaction.options.getString('title'))
      .setDescription(interaction.options.getString('desc'))
      .setColor(interaction.options.getString('color') || "#2f3136");

    interaction.channel.send({ embeds: [embed] });
    interaction.reply({ content: "Embed sent!", ephemeral: true });
  }
};