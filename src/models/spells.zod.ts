import { z } from 'zod';

/**
 * Zod schema for validating spells from spells.json
 */
export const SpellSchema = z.object({
  spellName: z.string(),
  complexity: z.string().or(z.number()).or(z.null()).transform(val => {
    if (val === null) return 0;
    if (typeof val === 'string') return parseInt(val, 10) || 0;
    return val;
  }),
  flare: z.string().or(z.number()).or(z.null()).transform(val => {
    if (val === null) return 0;
    if (typeof val === 'string') return parseInt(val, 10) || 0;
    return val;
  }),
  range: z.string(),
  target: z.string(),
  action: z.string(),
  duration: z.string(),
  keywords: z.string().or(z.null()),
  check: z.string(),
  spellClass: z.string(),
  school: z.string(),
  skill: z.string(),
  focus: z.string(),
  spellType: z.string(),
  description: z.string().or(z.null()),
  altDescription: z.string().or(z.null())
});

/**
 * Type for a single spell derived from the schema
 */
export type Spell = z.infer<typeof SpellSchema>;

/**
 * Schema for the entire spells.json file (array of spells)
 */
export const SpellsSchema = z.array(SpellSchema);

/**
 * Type for the entire spells array
 */
export type Spells = z.infer<typeof SpellsSchema>;

/**
 * Validates the spells data against the schema
 * @param data The spells data to validate
 * @returns The validated spells data
 * @throws If validation fails
 */
export function validateSpells(data: unknown): Spells {
  return SpellsSchema.parse(data);
}

/**
 * Safely attempts to validate the spells data
 * @param data The spells data to validate
 * @returns Result object with success flag and either the data or an error
 */
export function validateSpellsSafe(data: unknown): { success: boolean; data?: Spells; error?: z.ZodError } {
  const result = SpellsSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}
