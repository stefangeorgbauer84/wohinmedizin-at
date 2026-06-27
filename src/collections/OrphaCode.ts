import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'

export const OrphaCode: CollectionConfig = {
  slug: 'orpha-codes',
  labels: { singular: 'OrphaCode', plural: 'OrphaCodes' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'createdAt'],
    listSearchableFields: ['code', 'name'],
    description: 'ORPHA rare disease ontology codes (Orphanet)',
    group: 'Seltene Erkrankungen',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'code',
      type: 'number',
      required: true,
      unique: true,
      admin: { description: 'Numeric ORPHA code, e.g. 558 for Marfan syndrome' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'synonyms',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
      ],
      admin: { description: 'Alternative names and synonyms' },
    },
    {
      name: 'linkedConditions',
      type: 'relationship',
      relationTo: 'diseases',
      hasMany: true,
      admin: { description: 'Link to Diseases collection entries' },
    },
    {
      name: 'icd10Codes',
      type: 'array',
      fields: [{ name: 'code', type: 'text' }],
      admin: { description: 'Related ICD-10 codes' },
    },
    {
      name: 'prevalence',
      type: 'text',
      admin: { description: 'Estimated prevalence, e.g. 1-9/100,000' },
    },
  ],
}
