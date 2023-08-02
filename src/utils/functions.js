// require all the modules needed
const variables = require('./variables.js');
const { REST, Routes, ActivityType } = require('discord.js');
const { clientId, token } = require('./../config.json');
const fs = require('node:fs');
const path = require('node:path');

// export the functions to be used in the commands
module.exports = {
	changeActivity, refreshCommands,
};

// change the activity of the bot (playing, listening, watching, streaming) only for admins of the server
function changeActivity(isClient, clInteraction, type, message) {
	// transform the type of activity to the one used by discord.js
	const actValue = setValueActivity(type);
	if (isClient) {
		clInteraction.user.setActivity(message, { type: actValue });
		console.log('activity set to ' + type + ' | with the message : ' + message);
		return;
	}
	clInteraction.client.user.setActivity(message, { type: actValue });
	console.log('activity set to ' + type + ' | with the message : ' + message);
	clInteraction.reply({ content: 'Activity Changed !', ephemeral: true });
}

function setValueActivity(value) {
	// change the value of activite to the one used by discord.js
	let activityType;
	switch (value) {
	case 'Playing':
		activityType = ActivityType.Playing;
		break;
	case 'Streaming':
		activityType = ActivityType.Streaming;
		break;
	case 'Listening':
		activityType = ActivityType.Listening;
		break;
	case 'Watching':
		activityType = ActivityType.Watching;
		break;
	case 'Custom':
		activityType = ActivityType.Custom;
		break;
	case 'Competing':
		activityType = ActivityType.Competing;
		break;
	default:
		activityType = ActivityType.Playing;
		break;
	}
	return activityType;
}


// refresh the commands of the bot
function refreshCommands() {
	const commands = [];
	// Grab all the command files from the commands directory you created earlier
	const commandPath = path.join(__dirname, './../slashCommands/');
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const command = require(`./../slashCommands/${file}`);
		commands.push(command.data.toJSON());
	}

	// Construct and prepare an instance of the REST module
	const rest = new REST({ version: '10' }).setToken(token);

	// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		}
		catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
}
