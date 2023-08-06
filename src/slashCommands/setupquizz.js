const { SlashCommandBuilder } = require('discord.js');
//import functions from './../utils/functions.js';
const { getQuizzCsvFile } = require('./../utils/functions.js');
const { quizz } = require('./../utils/variables.js');

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
		let flag = false;
		const csvUrl = encodeURI(interaction.options.getAttachment('csv').url);
		const quizzName = interaction.options.getString('name');
		flag = await getQuizzCsvFile(csvUrl, quizzName);
		if (flag === false) {
			await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
			return;
		}
		try {
			await interaction.followUp({content: `Quizz ${quizzName} created !`, ephemeral: true});
		} catch (error) {
			console.error(error);
			await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
		}
	},
};