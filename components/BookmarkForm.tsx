'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface BookmarkFormProps {
  userId: string
  setBookmarks: any
}

export default function BookmarkForm({
  userId,
  setBookmarks,
}: BookmarkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        title,
        url,
      })
      .select()
      .single()

    if (!error && data) {
      setBookmarks((prev: any) => [data, ...prev])
      setTitle('')
      setUrl('')
      toast.success('Bookmark added!')
    } else {
      toast.error('Failed to add bookmark')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
      <Input
        placeholder="Bookmark title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button disabled={loading} className="gap-2">
        <Plus className="h-4 w-4" />
        {loading ? 'Adding...' : 'Add'}
      </Button>
    </form>
  )
}
