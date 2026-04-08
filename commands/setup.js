const { SlashCommandBuilder } = require('discord.js');
const Settings = require('../models/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup bot')
    .addChannelOption(opt => opt.setName('welcome').setDescription('Welcome channel'))
    .addRoleOption(opt => opt.setName('autorole').setDescription('Auto role')),

  async execute(interaction) {
    let data = await Settings.findOne({ guildId: interaction.guild.id });

    if (!data) data = new Settings({ guildId: interaction.guild.id });

    data.welcomeChannel = interaction.options.getChannel('welcome')?.id;
    data.autoRole = interaction.options.getRole('autorole')?.id;

    await data.save();

    interaction.reply("Setup saved!");
  }
};