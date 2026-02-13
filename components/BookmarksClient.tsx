'use client'

import { useState } from 'react'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'

interface BookmarkItem {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

interface Props {
  userId: string
  initialBookmarks: BookmarkItem[]
}

export default function BookmarksClient({
  userId,
  initialBookmarks,
}: Props) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(
    initialBookmarks || []
  )

  return (
    <>
      <BookmarkForm userId={userId} setBookmarks={setBookmarks} />
      <div className="mt-8">
        <BookmarkList
          userId={userId}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
        />
      </div>
    </>
  )
}
