import type { Block } from 'payload'

export const SystemBlock: Block = {
  slug: 'system',
  labels: {
    singular: 'System / Value Prop',
    plural: 'System / Value Prop Sections',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker (e.g. "The Served System")',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (e.g. "Make dinner happen.")',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'ingredients',
      type: 'array',
      label: 'Ingredient Pills',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Ingredient Name',
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Highlighted (active state)',
          defaultValue: false,
        },
      ],
    },
  ],
}
