const { SlashCommandBuilder } = require('discord.js');
//import functions from './../utils/functions.js';
const { getCsvFile } = require('./../utils/functions.js');

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
		await interaction.deferReply({ ephemeral: true });
		// get the url of the csv file then download it
		const csvUrl = encodeURI(interaction.options.getAttachment('csv').url);
		const csvName = interaction.options.getString('name');
		getCsvFile(csvUrl);
		try {
			await interaction.followUp({content: 'done', ephemeral: true});
		} catch (error) {
			console.error(error);
			await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
		}
	},
};