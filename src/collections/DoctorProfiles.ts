import type { CollectionConfig } from 'payload'

export const DoctorProfiles: CollectionConfig = {
  slug: 'doctor-profiles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'region', 'tier', 'verified'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel (z.B. Dr., Prim.)',
    },
    {
      name: 'specialty',
      type: 'relationship',
      label: 'Fachrichtung',
      relationTo: 'specialties',
      required: true,
    },
    {
      name: 'additionalSpecialties',
      type: 'relationship',
      label: 'Weitere Fachrichtungen',
      relationTo: 'specialties',
      hasMany: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Kurzbiografie',
      localized: true,
    },
    {
      name: 'focusAreas',
      type: 'array',
      label: 'Schwerpunkte',
      fields: [
        {
          name: 'area',
          type: 'text',
          label: 'Schwerpunkt',
          localized: true,
        },
      ],
    },
    {
      name: 'insuranceType',
      type: 'select',
      label: 'Kassentyp',
      options: [
        { label: 'Kassenarzt / Kassenärztin', value: 'kasse' },
        { label: 'Wahlarzt / Wahlärtzin', value: 'wahl' },
        { label: 'Privatarzt / Privatärztin', value: 'privat' },
        { label: 'Kasse und Wahl', value: 'kasse_wahl' },
      ],
    },
    {
      name: 'languages',
      type: 'select',
      label: 'Sprachen',
      hasMany: true,
      options: [
        { label: 'Deutsch', value: 'de' },
        { label: 'Englisch', value: 'en' },
        { label: 'Türkisch', value: 'tr' },
        { label: 'BKS', value: 'bs' },
        { label: 'Arabisch', value: 'ar' },
        { label: 'Rumänisch', value: 'ro' },
        { label: 'Polnisch', value: 'pl' },
        { label: 'Russisch', value: 'ru' },
        { label: 'Ukrainisch', value: 'uk' },
      ],
    },
    {
      name: 'region',
      type: 'select',
      label: 'Bundesland',
      options: [
        { label: 'Wien', value: 'wien' },
        { label: 'Niederösterreich', value: 'noe' },
        { label: 'Oberösterreich', value: 'ooe' },
        { label: 'Steiermark', value: 'stmk' },
        { label: 'Tirol', value: 'tirol' },
        { label: 'Salzburg', value: 'salzburg' },
        { label: 'Kärnten', value: 'kaernten' },
        { label: 'Vorarlberg', value: 'vorarlberg' },
        { label: 'Burgenland', value: 'burgenland' },
      ],
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adresse',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'tier',
      type: 'select',
      label: 'Profilstufe',
      options: [
        { label: 'Basisprofil (kostenlos)', value: 'basic' },
        { label: 'Verifiziertes Profil', value: 'verified' },
        { label: 'Spezialist:innenprofil Plus', value: 'plus' },
      ],
      defaultValue: 'basic',
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Verifiziert',
      defaultValue: false,
    },
    {
      name: 'photo',
      type: 'upload',
      label: 'Foto',
      relationTo: 'media',
    },
  ],
}
