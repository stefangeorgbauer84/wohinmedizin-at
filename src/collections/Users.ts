import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rolle',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redaktion', value: 'editor' },
        { label: 'Arzt / Ärztin', value: 'doctor' },
        { label: 'Partner', value: 'partner' },
      ],
      defaultValue: 'editor',
    },
  ],
}
