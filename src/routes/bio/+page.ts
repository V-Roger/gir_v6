import { error } from '@sveltejs/kit'

export async function load() {
  try {
    const bio = await import('./bio.md')

    return { content: bio.default, meta: bio.metadata }
  } catch {
    error(404, `Could not find bio`)
  }
}
