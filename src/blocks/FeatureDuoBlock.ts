import type { Block } from 'payload'

export const FeatureDuoBlock: Block = {
  slug: 'featureDuo',
  labels: {
    singular: 'Feature Duo (Three Pillars)',
    plural: 'Feature Duo Sections',
  },
  fields: [
    {
      name: 'knowsSlider',
      type: 'group',
      label: '"Knows What You Have" Slider Images',
      fields: [
        {
          name: 'slide1',
          label: 'Slide 1',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'slide2',
          label: 'Slide 2',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'slide3',
          label: 'Slide 3',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Feature Cards',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Card Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Card Description',
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Card Style',
          defaultValue: 'dark',
          options: [
            { label: 'Dark (deep green)', value: 'dark' },
            { label: 'Warm (yellow)', value: 'warm' },
          ],
        },
        {
          name: 'image',
          label: 'Card Image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
