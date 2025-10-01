'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-7xl h-24 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold flex flex-row">

          <Image
          src={"/budget-track.png"}
          alt="Budget Track"
          width={140}
          height={40}
          
          />
       
        </div>
        <div className="ml-auto flex items-center gap-2">
          <UserButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}


