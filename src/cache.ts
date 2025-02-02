import { join } from "jsr:@std/path"

export const CACHE_DIR = `${Deno.env.get("HOME")}/.cache/deno-lib`

type CacheData<TValue> = Record<string, CacheItem<TValue>>

interface CacheItem<TValue> {
  value: TValue
  timestamp: number
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

export function loadFromCache<TValue>(
  basename: string,
  key: string,
  ttl = ONE_DAY_IN_MS,
): TValue | undefined {
  const cache = loadCache<TValue>(basename)
  const item = cache[key]
  if (item != null && (Date.now() - item.timestamp) < ttl) {
    return item.value
  }

  return
}

export function saveToCache<TValue>(
  basename: string,
  key: string,
  value: TValue,
): void {
  const cache = loadCache<TValue>(basename)
  cache[key] = { value, timestamp: Date.now() }
  saveCache(basename, cache)
}

function loadCache<TValue>(basename: string): CacheData<TValue> {
  try {
    const cache = Deno.readTextFileSync(join(CACHE_DIR, `${basename}.json`))
    return JSON.parse(cache)
  } catch {
    return {}
  }
}

function saveCache<TValue>(basename: string, cache: CacheData<TValue>): void {
  Deno.mkdirSync(CACHE_DIR, { recursive: true })
  Deno.writeTextFileSync(
    join(CACHE_DIR, `${basename}.json`),
    JSON.stringify(cache, undefined, 2),
  )
}
