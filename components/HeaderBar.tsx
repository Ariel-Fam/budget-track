'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'

export default function HeaderBar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-7xl h-16 px-4 py-3 flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          <div className="font-semibold flex items-center">
            <Image
              src="/budget-track.png"
              alt="Budget Track"
              width={120}
              height={32}
              priority
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <UserButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  )
}


