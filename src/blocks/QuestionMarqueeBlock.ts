import type { Block } from 'payload'

export const QuestionMarqueeBlock: Block = {
  slug: 'questionMarquee',
  labels: {
    singular: 'Question Marquee',
    plural: 'Question Marquees',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Marquee Rows',
      minRows: 1,
      admin: {
        description: 'Each row is a separate scrolling line. Add 2–3 rows for a stacked effect.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Row Text (repeated on scroll)',
          admin: {
            description: 'e.g. "Are we out of olive oil? · Do we have soy sauce? · What\'s for dinner?"',
          },
        },
        {
          name: 'reverse',
          type: 'checkbox',
          label: 'Scroll in reverse direction',
          defaultValue: false,
        },
      ],
    },
  ],
}
