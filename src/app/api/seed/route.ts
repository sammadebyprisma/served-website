import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST() {

  try {
    const payload = await getPayload({ config })

    // Skip if home page already exists
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        message: 'Home page already exists — nothing to seed',
        id: existing.docs[0].id,
      })
    }

    // ── Create the home page with all sections ────────────────────
    const page = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [

          // 1. Hero
          {
            blockType: 'hero',
            eyebrow: 'Now accepting early SIGNUPS',
            headline: "What's for dinner?",
            subheadline: 'Your AI kitchen assistant for smart grocery management.',
            primaryCTA:   { label: 'Join the Waitlist', href: '#waitlist' },
            secondaryCTA: { label: 'See How It Works', href: '#how-it-works' },
          },

          // 2. System (scrolling pill rows)
          {
            blockType: 'system',
            kicker: 'The Served System',
            heading: 'Make dinner happen.',
            description: 'Served connects your pantry, your recipes, and your grocery store into one seamless AI ecosystem.',
          },

          // 3. Phone showcase
          {
            blockType: 'phoneShowcase',
          },

          // 4. Feature duo (Knows + Recipe cards)
          {
            blockType: 'featureDuo',
            cards: [
              {
                title: 'Knows what you have.',
                description: "Capture and keep track of what's in your fridge and pantry.",
                variant: 'dark',
              },
              {
                title: 'What to do with it.',
                description: "Tailored recipe suggestions based on what's in stock.",
                variant: 'warm',
              },
            ],
          },

          // 5. Kitchen panel
          {
            blockType: 'kitchen',
            heading: 'When to get more of it.',
            subheading: 'Reorder essentials or exactly what you need.',
          },

          // 6. Scrolling tagline
          {
            blockType: 'tagline',
            text: 'Everything except the dishes.',
          },

          // 7. Replenishment detail (dark)
          {
            blockType: 'detail',
            sectionId: 'replenishment',
            kicker: 'Replenishment Layer',
            heading: 'Smart ordering to restock and replenish.',
            description: 'Advanced computer vision manages your pantry and fridge inventory to restock your groceries based on your usage — so you never run out again.',
            backgroundColor: 'dark',
            reversed: false,
            checkItems: [
              { text: 'Retailer integration with Walmart, Instacart, and major grocery partners', light: true },
              { text: 'Automated grocery fulfillment based on your real usage patterns', light: true },
              { text: 'Smart substitution suggestions when preferred items are out of stock', light: true },
              { text: 'Budget-aware ordering with weekly spend summaries and controls', light: true },
            ],
          },

          // 8. AI Chef detail (light / reversed)
          {
            blockType: 'detail',
            sectionId: 'hardware',
            kicker: 'Your AI Chef',
            heading: 'Like having a personal chef who never clocks out.',
            description: 'Served is an always-on AI kitchen assistant that learns what you cook, knows what you have, and takes action on your behalf — from suggesting tonight\'s dinner to restocking your fridge before you run out.',
            backgroundColor: 'light',
            reversed: true,
            checkItems: [
              { text: 'Learns your preferences, dietary needs, and cooking habits over time', light: false },
              { text: 'Proactively suggests meals based on what\'s actually in your kitchen', light: false },
              { text: 'Automatically reorders groceries before you run out', light: false },
              { text: "Gets smarter with every meal — adapting to your household's rhythm", light: false },
            ],
          },

          // 9. Waitlist CTA (includes embedded question marquee)
          {
            blockType: 'waitlist',
            kicker: 'Early Access',
            heading: 'Make dinner happen.',
            subheading: 'Join the Served waitlist and be first to experience kitchen intelligence that actually works.',
            buttonLabel: 'Join Waitlist',
            inputPlaceholder: 'Enter your email',
            successMessage: "You're on the list! We'll be in touch soon.",
          },

        ],
      },
    })

    return NextResponse.json({ message: 'Seeded successfully', id: page.id })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
