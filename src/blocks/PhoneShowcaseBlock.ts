import type { Block } from 'payload'

export const PhoneShowcaseBlock: Block = {
  slug: 'phoneShowcase',
  labels: {
    singular: 'Phone Showcase',
    plural: 'Phone Showcases',
  },
  fields: [
    {
      name: 'phoneLeft',
      label: 'Left Phone Screenshot',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phoneCenter',
      label: 'Center Phone Screenshot (featured)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phoneRight',
      label: 'Right Phone Screenshot',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
