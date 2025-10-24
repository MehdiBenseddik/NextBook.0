'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

function SmallSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  )
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // final step completed -> submit answers to API
      await handleSubmit()
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
    // mark as skipped and move on
    setAnswers((prev) => ({ ...prev, [steps[currentStep].id]: 'Skipped' }))
    handleNext()
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const data = await res.json()
      if (!res.ok) {
        // Show a friendly message to the user. The server will log full details.
        const details = data?.details || data?.error || 'Failed to get recommendations'
        setApiError(details)
        setIsSubmitting(false)
        return
      }

      // encode JSON results and navigate to recommendations page
      const encoded = encodeURIComponent(JSON.stringify(data.recommendations))
      router.push(`/recommendations?recs=${encoded}`)
    } catch (err) {
      console.error('submit error', err)
      alert('Failed to generate recommendations. Check server logs or network tab for details.')
    } finally {
      setIsSubmitting(false)
    }
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
                {apiError && (
                  <div className="mx-auto max-w-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {apiError}
                  </div>
                )}
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
                    disabled={isSubmitting}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${isSubmitting ? 'bg-primary/30 cursor-not-allowed' : 'bg-primary/10 hover:bg-primary/20'} text-primary`}
                  >
                    {isSubmitting ? <SmallSpinner /> : <ArrowRight className="w-5 h-5" />}
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
                      if (!isSubmitting) handleNext()
                    }}
                    className="w-full py-6 bg-white/80 hover:bg-white backdrop-blur-sm border-2 border-primary/20 text-primary font-semibold text-lg rounded-2xl"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {/* Submit / Retry area */}
            {apiError && (
              <div className="flex flex-col items-center gap-2">
                <Button variant="destructive" onClick={() => { setApiError(null); handleSubmit(); }} disabled={isSubmitting}>
                  {isSubmitting ? <SmallSpinner /> : 'Retry'}
                </Button>
                <p className="text-sm text-muted-foreground">If this keeps happening, check your OpenAI key and restart the dev server.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

