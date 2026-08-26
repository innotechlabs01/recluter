import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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
])

const isEmpresaRoute = createRouteMatcher(['/empresa(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isCandidatoRoute = createRouteMatcher(['/candidato(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return

  // Protect all other routes
  await auth.protect()

  // Role-based redirect after auth
  // Read role from cookie (JWT doesn't include unsafeMetadata by default in Clerk)
  const role = req.cookies.get('user_role')?.value as string | undefined

  if (role) {
    // If user is on wrong portal, redirect to correct one
    if (isAdminRoute(req) && role !== 'admin') {
      const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'candidate' ? '/candidato/dashboard' : '/role-selection'
      return Response.redirect(new URL(redirectTo, req.url))
    }
    
    if (isEmpresaRoute(req) && role !== 'company') {
      const redirectTo = role === 'admin' ? '/admin/dashboard' : role === 'candidate' ? '/candidato/dashboard' : '/role-selection'
      return Response.redirect(new URL(redirectTo, req.url))
    }
    
    if (isCandidatoRoute(req) && role !== 'candidate') {
      const redirectTo = role === 'company' ? '/empresa/dashboard' : role === 'admin' ? '/admin/dashboard' : '/role-selection'
      return Response.redirect(new URL(redirectTo, req.url))
    }
  } else {
    // No role cookie set yet — redirect to role selection
    if (isEmpresaRoute(req) || isAdminRoute(req) || isCandidatoRoute(req)) {
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
