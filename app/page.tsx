import { createServerClient } from '@/lib/supabase-server'

import AuthButton from '@/components/AuthButton'
import BookmarksClient from '@/components/BookmarksClient'
import { Sparkles, Zap, Shield, Globe } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerClient()


  const {
    data: { user },
  } = await supabase.auth.getUser()

  let bookmarks: any[] = []

  if (user) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      bookmarks = data
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Bookmarks
              </h1>
            </div>
            <AuthButton user={null} />
          </header>

          <main className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your bookmarks,
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  everywhere you need them
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Save, organize, and access your favorite links instantly.
                Real-time sync across all your devices. Secure and private.
              </p>
              <AuthButton user={null} />
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real-time Sync
                </h3>
                <p className="text-gray-600">
                  Add a bookmark on your phone and see it instantly appear on
                  your laptop. No refresh needed.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Private & Secure
                </h3>
                <p className="text-gray-600">
                  Your bookmarks are completely private. Only you can see them.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Globe className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Access Anywhere
                </h3>
                <p className="text-gray-600">
                  Use Smart Bookmarks on any device with a web browser.
                </p>
              </div>
            </div>
          </main>

          <footer className="mt-20 text-center text-gray-600 text-sm">
            <p>Built with Next.js, Supabase, and Tailwind CSS</p>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Bookmarks
            </h1>
          </div>
          <AuthButton user={user} />
        </header>

        <main className="max-w-7xl mx-auto">
          <BookmarksClient
            userId={user.id}
            initialBookmarks={bookmarks}
          />
        </main>

        <footer className="mt-20 text-center text-gray-600 text-sm">
          <p>
            Your bookmarks sync in real-time across all your devices. Try
            opening this page in multiple tabs!
          </p>
        </footer>
      </div>
    </div>
  )
}
