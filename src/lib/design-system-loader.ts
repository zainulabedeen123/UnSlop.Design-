/**
 * Design system loading utilities for colors and typography
 */

import type { DesignSystem, ColorTokens, TypographyTokens } from '@/types/product'
import { runtimeFileLoader } from './runtime-file-loader'

// Load JSON files from product/design-system at build time
const designSystemFiles = import.meta.glob('/product/design-system/*.json', {
  eager: true,
}) as Record<string, { default: Record<string, string> }>

/**
 * Parse color tokens from JSON object
 */
export function parseColorTokens(colors: Record<string, string>): ColorTokens | null {
  if (!colors.primary || !colors.secondary || !colors.neutral) {
    return null
  }

  return {
    primary: colors.primary,
    secondary: colors.secondary,
    neutral: colors.neutral,
  }
}

/**
 * Parse typography tokens from JSON object
 */
export function parseTypographyTokens(typography: Record<string, string>): TypographyTokens | null {
  if (!typography.heading || !typography.body) {
    return null
  }

  return {
    heading: typography.heading,
    body: typography.body,
    mono: typography.mono || 'IBM Plex Mono',
  }
}

/**
 * Load color tokens from colors.json
 *
 * Expected format:
 * {
 *   "primary": "lime",
 *   "secondary": "teal",
 *   "neutral": "stone"
 * }
 */
export function loadColorTokens(): ColorTokens | null {
  const colorsModule = designSystemFiles['/product/design-system/colors.json']
  if (!colorsModule?.default) return null

  return parseColorTokens(colorsModule.default)
}

/**
 * Load typography tokens from typography.json
 *
 * Expected format:
 * {
 *   "heading": "DM Sans",
 *   "body": "DM Sans",
 *   "mono": "IBM Plex Mono"
 * }
 */
export function loadTypographyTokens(): TypographyTokens | null {
  const typographyModule = designSystemFiles['/product/design-system/typography.json']
  if (!typographyModule?.default) return null

  return parseTypographyTokens(typographyModule.default)
}

/**
 * Load the complete design system (build-time)
 */
export function loadDesignSystem(): DesignSystem | null {
  const colors = loadColorTokens()
  const typography = loadTypographyTokens()

  // Return null if neither colors nor typography are defined
  if (!colors && !typography) {
    return null
  }

  return { colors, typography }
}

/**
 * Load the complete design system from runtime files
 */
export async function loadDesignSystemRuntime(): Promise<DesignSystem | null> {
  const colorsContent = await runtimeFileLoader.readJsonFile<Record<string, string>>('product/design-system/colors.json')
  const typographyContent = await runtimeFileLoader.readJsonFile<Record<string, string>>('product/design-system/typography.json')

  const colors = colorsContent ? parseColorTokens(colorsContent) : null
  const typography = typographyContent ? parseTypographyTokens(typographyContent) : null

  // Fall back to build-time files if runtime files don't exist
  const colorsFinal = colors || loadColorTokens()
  const typographyFinal = typography || loadTypographyTokens()

  if (!colorsFinal && !typographyFinal) {
    return null
  }

  return { colors: colorsFinal, typography: typographyFinal }
}

/**
 * Check if design system has been defined (at least colors or typography)
 */
export function hasDesignSystem(): boolean {
  return (
    '/product/design-system/colors.json' in designSystemFiles ||
    '/product/design-system/typography.json' in designSystemFiles
  )
}

/**
 * Check if colors have been defined
 */
export function hasColors(): boolean {
  return '/product/design-system/colors.json' in designSystemFiles
}

/**
 * Check if typography has been defined
 */
export function hasTypography(): boolean {
  return '/product/design-system/typography.json' in designSystemFiles
}
