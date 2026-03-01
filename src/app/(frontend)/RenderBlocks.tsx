import React from 'react'
import { HeroSection } from './components/HeroSection'
import { SystemSection } from './components/SystemSection'
import { PhoneShowcaseSection } from './components/PhoneShowcaseSection'
import { FeatureDuoSection } from './components/FeatureDuoSection'
import { KitchenSection } from './components/KitchenSection'
import { TaglineSection } from './components/TaglineSection'
import { DetailSection } from './components/DetailSection'
import { WaitlistSection } from './components/WaitlistSection'
import { QuestionMarqueeSection } from './components/QuestionMarqueeSection'

type Block = {
  blockType: string
  id?: string
  [key: string]: unknown
}

type Props = {
  blocks: Block[]
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  system: SystemSection,
  phoneShowcase: PhoneShowcaseSection,
  featureDuo: FeatureDuoSection,
  kitchen: KitchenSection,
  tagline: TaglineSection,
  detail: DetailSection,
  waitlist: WaitlistSection,
  questionMarquee: QuestionMarqueeSection,
}

export function RenderBlocks({ blocks }: Props) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id ?? i} {...block} />
      })}
    </>
  )
}
