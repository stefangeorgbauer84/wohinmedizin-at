import { jsonLdString } from '@/lib/seo'

type MedicalConditionJsonLdProps = {
  name: string
  alternateName?: string[]
  description?: string
  orphaCode?: number
  icd10Code?: string
  url: string
}

export function MedicalConditionJsonLd({
  name,
  alternateName,
  description,
  orphaCode,
  icd10Code,
  url,
}: MedicalConditionJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name,
    ...(alternateName?.length ? { alternateName } : {}),
    ...(description ? { description } : {}),
    ...(icd10Code
      ? { code: { '@type': 'MedicalCode', codeValue: icd10Code, codingSystem: 'ICD-10' } }
      : {}),
    ...(orphaCode
      ? {
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'ORPHA',
            value: String(orphaCode),
          },
        }
      : {}),
    url,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
    />
  )
}

// ---------------------------------------------------------------------------
// MedicalOrganization — used on /spezialistinnen directory page
// ---------------------------------------------------------------------------

type MedicalOrganizationJsonLdProps = {
  name: string
  url: string
  description?: string
}

export function MedicalOrganizationJsonLd({ name, url, description }: MedicalOrganizationJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name,
    url,
    ...(description ? { description } : {}),
    areaServed: { '@type': 'Country', name: 'Österreich' },
    medicalSpecialty: 'Rare Diseases',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}

// ---------------------------------------------------------------------------
// AboutPage — used on /ueber-uns
// ---------------------------------------------------------------------------

type AboutPageJsonLdProps = {
  name: string
  url: string
  description: string
}

export function AboutPageJsonLd({ name, url, description }: AboutPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name,
    url,
    description,
    publisher: { '@type': 'Organization', name: 'WohinMedizin.at', url: 'https://wohinmedizin.at' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}

// ---------------------------------------------------------------------------
// Physician WebPage — used on /fuer-aerzte
// ---------------------------------------------------------------------------

export function PhysicianPageJsonLd({ url }: { url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Für Ärztinnen & Ärzte — WohinMedizin.at',
    url,
    description: 'Profil-Optionen und Ressourcen für Ärztinnen, Ärzte und Gesundheitseinrichtungen auf WohinMedizin.at.',
    audience: { '@type': 'MedicalAudience', audienceType: 'Physician' },
    publisher: { '@type': 'Organization', name: 'WohinMedizin.at', url: 'https://wohinmedizin.at' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}
