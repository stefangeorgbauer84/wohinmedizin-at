import type { CollectionConfig } from 'payload'
import { publicReadAdminWrite } from '@/access'

export const PatientOrganizations: CollectionConfig = {
  slug: 'patient-organizations',
  access: publicReadAdminWrite,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'verified', 'updatedAt'],
    group: 'Seltene Erkrankungen',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name der Organisation',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'country',
      type: 'select',
      label: 'Land',
      options: [
        { label: 'Österreich', value: 'at' },
        { label: 'Deutschland', value: 'de' },
        { label: 'Schweiz', value: 'ch' },
        { label: 'Europa (übergreifend)', value: 'eu' },
        { label: 'International', value: 'intl' },
      ],
      defaultValue: 'at',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
      localized: true,
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Kontakt-E-Mail',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'eurordisAffiliated',
      type: 'checkbox',
      label: 'EURORDIS-Mitglied',
      defaultValue: false,
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo',
      relationTo: 'media',
    },
    {
      name: 'organSystems',
      type: 'select',
      label: 'Betreute Organsysteme',
      hasMany: true,
      admin: {
        description: 'Verbindet die Organisation mit passenden Erkrankungen (Versorgungspfad).',
      },
      options: [
        { label: 'Neurologisch', value: 'neurological' },
        { label: 'Herz & Gefäße', value: 'cardiovascular' },
        { label: 'Bewegungsapparat', value: 'musculoskeletal' },
        { label: 'Blut & Immunsystem', value: 'hematological_immunological' },
        { label: 'Stoffwechsel', value: 'endocrine_metabolic' },
        { label: 'Haut', value: 'dermatological' },
        { label: 'Magen-Darm', value: 'gastrointestinal' },
        { label: 'Atemwege', value: 'respiratory' },
        { label: 'Niere & Harnwege', value: 'urogenital' },
        { label: 'Augen', value: 'visual' },
        { label: 'Ohren', value: 'auditory' },
        { label: 'Reproduktion', value: 'reproductive' },
        { label: 'Psychiatrisch', value: 'psychiatric' },
        { label: 'Multisystemisch', value: 'multisystemic' },
        { label: 'Onkologisch', value: 'oncological' },
      ],
    },
    {
      name: 'orphaCodes',
      type: 'array',
      label: 'Betreute ORPHA-Codes',
      admin: {
        description: 'Direkter Bezug zu einzelnen Erkrankungen (ohne ORPHA:-Präfix).',
      },
      fields: [{ name: 'code', type: 'text', label: 'ORPHA-Code' }],
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Von WohinMedizin verifiziert',
      defaultValue: false,
    },
  ],
}
