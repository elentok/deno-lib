import { describe, it } from "jsr:@std/testing/bdd"
import { sum } from "./array.ts"
import { expect } from "jsr:@std/expect/expect"

interface Person {
  age: number
}

describe(sum.name, () => {
  it("works", () => {
    const people: Person[] = [{ age: 30 }, { age: 31 }, { age: 29 }]
    expect(sum(people, (p) => p.age)).toBe(90)
  })
})
