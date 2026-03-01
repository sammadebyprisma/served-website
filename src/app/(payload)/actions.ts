'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import type { ServerFunctionArgs } from 'payload'

export const serverFunction = async (args: ServerFunctionArgs) => {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
  })
}
