'use client'

import { useApp } from '../lib/AppContext'
import Navbar from '../components/ui/Navbar'
import HomeSection from '../components/sections/HomeSection'
import LetterSection from '../components/sections/LetterSection'
import RiddleSection from '../components/sections/RiddleSection'
import GiftSection from '../components/sections/GiftSection'
import GallerySection from '../components/sections/GallerySection'

const SECTIONS = {
  home: HomeSection,
  letter: LetterSection,
  riddle: RiddleSection,
  gift: GiftSection,
  gallery: GallerySection,
}

export default function HomePage() {
  const { currentPage, launched } = useApp()

  const Section = SECTIONS[currentPage] || HomeSection

  return (
    <main className="relative min-h-screen z-10">
      <Navbar />
      <div key={currentPage} className="page-enter">
        <Section />
      </div>
    </main>
  )
}
