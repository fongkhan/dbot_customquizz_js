const { SlashCommandBuilder } = require('discord.js');
const { verifyQuizz } = require('../utils/functions.js');
const { quizz } = require('../utils/variables.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify-quizz')
		.setDescription('verify the actual quizz'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let flag = false;
		flag = await verifyQuizz(interaction, quizz.table);
        if (flag === false) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
          return;
        }
		try {
			await interaction.followUp({content: `Quizz ${quizz.name} verified !`, ephemeral: true});
		} catch (error) {
			console.error(error);
			await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
		}
	},
};