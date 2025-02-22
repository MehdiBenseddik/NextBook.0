'use client'

import { motion } from 'framer-motion'
import { BookOpen, Brain, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function MissionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/30">
      <div className="container mx-auto px-4 py-16">
        {/* Crisis Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            The <span className="text-primary">Literacy Crisis</span> In America
          </h1>
          <p className="text-xl text-center mb-12 text-muted-foreground">
            "One of the most concerning, yet most solvable problems of our time."
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-4xl font-bold text-primary mb-2">68%</h3>
              <p className="text-sm text-muted-foreground">
                of U.S. 4th graders scored BELOW proficient in reading in 2022.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                —National Assessment of Educational Progress (NAEP)
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-4xl font-bold text-primary mb-2">81%</h3>
              <p className="text-sm text-muted-foreground">
                of U.S. 4th graders who qualify for free and reduced lunch scored BELOW proficient in reading.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                —National Assessment of Educational Progress (NAEP)
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-4xl font-bold text-primary mb-2">130M</h3>
              <p className="text-sm text-muted-foreground">
                adults in the U.S. have low literacy skills. More than half (54%) of Americans between the ages of 16 and 74 read below the equivalent of a 6th-grade level.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                —Gallup analysis of data from the U.S. Dept of Education
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Issue Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            The <span className="text-primary">Issue</span>
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <blockquote className="text-xl text-muted-foreground italic mb-4">
              "They want to do something. They don't— it's not that they want to learn the alphabet. They want to learn about the world. They want to have an impact on the world."
            </blockquote>
            <p className="text-sm text-muted-foreground">
              - Language and literacy pioneer, Catherine Snow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Over-emphasis on phonics',
                description: 'Traditional methods focus too much on mechanics, not enough on engagement.'
              },
              {
                icon: Brain,
                title: 'Habit of Reading Needs to Develop',
                description: 'Reading should be an enjoyable daily activity, not a chore.'
              },
              {
                icon: Lightbulb,
                title: 'Children read to explore',
                description: 'Kids want to discover the world through books, not just learn letters.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Solution Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">
            Introducing <span className="text-primary">NextBook</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-lg">
                NextBook aims to empower students to read books that they will both
                <span className="text-primary font-semibold"> enjoy </span>
                and
                <span className="text-primary font-semibold"> benefit </span>
                from.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '01', title: 'Make Reading', highlight: 'Fun' },
                { number: '02', title: 'Expanding', highlight: 'Literacy' },
                { number: '03', title: 'Books that children', highlight: 'resonate with' },
                { number: '04', title: 'Powered by', highlight: 'GPT-4' }
              ].map((item, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-primary font-mono mb-1">{item.number}</div>
                  <div className="text-sm">
                    {item.title}{' '}
                    <span className="text-primary font-semibold">{item.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push('/onboarding')}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
            >
              Start Your Reading Journey
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

