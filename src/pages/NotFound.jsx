import { useEffect } from 'react'
import { Button, Container, Eyebrow } from '../components/ui'

export default function NotFound() {
  useEffect(() => { document.title = 'Page not found' }, [])
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24">
      <div className="bg-grid mask-fade absolute inset-0" aria-hidden="true" />
      <Container className="relative text-center">
        <Eyebrow>Signal lost · 404</Eyebrow>
        <h1 className="mt-6 text-5xl font-bold sm:text-7xl">No feed on this <span className="text-gradient">camera.</span></h1>
        <p className="mx-auto mt-5 max-w-md text-muted">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-9 flex justify-center"><Button to="/">Back to home</Button></div>
      </Container>
    </section>
  )
}
