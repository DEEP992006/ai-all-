import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// 🔐 Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

// 🛡️ Clerk middleware for authentication and route protection
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, redirectToSignIn, sessionStatus } = await auth()

  // ⏳ Send users with pending sessions to the /session-tasks page
  if (!isAuthenticated && sessionStatus === 'pending' && isProtectedRoute(req)) {
    // 🔄 Redirect pending users to the /session-tasks page
    // so they can fulfill the session tasks
    const url = req.nextUrl.clone()
    url.pathname = '/session-tasks'
    return NextResponse.redirect(url)
  }

  // 🚫 Send users who are not authenticated
  // and don't have pending tasks to the sign-in page
  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn()
  }
})