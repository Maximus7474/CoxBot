import { Message } from "discord.js";
import Config from "../config";
import { compliementPatterns } from "../utils/patterns";
import { complimentResponses } from "../handlers/botResponsesHandler";
import logger from "../utils/logger";

export const onCompliment = async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    
    if (!message.mentions.repliedUser || message.mentions.repliedUser.id !== Config.CLIENT_ID) return;

    const lowerCaseMessage = message.content.toLowerCase();

    const isComplimentMatch = compliementPatterns.some((pattern) => pattern.test(lowerCaseMessage));

    if (!isComplimentMatch) return;

    const response = complimentResponses[Math.floor(Math.random() * complimentResponses.length)];

    const stickerResponse = response.match(/<STICKER:([0-9]+)>/i);

    if (stickerResponse && stickerResponse[1]) {
        const { guild } = message;

        const sticker = await guild.stickers.fetch(stickerResponse[1]);

        if (!sticker) return logger.error('Unable to fetch sticker with id:', stickerResponse[1]);

        await message.reply({
            stickers: [sticker],
        });
    } else {
        await message.reply(response);
    }
}