const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup-quizz')
		.setDescription('send a csv file to setup the quizz')
		.addAttachmentOption(option =>
			option.setName('csv')
				.setDescription('the csv file to setup the quizz')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('name')
				.setDescription('the name of the quizz')
				.setRequired(true)),
	async execute(interaction) {

		await interaction.reply({content: 'done', ephemeral: true});
	},
};