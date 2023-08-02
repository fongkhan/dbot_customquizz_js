const { SlashCommandBuilder } = require('discord.js');
//import axios
const axios = require('axios');
// import he module to decode file
const he = require('he');
// import dataframe js to read csv file
const DataFrame = require('dataframe-js').DataFrame;

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
		// download the csv filewith axios then console log the result
		console.log(csvUrl);
		const csvFile = await axios.get(csvUrl);
		console.log(he.decode(csvFile.data));
		// create a dataframe with the csv file
		try {
			const df = new DataFrame(he.decode(csvFile.data));
			console.log(df);
			//DataFrame.fromCSV(csvFile.data).then(df => {
			//	// print the first 5 rows of the dataframe
			//	console.log(df);
			//	//return interaction.reply(df.toString().slice(0, 2000), { ephemeral: true });
			//}).catch(err => {
			//	console.error(err);
			//	//interaction.reply({content: 'Il y a eu une erreur lors de la création du dataframe.', ephemeral: true});
			//});
		}
		catch (error) {
			console.error(error);
			//interaction.reply({content: 'Il y a eu une erreur lors de la création du dataframe.', ephemeral: true});
		}
		// print the dataframe
		//console.log(df.toString());
		console.log("done");
		// dataframe it with pandas
		await interaction.reply({content: 'done', ephemeral: true});
	},
};