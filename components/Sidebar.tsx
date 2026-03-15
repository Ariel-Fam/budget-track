'use client'


import { X, CircleDollarSign, PiggyBank, LineChart, Target, Info } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useCallback, useEffect } from 'react'
import Image from 'next/image'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  // Close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const onNavigate = useCallback(
    (hash: string) => {
      window.location.hash = hash
      onClose()
    },
    [onClose]
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white text-black border-r p-4 flex flex-col gap-2 transition-transform shadow-lg',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold">Navigate</span>
          <Button variant="outline" size="icon" aria-label="Close menu" onClick={onClose}>
            <X />
          </Button>
        </div>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate('expenses')}>
            <CircleDollarSign className="mr-2" /> Expenses
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate('savings')}>
            <PiggyBank className="mr-2" /> Savings
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate('investments')}>
            <LineChart className="mr-2" /> Investments
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate('goals')}>
            <Target className="mr-2" /> Savings Goals
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate('literacy')}>
            <Info className="mr-2" /> Financial Literacy
          </Button>

          <Image className="mt-7" src="/softwareLogo.png" alt="Budget Track" width={100} height={32} />
        </nav>
        <div className="mt-auto text-xs text-muted-foreground">Press Esc to close</div>
      </aside>
    </>
  )
}

