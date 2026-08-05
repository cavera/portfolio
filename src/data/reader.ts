import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

/**
 * Scaffolded ahead of source.ts rewiring — nothing imports this yet. Reads
 * straight off the checked-out filesystem, so builds fetch nothing over the
 * network for content (unlike the Notion path it's replacing).
 */
export const reader = createReader(process.cwd(), keystaticConfig)
