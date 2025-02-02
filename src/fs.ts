export function forceRemoveSync(filename: string): void {
  if (existsSync(filename)) {
    Deno.removeSync(filename)
  }
}

export function existsSync(filename: string): boolean {
  try {
    return Deno.statSync(filename) != null
  } catch {
    return false
  }
}
