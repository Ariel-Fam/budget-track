"use client"

import { Authenticated, Unauthenticated } from 'convex/react'

import PageContentClient from "@/components/PageContentClient"
import SignInLanding from './sign-in/page'


export default function Home() {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>

        <SignInLanding />
        
      </Unauthenticated>
    </>
  )
}

function Content() {
  return <PageContentClient />
}