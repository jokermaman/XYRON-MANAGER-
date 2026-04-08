require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

// Slash handler
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd) await cmd.execute(interaction, client);
  }

  // BUTTONS
  if (interaction.isButton()) {
    const Settings = require('./models/Settings');
    const settings = await Settings.findOne({ guildId: interaction.guild.id });

    if (interaction.customId === "open_ticket") {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: settings.ticketCategory,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel'] }
        ]
      });

      channel.send({
        content: `${interaction.user}`,
        components: [{
          type: 1,
          components: [
            {
              type: 2,
              label: "Close",
              style: 4,
              custom_id: "close_ticket"
            }
          ]
        }]
      });

      interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    }

    if (interaction.customId === "close_ticket") {
      interaction.channel.delete();
    }

    if (interaction.customId === "apply_button") {
      const questions = settings.questions.length ? settings.questions : ["Why should we accept you?"];
      let answers = [];

      await interaction.user.send("Application started!");

      for (let q of questions) {
        await interaction.user.send(q);

        const collected = await interaction.user.dmChannel.awaitMessages({
          max: 1,
          time: 60000
        });

        answers.push(collected.first().content);
      }

      const log = interaction.guild.channels.cache.get(settings.logChannel);
      if (log) log.send(`Application from ${interaction.user}\n${answers.join("\n")}`);

      interaction.reply({ content: "Check DM!", ephemeral: true });
    }
  }
});

// Welcome + autorole
client.on('guildMemberAdd', async member => {
  const Settings = require('./models/Settings');
  const settings = await Settings.findOne({ guildId: member.guild.id });

  if (!settings) return;

  if (settings.welcomeChannel) {
    const channel = member.guild.channels.cache.get(settings.welcomeChannel);
    if (channel) channel.send(`Welcome ${member}`);
  }

  if (settings.autoRole) {
    member.roles.add(settings.autoRole);
  }
});

client.login(process.env.TOKEN);