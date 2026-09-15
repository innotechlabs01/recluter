import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { getResolvedRole } from '@/lib/role-server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/como-funciona(.*)',
  '/beneficios(.*)',
  '/faq(.*)',
  '/terminos(.*)',
  '/contacto(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
  '/api/webhooks(.*)',
  '/api/jobs(.*)',
  '/api/testimonials(.*)',
  '/testimonio(.*)',
  '/api/cron(.*)',
  '/empleos(.*)',
])

const isEmpresaRoute = createRouteMatcher(['/empresa(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isCandidatoRoute = createRouteMatcher(['/candidato(.*)'])
const isReclutadorRoute = createRouteMatcher(['/reclutador(.*)'])

function handleRoleRedirect(req: NextRequest, role: string) {
  if (isAdminRoute(req) && role !== 'admin') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isEmpresaRoute(req) && role !== 'company') {
    const redirectTo = role === 'admin' ? '/admin/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isCandidatoRoute(req) && role !== 'candidate') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'admin' ? '/admin/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
  if (isReclutadorRoute(req) && role !== 'recruiter') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'admin' ? '/admin/dashboard' : '/onboarding'
    return Response.redirect(new URL(redirectTo, req.url))
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  // E2E bypass: simulated cookie auth
  if (process.env.E2E_BYPASS_CLERK === '1') {
    const role = req.cookies.get('user_role')?.value
    if (role === 'admin') return
    if (role) return handleRoleRedirect(req, role)
    // No role cookie in E2E → redirect to onboarding
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req) || isReclutadorRoute(req)) {
      return Response.redirect(new URL('/onboarding', req.url))
    }
    return
  }

  // Protect all other routes
  await auth.protect()

  // Get userId from Clerk session
  const { userId } = await auth()
  if (!userId) {
    return Response.redirect(new URL('/sign-in', req.url))
  }

  // Resolve role from DATABASE (not cookie)
  const role = await getResolvedRole(userId)

  if (role) {
    if (role === 'admin') return
    return handleRoleRedirect(req, role)
  } else {
    // No role in DB → redirect to onboarding
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req) || isReclutadorRoute(req)) {
      return Response.redirect(new URL('/onboarding', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
