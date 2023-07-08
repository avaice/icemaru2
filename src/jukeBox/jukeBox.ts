import { Message } from "discord.js"
import { checkPlayCommand } from "./checkPlayCommand"
import { checkSkipCommand } from "./checkSkipCommand"
import { checkStopCommand } from "./checkStopCommand."
import { checkRepeatCommand } from "./checkRepeatCommand"

// YouTube再生機能
export const jukeBox = (message: Message<boolean>): boolean => {
  // !playコマンド
  if (checkPlayCommand(message)) {
    return true
  }
  // !stopコマンド
  if (checkStopCommand(message)) {
    return true
  }
  // !skipコマンド
  if (checkSkipCommand(message)) {
    return true
  }
  // !repeat-thisコマンド
  if (checkRepeatCommand(message)) {
    return true
  }

  return false
}
