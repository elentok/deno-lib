import { join } from "jsr:@std/path"
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd"
import { expect } from "jsr:@std/expect"
import { CACHE_DIR, loadFromCache } from "./cache.ts"
import { forceRemoveSync } from "./fs.ts"

describe("loadFromCache", () => {
  beforeAll(() => {
    Deno.mkdirSync(CACHE_DIR, { recursive: true })
  })

  afterAll(() => {
    forceRemoveSync(join(CACHE_DIR, "non-existing-file.json"))
    forceRemoveSync(join(CACHE_DIR, "test1.json"))
  })

  it("returns undefined when no cache file", () => {
    forceRemoveSync(join(CACHE_DIR, "non-existing-file.json"))
    expect(loadFromCache("non-existing-file", "bob")).toBeUndefined()
  })

  it("returns undefined when cache value expired", () => {
    const ttl = 1000
    const cacheData = {
      myKey: {
        value: "myValue",
        timestamp: Date.now() - ttl * 2,
      },
    }

    Deno.writeTextFileSync(join(CACHE_DIR, "test1.json"), JSON.stringify(cacheData))
    expect(loadFromCache("test1", "myKey", ttl)).toBeUndefined()
  })

  it("returns value when cache value is still fresh", () => {
    const ttl = 1000
    const cacheData = {
      myKey: {
        value: "myValue",
        timestamp: Date.now() - ttl / 2,
      },
    }

    Deno.writeTextFileSync(join(CACHE_DIR, "test2.json"), JSON.stringify(cacheData))
    expect(loadFromCache("test2", "myKey", ttl)).toBe("myValue")
  })
})
