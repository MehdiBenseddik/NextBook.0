'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Continue learning and unleash your brains potential.
            </h1>
            <p className="text-xl text-muted-foreground">
              Join millions of readers in their journey to discover amazing books!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => router.push('/onboarding')}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
              >
                Get Started
              </Button>
              <Button 
                onClick={() => router.push('/mission')}
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202024-12-29%2012.05.39%20-%20A%20playful%20and%20simplistic%20design%20of%20an%20open%20book,%20styled%20for%20kids,%20with%20a%20soft%20glow%20on%20a%20pastel-colored%20background.%20Emerging%20from%20the%20book%20are%20cheerful-9sLP3wrVE8AIROpWncIoInHj3cMeuQ.webp"
              alt="Magical book with floating letters and symbols"
              width={600}
              height={600}
              className="rounded-2xl"
            />
            <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <p className="font-bold text-2xl">1M+</p>
              <p className="text-sm">Active Students</p>
            </div>
            <div className="absolute bottom-4 left-4 bg-accent/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <p className="font-bold text-2xl">5000+</p>
              <p className="text-sm">Free Books</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 text-center">
          {[
            'Increasing Reading Skills',
            'Top-Rated Books',
            'Fun Learning Experience',
            'Track Your Progress'
          ].map((feature) => (
            <div
              key={feature}
              className="bg-primary p-6 rounded-2xl text-white space-y-2"
            >
              <div className="bg-white/20 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">{feature}</h3>
              <p className="text-sm text-white/80">Begin your reading journey with nextBook</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

