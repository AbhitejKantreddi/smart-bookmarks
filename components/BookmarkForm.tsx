'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BookmarkFormProps {
  userId: string
  setBookmarks: React.Dispatch<React.SetStateAction<any[]>>
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
      .insert([
        {
          user_id: userId,
          title,
          url,
        } as any,
      ])
      .select()
      .single()

    if (!error && data) {
      setBookmarks((prev) => [data, ...prev])
      setTitle('')
      setUrl('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button type="submit" disabled={loading}>
        <Plus className="h-4 w-4 mr-2" />
        {loading ? 'Adding...' : 'Add'}
      </Button>
    </form>
  )
}
