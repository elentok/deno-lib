import { loadFromCache, saveToCache } from "./cache.ts"

const CACHE_BASENAME = "currency"

export interface GetConversionRateInput {
  openExchangeAppId: string
  from: string
  to: string
}

export async function getConversionRate(input: GetConversionRateInput): Promise<number> {
  const { from, to } = input

  const cacheKey = `${from}-${to}`
  const cachedValue = loadFromCache<number>(CACHE_BASENAME, cacheKey)

  if (cachedValue != null) {
    return cachedValue
  }

  const value = await fetchFreshConversionRate(input)
  saveToCache(CACHE_BASENAME, cacheKey, value)
  return value
}

export async function fetchFreshConversionRate(
  { openExchangeAppId, from, to }: GetConversionRateInput,
): Promise<number> {
  const url = new URL(`https://open.exchangerate-api.com/v6/latest/${from}`)
  url.searchParams.set("app_id", openExchangeAppId)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`)
  }

  const json = await response.json()
  return json.rates[to]
}

export function formatCurrency(value: number, currency: string): string {
  return Intl.NumberFormat(undefined, { style: "currency", currency }).format(value)
}

if (import.meta.main) {
  const [openExchangeAppId, from, to, rawValue] = Deno.args
  const value = Number(rawValue)

  const rate = await getConversionRate({ openExchangeAppId, from, to })

  console.info(`Conversion rate from ${from} to ${to}: ${rate}`)
  console.info(`${value} ${from} = ${rate * value} ${to}`)
}
