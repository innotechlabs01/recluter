import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/como-funciona(.*)',
  '/beneficios(.*)',
  '/faq(.*)',
  '/terminos(.*)',
  '/contacto(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/role-selection(.*)',
  '/api/webhooks(.*)',
  '/api/jobs(.*)',
  '/api/testimonials(.*)',
  '/testimonio(.*)',
  '/api/cron(.*)', // external scheduler — guarded by CRON_SECRET in the handler
  '/empleos(.*)',
])

const isEmpresaRoute = createRouteMatcher(['/empresa(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isCandidatoRoute = createRouteMatcher(['/candidato(.*)'])
const isReclutadorRoute = createRouteMatcher(['/reclutador(.*)'])

function handleRoleRedirect(req: NextRequest, role: string) {
  // If user is on wrong portal, redirect to correct one
  if (isAdminRoute(req) && role !== 'admin') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/role-selection'
    return Response.redirect(new URL(redirectTo, req.url))
  }

  if (isEmpresaRoute(req) && role !== 'company') {
    const redirectTo = role === 'admin' ? '/admin/dashboard' : role === 'candidate' ? '/candidato/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/role-selection'
    return Response.redirect(new URL(redirectTo, req.url))
  }

  if (isCandidatoRoute(req) && role !== 'candidate') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'admin' ? '/admin/dashboard' : role === 'recruiter' ? '/reclutador/dashboard' : '/role-selection'
    return Response.redirect(new URL(redirectTo, req.url))
  }

  if (isReclutadorRoute(req) && role !== 'recruiter') {
    const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : '/role-selection'
    return Response.redirect(new URL(redirectTo, req.url))
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return

  // Read role from cookie (JWT doesn't include unsafeMetadata by default in Clerk)
  const role = req.cookies.get('user_role')?.value as string | undefined

  // E2E bypass: simulated cookie auth (E2E_BYPASS_CLERK=1, test env only).
  // Real Clerk sessions still go through protect() below.
  if (process.env.E2E_BYPASS_CLERK === '1' && role) {
    // Admin passthrough: admins can access any portal
    if (role === 'admin') return
    return handleRoleRedirect(req, role)
  }

  // Protect all other routes
  await auth.protect()

  // Role-based redirect after auth
  if (role) {
    // Admin passthrough: admins can access any portal
    if (role === 'admin') return
    return handleRoleRedirect(req, role)
  } else {
    // No role cookie set yet — redirect to role selection
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req) || isReclutadorRoute(req)) {
      return Response.redirect(new URL('/role-selection', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
