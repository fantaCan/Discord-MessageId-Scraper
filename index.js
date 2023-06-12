import fetch from "node-fetch";
import fs from "node:fs";
import path from "node:path";

// Variables
const token = "";
const channelId = "";
const apiBaseUrl = "https://discord.com/api";

function fantasPlayground(params) {
  try {
    // Example code here to handle the message arrays

    const tempPath = path.join(process.cwd(), "temp", "messages.txt");
    for (const param of params) {
      const { id, author } = param;
      const messageStr = `${id} || sent by ${author.username}\n`;
      fs.appendFile(tempPath, messageStr, "utf8", (error) => {
        if (error) throw error;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function getMessages(channelId, lastMessageId) {
  const options = {
    headers: {
      authorization: token,
    },
  };

  const endpoint = `${apiBaseUrl}/v9/channels/${channelId}/messages?limit=100${
    lastMessageId ? "&before=" + lastMessageId : ""
  }`;
  const response = await fetch(endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    console.log("Error:", data);
    return;
  }

  fantasPlayground(data);

  if (data.length === 0) {
    return "No more messages";
  }

  const lastMessage = data[data.length - 1];
  return getMessages(channelId, lastMessage.id);
}

await getMessages(channelId, null);
