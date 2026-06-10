import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        description: 'z.B. gelenkschmerzen-fachrichtung',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategorie',
      required: true,
      options: [
        { label: 'Symptom', value: 'symptom' },
        { label: 'Erkrankung', value: 'condition' },
        { label: 'Fachrichtung', value: 'specialty' },
        { label: 'Gesundheitssystem', value: 'system' },
        { label: 'Seltene Erkrankung', value: 'rare' },
        { label: 'Mentale Gesundheit', value: 'mental' },
        { label: 'Kinder & Familie', value: 'family' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Kurzzusammenfassung',
      localized: true,
      admin: {
        description: 'Wird in Listenansichten und SEO verwendet.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Inhalt',
      localized: true,
    },
    {
      name: 'relevantSpecialties',
      type: 'relationship',
      label: 'Relevante Fachrichtungen',
      relationTo: 'specialties',
      hasMany: true,
    },
    {
      name: 'redFlags',
      type: 'richText',
      label: 'Wann rasch medizinische Hilfe?',
      localized: true,
    },
    {
      name: 'doctorQuestions',
      type: 'richText',
      label: 'Fragen für den Arzttermin',
      localized: true,
    },
    {
      name: 'isSponsored',
      type: 'checkbox',
      label: 'Gesponserter Inhalt',
      defaultValue: false,
    },
    {
      name: 'sponsorNote',
      type: 'text',
      label: 'Sponsor-Hinweis',
      localized: true,
      admin: {
        condition: (data) => data.isSponsored,
      },
    },
    {
      name: 'reviewedAt',
      type: 'date',
      label: 'Medizinisch geprüft am',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Veröffentlicht', value: 'published' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Vorschaubild',
      relationTo: 'media',
    },
  ],
}
