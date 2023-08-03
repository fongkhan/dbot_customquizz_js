const { SlashCommandBuilder } = require('discord.js');
//import axios
const axios = require('axios');
// import he module to decode file
const he = require('he');
// import papaparse to read csv file
const Papa = require('papaparse');

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
		// get the url of the csv file then download it
		const csvUrl = encodeURI(interaction.options.getAttachment('csv').url);
		const csvName = interaction.options.getString('name');

		console.log(csvUrl);
		try {
			// download the csv file with axios then console log the result
			const response = await axios.get(csvUrl, { responseType: 'text' });
			// lire le fichier csv avec papaparse
			const csvData = response.data;
			let csvText = '';
			const parsedData = Papa.parse(csvData, {
				header: true, // Indique que la première ligne contient les noms de colonnes
   		       skipEmptyLines: true, // Ignorer les lignes vides
			   step: (row) => {
				   csvText += row.data + '\n';
			   }
			});

			console.log(parsedData);
			await interaction.reply({content: csvText, ephemeral: true});
        	// Utilisez le DataFrame pour effectuer des opérations sur les données CSV
		}
		catch (error) {
			console.error(error);
			//interaction.reply({content: 'Il y a eu une erreur lors de la création du dataframe.', ephemeral: true});
		}
		console.log("done");
		//await interaction.reply({content: 'done', ephemeral: true});
	},
};