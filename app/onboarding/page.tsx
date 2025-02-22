'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const steps = [
  {
    id: 'usage',
    question: 'How do you want to use nextBook?',
    options: ['Challenge Your Reading Level', 'Read for Fun']
  },
  {
    id: 'level',
    question: 'What is your current reading level?',
    subtext: '*lexile score or grade level*',
    type: 'input',
    placeholder: 'Type Here...'
  },
  {
    id: 'genres',
    question: 'What book genres do you like?',
    subtext: 'e.g.) Adventure, Science, Fantasy, etc.',
    type: 'input',
    placeholder: 'Type Here...'
  },
  {
    id: 'favorites',
    question: 'What are some of your favorite books in that genre?',
    type: 'input',
    placeholder: 'Type Here...'
  },
  {
    id: 'story',
    question: 'Describe a cool story that you would like to read',
    subtext: 'e.g.) "A young magician learns magic to save the world"',
    optional: true,
    type: 'input',
    placeholder: 'Type Here...'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/recommendations')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/')
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-accent/30">
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <button
          onClick={handleBack}
          className="fixed left-8 top-8 p-3 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        <div className="h-[30vh]" /> {/* Added spacing to move content down */}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  <span className="text-purple-400">*</span>
                  {steps[currentStep].question}
                  <span className="text-purple-400">*</span>
                </h2>
              </div>
              {steps[currentStep].subtext && (
                <p className="text-primary/60 text-lg">{steps[currentStep].subtext}</p>
              )}
            </div>

            {steps[currentStep].type === 'input' ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-full py-4 px-6 pr-12 text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary/50 shadow-lg"
                    placeholder={steps[currentStep].placeholder}
                    value={answers[steps[currentStep].id] || ''}
                    onChange={(e) => setAnswers({
                      ...answers,
                      [steps[currentStep].id]: e.target.value
                    })}
                  />
                  <button 
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                {steps[currentStep].optional && (
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="w-full text-primary/60 hover:text-primary hover:bg-white/50"
                  >
                    Skip this question
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {steps[currentStep].options?.map((option) => (
                  <Button
                    key={option}
                    onClick={() => {
                      setAnswers({
                        ...answers,
                        [steps[currentStep].id]: option
                      })
                      handleNext()
                    }}
                    className="w-full py-6 bg-white/80 hover:bg-white backdrop-blur-sm border-2 border-primary/20 text-primary font-semibold text-lg rounded-2xl"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

