'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AuthButtonProps {
  user: User | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createBrowserSupabaseClient()

  const handleSignIn = async () => {
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={user.user_metadata?.avatar_url}
          />
          <AvatarFallback>
            {user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          variant="outline"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Google
    </Button>
  )
}
