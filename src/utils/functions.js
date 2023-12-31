// require all the modules needed
const { quizz } = require("./variables.js");
const { REST, Routes, ActivityType } = require("discord.js");
const { clientId, token } = require("./../config.json");
const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");
const Papa = require("papaparse");
const { Table } = require("embed-table");

// export the functions to be used in the commands
module.exports = {
  changeActivity,
  refreshCommands,
  getRole,
  getChannel,
  getQuizzCsvFile,
  showQuizz,
  verifyQuizz,
  startQuizz,
};

// change the activity of the bot (playing, listening, watching, streaming) only for admins of the server
function changeActivity(isClient, clInteraction, type, message) {
  // transform the type of activity to the one used by discord.js
  const actValue = setValueActivity(type);
  if (isClient) {
    clInteraction.user.setActivity(message, { type: actValue });
    console.log("activity set to " + type + " | with the message : " + message);
    return;
  }
  clInteraction.client.user.setActivity(message, { type: actValue });
  console.log("activity set to " + type + " | with the message : " + message);
  clInteraction.reply({ content: "Activity Changed !", ephemeral: true });
}

function setValueActivity(value) {
  // change the value of activite to the one used by discord.js
  let activityType;
  switch (value) {
    case "Playing":
      activityType = ActivityType.Playing;
      break;
    case "Streaming":
      activityType = ActivityType.Streaming;
      break;
    case "Listening":
      activityType = ActivityType.Listening;
      break;
    case "Watching":
      activityType = ActivityType.Watching;
      break;
    case "Custom":
      activityType = ActivityType.Custom;
      break;
    case "Competing":
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
  const commandPath = path.join(__dirname, "./../slashCommands/");
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const command = require(`./../slashCommands/${file}`);
    commands.push(command.data.toJSON());
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({ version: "10" }).setToken(token);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}

// function to get the role of the user
function getRole(interaction, roleName) {
  const role = interaction.guild.roles.cache.find(
    (role) => role.name === roleName
  );
  return role;
}

//function to get the channel of the user
function getChannel(interaction, channelName) {
  const channel = interaction.guild.channels.cache.find(
    (channel) => channel.name === channelName
  );
  return channel;
}

// function that call the function to get the csv file and parse it for the quizz
async function getQuizzCsvFile(csvUrl, quizzName) {
  // get the csv file
  const csvData = await getCsvFile(csvUrl);
  // parse the csv file
  const parsedData = parseCsvFile(csvData);
  // set the name of the quizz
  quizz.name = quizzName;
  // set the table of the quizz
  quizz.table = parsedData;
  // return the quizz
  return true;
}

// function to retrieve the csv file from the url
async function getCsvFile(csvUrl) {
  try {
    // download the csv file with axios then console log the result
    const response = await axios.get(csvUrl, { responseType: "text" });
    // read the csv file with papaparse
    const csvData = response.data;
    console.log("Data received");
    return csvData;
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: "Il y a eu une erreur lors de la gestion du tableau",
      ephemeral: true,
    });
  }
}

// function to parse the csv file
function parseCsvFile(csvData) {
  try {
    // parse the csv file with papaparse
    const parsedData = Papa.parse(csvData, {
      header: true, // indicate that the first line contains the column names
      dynamicTyping: true, // convert the string to number, etc.
      skipEmptyLines: true, // ignore empty lines
    });
    console.log("Data parsed");
    return parsedData;
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: "Il y a eu une erreur lors de la gestion du tableau",
      ephemeral: true,
    });
  }
}

// show the quizz as text
async function showQuizz(interaction) {
  quizzdata = Papa.unparse(quizz.table.data);
  await interaction.followUp({ content: quizzdata, ephemeral: true });
  return true;
}

// verify if the quizz is correct in fields of the papa parse object with header true
async function verifyQuizz(interaction, quizz) {
  // verify if the quizz is not empty
  if (quizz === undefined || quizz === null || quizz === "") {
    console.log("Quizz not verified: quizz is empty");
    await interaction.followUp({
      content: `Quizz ${quizz.name} not verified: quizz is empty`,
      ephemeral: true,
    });
    return false;
  }
  // verify if the quizz has all correct fields in meta
  if (quizz.meta.fields.length !== 8) {
    console.log("Quizz not verified: fields not correct");
    await interaction.followUp({
      content: `Quizz ${quizz.name} not verified: fields not correct`,
      ephemeral: true,
    });
    return false;
  }
  // verify all column names of the quizz are correct and in the correct order in the meta fields
  if (
    quizz.meta.fields[0] !== "category / theme" ||
    quizz.meta.fields[1] !== "Difficulty" ||
    quizz.meta.fields[2] !== "Points" ||
    quizz.meta.fields[3] !== "Question" ||
    quizz.meta.fields[4] !== "Answers" ||
    quizz.meta.fields[5] !== "Good Answer" ||
    quizz.meta.fields[6] !== "Video link" ||
    quizz.meta.fields[7] !== "Image link"
  ) {
    console.log("Quizz not verified: column names not correct");
    await interaction.followUp({
      content: `Quizz ${quizz.name} not verified: column names not correct`,
      ephemeral: true,
    });
    return false;
  }
  // verify if the quizz has all correct fields in data
  for (const question of quizz.data) {
    if (Object.keys(question).length !== 8) {
      console.log("Quizz not verified: question not filed correctly");
      await interaction.followUp({
        content: `Quizz ${quizz.name} not verified: question not filed correctly`,
        ephemeral: true,
      });
      return false;
    }
  }
  console.log("Quizz verified");
}

// function to start the quizz
async function startQuizz(interaction) {
  // get the quizz
  const quizz = getQuizz();
  // verify if the quizz is correct
  const flag = await verifyQuizz(interaction, quizz);
  if (flag === false) {
    await interaction.followUp({
      content: `Quizz ${quizz.name} not verified`,
      ephemeral: true,
    });
    return;
  }
  // get the first question
  const question = getQuestion(quizz);
  // show the question
  await interaction.followUp({ content: question, ephemeral: true });
  return;
}

// function to get the question of the quizz
function getQuestion(quizz) {
	  // get the question
  const question = quizz.data[0].Question;
  // get the answers
  const answers = quizz.data[0].Answers;
  // get the good answer
  const goodAnswer = quizz.data[0].GoodAnswer;
  // get the video link
  const videoLink = quizz.data[0].VideoLink;
  // get the image link
  const imageLink = quizz.data[0].ImageLink;
  // create the table
  const table = new Table()
	.setHeading("Question", "Answers", "Good Answer", "Video Link", "Image Link")
	.addRow(question, answers, goodAnswer, videoLink, imageLink);
  // return the table
  return table;
}