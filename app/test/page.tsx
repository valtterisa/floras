'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function Component() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Hook into a backend or service like Formspree/Resend/Supabase
    alert('Message sent!')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <main className="flex flex-col gap-16 px-6 py-10 md:px-20 lg:px-32 text-center">
      {/* Hero */}
       <section className="relative w-full min-h-screen bg-background flex items-center justify-center px-6 py-24 md:py-32 lg:px-12">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Welcome to <span className="text-primary">Bittive</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Experience the perfect blend of flavor, ambiance, and hospitality. Discover your new favorite restaurant in the heart of the city.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" className="rounded-2xl">
            Book a Table
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl" asChild>
            <a href="#menu" className="flex items-center gap-2">
              View Menu <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Optional background image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url('/images/restaurant-hero.jpg')] bg-cover bg-center opacity-20 dark:opacity-10"
      />
    </section>

      {/* Menu Highlights */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-semibold">Signature Dishes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Nepalese Butter Chicken', image: '/dishes/butter-chicken.jpg' },
            { name: 'Garlic Naan Deluxe', image: '/dishes/garlic-naan.jpg' },
            { name: 'Spicy Veggie Momos', image: '/dishes/momos.jpg' },
          ].map((dish) => (
            <Card key={dish.name} className="rounded-2xl overflow-hidden shadow-md">
              <Image
                src={dish.image}
                alt={dish.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="font-medium">{dish.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold">About Us</h2>
        <p className="text-muted-foreground">
          Founded with love and bold flavors, Bittive offers an elevated yet cozy dining experience.
          Our chefs blend authentic traditions with creative flair, crafting a menu that satisfies every palate.
        </p>
      </section>

      {/* Gallery */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-semibold">Our Space</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Image
              key={i}
              src={`/interior/interior-${i}.jpg`}
              alt={`Interior ${i}`}
              width={400}
              height={300}
              className="rounded-2xl object-cover h-40 w-full"
            />
          ))}
        </div>
      </section>

      {/* Contact / Reservation Form */}
      <section className="flex flex-col items-center gap-4 max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold">Get in Touch</h2>
        <p className="text-muted-foreground">
          Questions or reservations? Drop us a message.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
          <Input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
          />
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </section>

      <footer className="text-muted-foreground text-sm mt-10">
        © {new Date().getFullYear()} Bittive. All rights reserved.
      </footer>
    </main>
  )
}
