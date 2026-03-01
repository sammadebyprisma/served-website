import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow text (small label above headline)',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline (e.g. "What\'s for dinner?")',
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Primary CTA Button',
      fields: [
        { name: 'label', type: 'text', label: 'Button Label' },
        { name: 'href', type: 'text', label: 'Button URL' },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      label: 'Secondary CTA Button',
      fields: [
        { name: 'label', type: 'text', label: 'Button Label' },
        { name: 'href', type: 'text', label: 'Button URL' },
      ],
    },
    {
      name: 'bowlLeftImage',
      label: 'Bowl / Food Image (Left)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bowlRightImage',
      label: 'Bowl / Food Image (Right)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
