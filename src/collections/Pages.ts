import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { SystemBlock } from '../blocks/SystemBlock'
import { FeatureDuoBlock } from '../blocks/FeatureDuoBlock'
import { PhoneShowcaseBlock } from '../blocks/PhoneShowcaseBlock'
import { KitchenBlock } from '../blocks/KitchenBlock'
import { TaglineBlock } from '../blocks/TaglineBlock'
import { DetailBlock } from '../blocks/DetailBlock'
import { WaitlistBlock } from '../blocks/WaitlistBlock'
import { QuestionMarqueeBlock } from '../blocks/QuestionMarqueeBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path segment (e.g. "home" → serves at /)',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Sections',
      blocks: [
        HeroBlock,
        SystemBlock,
        FeatureDuoBlock,
        PhoneShowcaseBlock,
        KitchenBlock,
        TaglineBlock,
        DetailBlock,
        WaitlistBlock,
        QuestionMarqueeBlock,
      ],
    },
  ],
}
