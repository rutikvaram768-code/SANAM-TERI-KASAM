module.exports.config = {
    name: "allkick",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHAAN BABU",
    description: "THIS BOT WAS MADE BY MR SHAAN BABU",
    commandCategory: "ALL MEMBERS REMOVE THE GROUP",
    usages: "PREFIX",
    usePrefix: false,
    cooldowns: 5
};

module.exports.run = async function({ api, event, getText, args }) {
  const { participantIDs } = await api.getThreadInfo(event.threadID);
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  const botID = api.getCurrentUserID();
  const listUserID = participantIDs.filter(ID => ID != botID);
  
  return api.getThreadInfo(event.threadID, (err, info) => {
    if (err) return api.sendMessage("Kuch gadbad ho rahi hai boss 😐✌️", event.threadID);
    
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
      return api.sendMessage("Boss main is group ka admin nahi hoon pehle mujhe admin banao 😐✌️", event.threadID, event.messageID);
    
    if (info.adminIDs.some(item => item.id == event.senderID)) {
      setTimeout(function() { api.removeUserFromGroup(botID, event.threadID) }, 300000);
      
      return api.sendMessage("Good bye sabko ye group khatam ho raha hai alvida 🙂✌️", event.threadID, async (error, info) => {
        for (let id of listUserID) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          api.removeUserFromGroup(id, event.threadID);
        }
      });
    } else {
      return api.sendMessage("𝙔𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝙎𝙄𝙍𝙁 𝙈𝙀𝙍𝙀 ✮⃝❤≛⃝ 𝐑𝐔𝐓𝐈𝐊────亗🕊️ BABU 𝙃𝙄 𝙐𝙎𝙀 𝙆𝘼𝙍 𝙎𝘼𝙆𝙏𝙔 𝙃𝘼𝙄 😐✌️", event.threadID, event.messageID);
    }
  });
};
