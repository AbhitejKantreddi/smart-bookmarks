'use client'

import { useEffect, useMemo } from 'react'
import { Trash2, ExternalLink, Copy, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

interface BookmarkItem {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkListProps {
  userId: string
  bookmarks: BookmarkItem[]
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkItem[]>>
}

export default function BookmarkList({
  userId,
  bookmarks,
  setBookmarks,
}: BookmarkListProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  useEffect(() => {
    const channel = supabase.channel('bookmarks-changes')

    channel.on(
      'postgres_changes' as any, // ✅ FIX overload issue
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        if (payload.eventType === 'INSERT') {
          const newBookmark = payload.new as BookmarkItem

          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev
            return [newBookmark, ...prev]
          })
        }

        if (payload.eventType === 'DELETE') {
          const deletedBookmark = payload.old as BookmarkItem

          setBookmarks((prev) =>
            prev.filter((b) => b.id !== deletedBookmark.id)
          )
        }
      }
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, setBookmarks])

  const handleDelete = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) toast.error('Delete failed')
  }

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url)
    toast.success('URL copied!')
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border shadow-lg">
        <Bookmark className="h-8 w-8 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">
          No bookmarks yet
        </h3>
        <p className="text-gray-600">
          Add your first bookmark above.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => {
        const faviconUrl = getFaviconUrl(bookmark.url)

        return (
          <div
            key={bookmark.id}
            className="group bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              {faviconUrl && (
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-8 h-8 rounded-lg"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {bookmark.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    new Date(bookmark.created_at),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            </div>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline block mb-4 truncate"
            >
              {bookmark.url}
            </a>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a href={bookmark.url} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(bookmark.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(bookmark.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
