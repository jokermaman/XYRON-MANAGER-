const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Send ticket panel'),

  async execute(interaction) {
    interaction.channel.send({
      content: "Click to open ticket",
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: "Open Ticket",
            style: 1,
            custom_id: "open_ticket"
          }
        ]
      }]
    });

    interaction.reply({ content: "Panel sent!", ephemeral: true });
  }
};