import { Message } from "discord.js"
import { client } from "."
import { checkPlayCommand } from "./jukeBox/checkPlayCommand"
import { jukeBox } from "./jukeBox/jukeBox"
import { checkMentionedEvents } from "./talkFunctions/checkMentionedEvents"
import { valorantPick } from "./valorant/valorantPick"
import { minecraftServerInfo } from "./minecraft/minecraftServerInfo"
import { minecraftNews } from "./minecraft/minecraftNews"
import { botStatus } from "./status/botStatus"
import { valorantPowerCheck } from "./valorant/valorantPowerCheck"
import { icemaruGPT, lastMessageDate } from "./icemaruGPT"
import { joinVoiceChannel } from "@discordjs/voice"
import { voiceTalk } from "./voiceTalk"
import { reply } from "./reply"

//メッセージを受け取った時のイベント
export const recievedMessage = async (message: Message<boolean>) => {
  //Darkあいす丸がオンラインで、自分は本番環境だった時
  //いつかその処理を書けるようになるといいな（いつか）

  //BOT自身が送ったメッセージだったとき
  if (client.user && message.author.id === client.user.id) {
    return
  }
  if (message.content === "こんにちは") {
    message.reply("やっほー")
  }

  if ((message.content.includes("おつ") || message.content.includes("お疲れ")) && message.content.includes("あいす")) {
    message.reply("えへへ")
  }

  if (message.content.includes("おき") && message.content.includes("あいす")) {
    message.reply("おはよ〜〜〜")
  }

  if ((message.content.includes("きて") || message.content.includes("来て")) && message.content.includes("あいす")) {
    voiceTalk.join(message)
    return
  }

  if (jukeBox(message)) {
    return
  }

  if (await valorantPick(message)) {
    return
  }

  if (await valorantPowerCheck(message)) {
    return
  }

  if (await minecraftNews(message)) {
    return
  }

  if (await minecraftServerInfo(message)) {
    return
  }

  if (await botStatus(message)) {
    return
  }

  // メンションされた時のイベントがトリガーされるか調べる
  const mentionEvents = checkMentionedEvents(message)
  if (mentionEvents) {
    message.reply(mentionEvents)
    return
  }

  if (
    (client.user && message.mentions.has(client.user.id)) ||
    (message.content.includes("あいす") && (message.content.includes("まる") || message.content.includes("丸"))) ||
    new Date().getTime() - lastMessageDate.getTime() < 60000 // 最後の会話から６０秒以内なら
  ) {
    const isJoinedVoiceChannel = !!(message.guild && voiceTalk.isJoined(message.guild?.id))
    if (!isJoinedVoiceChannel) {
      message.channel.sendTyping()
    }
    const result = await icemaruGPT(message)

    reply(message, result)

    return
  }
}
