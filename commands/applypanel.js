const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('applypanel')
    .setDescription('Send apply button'),

  async execute(interaction) {
    interaction.channel.send({
      content: "Apply here",
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            label: "Apply",
            style: 3,
            custom_id: "apply_button"
          }
        ]
      }]
    });

    interaction.reply({ content: "Done", ephemeral: true });
  }
};