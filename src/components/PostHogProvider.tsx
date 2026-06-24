'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'
    if (!key) return
    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // Next.js Router Events handle pageviews
      capture_pageleave: true,
      persistence: 'memory', // DSGVO: no localStorage/cookies without consent
      autocapture: false,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
