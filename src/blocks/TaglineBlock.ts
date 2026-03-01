import type { Block } from 'payload'

export const TaglineBlock: Block = {
  slug: 'tagline',
  labels: {
    singular: 'Scrolling Tagline',
    plural: 'Scrolling Taglines',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Tagline Text (scrolls on repeat)',
    },
  ],
}
