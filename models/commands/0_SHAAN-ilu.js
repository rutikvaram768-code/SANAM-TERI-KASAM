const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "love",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "Shaan",
    description: "Successfully paired with someone",
    commandCategory: "Get Pair From Mention",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

// Background image aur folder setup karne ke liye
module.exports.onLoad = async () => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirPath = __dirname + "/uzair/mtx/";
    const imagePath = resolve(__dirname, 'uzair/mtx', 'ilu.jpg');

    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
    if (!existsSync(imagePath)) await downloadFile("https://i.ibb.co/ksjph62Y/ilu.jpg", imagePath);
};

// Image processing function
async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const Jimp = global.nodemodule["jimp"];
    
    const baseDir = path.resolve(__dirname, 'uzair', 'mtx');
    let template = await Jimp.read(baseDir + "/ilu.jpg");
    
    let pathOne = baseDir + `/avt_${one}.jpeg`;
    let pathTwo = baseDir + `/avt_${two}.jpeg`;
    let outputPath = baseDir + `/ilu_${one}_${two}.jpeg`;

    // User 1 ki profile picture download karna
    let avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathOne, Buffer.from(avatarOne, 'utf-8'));

    // User 2 ki profile picture download karna
    let avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathTwo, Buffer.from(avatarTwo, 'utf-8'));

    // Images ko circle shape mein crop karna aur resize karna
    let img1 = await Jimp.read(await circle(pathOne));
    let img2 = await Jimp.read(await circle(pathTwo));

    // Template par dono photos chipkana (composite)
    template.composite(img1.resize(250, 250), 168, 210)
            .composite(img2.resize(250, 250), 895, 210);

    let resultBuffer = await template.getBufferAsync(Jimp.MIME_JPEG);
    fs.writeFileSync(outputPath, resultBuffer);
    
    // Temporary files delete karna
    fs.unlinkSync(pathOne);
    fs.unlinkSync(pathTwo);
    
    return outputPath;
}

// Image ko round (circle) karne ka helper function
async function circle(imagePath) {
    const Jimp = require("jimp");
    let img = await Jimp.read(imagePath);
    img.circle();
    return await img.getBufferAsync(Jimp.MIME_PNG);
}

// Command run hone par kya hoga
module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0]) return api.sendMessage("𝑃𝑙𝑒𝑎𝑠𝑒 Ak. Id Ko Mention Karen.", threadID, messageID);
    else {
        const one = senderID;
        const two = mention[0];
        
        return makeImage({ one, two }).then(path => 
            api.sendMessage({
                body: "𝐂𝐫𝐞𝐝𝐢𝐭 ➻ Mr ✮⃝❤≛⃝ 𝐑𝐔𝐓𝐈𝐊──────亗🕊️\n\n◈ ━━━━━━━━━━━━ 💚✨\n\nजानू, बेबी, हनी, स्वीटी, डार्लिंग, लव, शोना मोना\n\nहर बार हम पर इल्जाम
लगा देते हो मोहब्बत का
कभी खुद से पूछा है
इतनी खूबसूरत क्यों हो !🙈🙂!\n🥀❤️🔥\n\n◈ ━━━━━━━━━━━━ 💚✨\n\n➻ 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬 ❤️🥳,\n\n𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐩𝐚𝐢𝐫𝐞𝐝 𝐰𝐢𝐭𝐡 🫣💨\n\n◈ ━━━━━━━━━━━━ 💚✨\n𝐶𝑜𝑑𝑒 𝐵𝑦 :𝐑𝐔𝐓𝐈𝐊",
                attachment: fs.createReadStream(path)
            }, threadID, () => fs.unlinkSync(path), messageID)
        );
    }
};
