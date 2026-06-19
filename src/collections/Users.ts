import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
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
