import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import { serverFunction } from './actions'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
