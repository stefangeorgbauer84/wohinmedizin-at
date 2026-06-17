import type { CollectionConfig } from 'payload'
import { publicReadAdminWrite } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: publicReadAdminWrite,
  admin: {
    useAsTitle: 'alt',
  },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt-Text',
      required: true,
      localized: true,
    },
  ],
}
