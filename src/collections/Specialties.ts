import type { CollectionConfig } from 'payload'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Fachrichtung',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Kurzbeschreibung',
      localized: true,
    },
    {
      name: 'whenToVisit',
      type: 'richText',
      label: 'Wann zu dieser Fachrichtung?',
      localized: true,
    },
  ],
}
