'use client'

import { Book, BookOpen } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 rounded-full bg-primary/10 hover:bg-primary/20"
    >
      {theme === 'regular' ? (
        <BookOpen className="h-6 w-6" />
      ) : (
        <Book className="h-6 w-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

