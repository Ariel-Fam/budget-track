'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, PieChart, Wallet2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SignInButton, SignUpButton } from '@clerk/nextjs'



export default function SignInLanding() {
  const router = useRouter()

  return (
    <div className="bg-white dark:text-black">
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-black">Budget Track</h1>
          <p className="text-lg text-black dark:text-black">Track expenses, build savings, and visualize investments — all in one place.</p>
          <div className="flex gap-3">



            <div className='flex flex-row p-5'>



                <div className='bg-blue-500 p-4 rounded-xl hover:bg-green-500 mr-4'>


                    <SignInButton />


                </div>



                <div className='bg-blue-500 p-4 rounded-xl hover:bg-green-500'>

                    <SignUpButton />

                </div>



            </div>

           
          </div>
        </div>
        <div className="flex justify-center">
          <Image src="/budget-track.png" alt="Budget Track" width={520} height={360} className="rounded-xl border" />
        </div>
      </section>

      <section className="bg-[var(--sidebar)] text-black dark:text-black py-16">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-6">
          <Card className="bg-card text-black dark:text-black">
            <CardHeader className="flex flex-row items-center gap-2">
              <Wallet2 className="text-primary" />
              <CardTitle>Log Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              Add purchases by category and see totals by month.
            </CardContent>
          </Card>
          <Card className="bg-card text-black dark:text-black">
            <CardHeader className="flex flex-row items-center gap-2">
              <CheckCircle className="text-green-600" />
              <CardTitle>Grow Savings</CardTitle>
            </CardHeader>
            <CardContent>
              Track deposits and set goals with monthly increments.
            </CardContent>
          </Card>
          <Card className="bg-card text-black dark:text-black">
            <CardHeader className="flex flex-row items-center gap-2">
              <PieChart className="text-accent" />
              <CardTitle>Visualize</CardTitle>
            </CardHeader>
            <CardContent>
              Clear charts for categories, months, savings, and investments.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 dark:text-black">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-black">Ready to take control of your money?</h2>
          <p className="text-black dark:text-black">Create your account now and start tracking in minutes.</p>


            <div className="flex items-center justify-center">
            {
                
                <div className='bg-blue-500 p-4 rounded-xl hover:bg-green-500'>

                    <SignUpButton />
                </div>
            

            }
            </div>
        </div>
      </section>
    </div>
  )
}


