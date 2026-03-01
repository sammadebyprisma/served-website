import type { Block } from 'payload'

export const KitchenBlock: Block = {
  slug: 'kitchen',
  labels: {
    singular: 'Kitchen Panel',
    plural: 'Kitchen Panels',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'inventoryItems',
      type: 'array',
      label: 'Inventory Items',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Item Name',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Item Image',
        },
        {
          name: 'amount',
          type: 'text',
          label: 'Amount / Quantity (e.g. "2 left")',
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Status Tag (e.g. "Low stock", "Fresh")',
        },
        {
          name: 'checked',
          type: 'checkbox',
          label: 'Checked off',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'primaryAction',
      type: 'text',
      label: 'Primary Button Label',
    },
    {
      name: 'primaryActionIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Primary Button Icon',
    },
    {
      name: 'secondaryAction',
      type: 'text',
      label: 'Secondary Button Label',
    },
    {
      name: 'secondaryActionIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Secondary Button Icon',
    },
  ],
}
