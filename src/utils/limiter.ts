import { checkFreeMemory } from "../status/botStatus"
import { ENV_KEYS } from "./envkeys"

// メモリ不足によるクラッシュを防ぐ
export const isLimiterEnabled = () => {
  if (checkFreeMemory() < ENV_KEYS.MEMORY_LIMITER) {
    return true
  }

  return false
}
