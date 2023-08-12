const { SlashCommandBuilder } = require('discord.js');
const { startQuizz } = require('../utils/functions.js');
const { quizz } = require('../utils/variables.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-quizz')
		.setDescription('show the actual quizz'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let flag = false;
		flag = await startQuizz(interaction);
        if (flag === false) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
          return;
        }
		try {
			//await interaction.followUp({content: `Quizz ${quizz.name} showed !`, ephemeral: true});
		} catch (error) {
			console.error(error);
			await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
		}
	},
};