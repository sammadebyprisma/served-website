import type { Block } from 'payload'

export const WaitlistBlock: Block = {
  slug: 'waitlist',
  labels: {
    singular: 'Waitlist CTA',
    plural: 'Waitlist CTAs',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker (eyebrow label)',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
    },
    {
      name: 'inputPlaceholder',
      type: 'text',
      label: 'Email Input Placeholder',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: 'Success Message (shown after signup)',
      defaultValue: "You're on the list! We'll be in touch soon.",
    },
  ],
}
