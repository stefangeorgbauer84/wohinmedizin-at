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
