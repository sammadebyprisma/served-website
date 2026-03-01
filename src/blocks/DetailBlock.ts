import type { Block } from 'payload'

export const DetailBlock: Block = {
  slug: 'detail',
  labels: {
    singular: 'Detail Section',
    plural: 'Detail Sections',
  },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section Anchor ID (e.g. "replenishment", "hardware")',
      admin: {
        description: 'Used for in-page navigation links. Keep lowercase, no spaces.',
      },
    },
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker (small eyebrow label)',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'checkItems',
      type: 'array',
      label: 'Feature Checklist Items',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Item Text',
        },
        {
          name: 'light',
          type: 'checkbox',
          label: 'Light text (for dark backgrounds)',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Section Image',
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'dark',
      options: [
        { label: 'Dark Green', value: 'dark' },
        { label: 'Cream', value: 'light' },
        { label: 'Warm Yellow', value: 'warm' },
        { label: 'Dark Plum', value: 'plum' },
      ],
    },
    {
      name: 'reversed',
      type: 'checkbox',
      label: 'Reversed layout (image on left, text on right)',
      defaultValue: false,
    },
  ],
}
