'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useEffect, useState } from 'react'

const defaultMessages = {
  nav: {
    home: 'Inicio',
    howItWorks: 'Cómo Funciona',
    benefits: 'Beneficios',
    faq: 'FAQ',
    contact: 'Contacto',
    login: 'Iniciar sesión',
    requestPersonnel: 'Solicitar personal',
    dashboard: 'Panel',
    jobs: 'Empleos',
    candidates: 'Candidatos',
    settings: 'Configuración',
    profile: 'Mi perfil',
    notifications: 'Notificaciones',
    history: 'Historial',
    logout: 'Cerrar sesión',
  },
  admin: {
    dashboard: {
      title: 'Dashboard Administrativo',
      subtitle: 'Vista global de la plataforma',
      registeredCompanies: 'Empresas registradas',
      activeRequests: 'Solicitudes activas',
      candidatePool: 'Candidatos en pool',
      activeRecruiters: 'Reclutadores activos',
      recentRequests: 'Solicitudes recientes',
      metrics: 'Métricas',
      avgHireTime: 'Tiempo promedio de contratación',
      successRate: 'Tasa de éxito',
      monthlyRequests: 'Solicitudes este mes',
    },
    companies: {
      title: 'Empresas',
      subtitle: 'Gestión de empresas registradas',
      industry: 'Industria',
      location: 'Ubicación',
      users: 'Usuarios',
      requests: 'Solicitudes',
    },
    requests: {
      title: 'Solicitudes',
      subtitle: 'Todas las solicitudes de las empresas',
      company: 'Empresa',
      position: 'Cargo',
      recruiter: 'Reclutador',
      candidates: 'Candidatos',
      unassigned: 'Sin asignar',
    },
    recruiters: {
      title: 'Reclutadores',
      subtitle: 'Equipo interno de reclutamiento',
      specialty: 'Especialidad',
      active: 'Activos',
      completed: 'Completados',
    },
    candidatos: {
      title: 'Candidatos',
      subtitle: 'Pool de candidatos disponibles',
      name: 'Nombre',
      email: 'Email',
      specialty: 'Especialidad',
      experience: 'Experiencia',
      rating: 'Calificación',
      status: 'Estado',
      available: 'Disponible',
      inProcess: 'En proceso',
      hired: 'Contratado',
    },
    history: {
      title: 'Historial',
      subtitle: 'Historial completo de la plataforma',
      comingSoon: 'Próximamente',
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Configuración del sistema',
      comingSoon: 'Próximamente',
    },
  },
  empresa: {
    dashboard: {
      welcome: 'Bienvenido',
      subtitle: 'Resumen de tus procesos de reclutamiento',
      searchPersonnel: 'Buscar personal',
      totalRequests: 'Solicitudes totales',
      activeProcesses: 'Procesos activos',
      openPositions: 'Posiciones abiertas',
      successRate: 'Tasa de éxito',
      recentRequests: 'Solicitudes recientes',
      viewAll: 'Ver todas',
      noRequests: 'No hay solicitudes aún',
      createFirst: 'Crear primera solicitud',
    },
    wizard: {
      title: 'Nueva solicitud de personal',
      step1: 'Empresa',
      step2: 'Posición',
      step3: 'Perfil',
      step4: 'Condiciones',
      step5: 'Proceso',
      step6: 'Resumen',
      companyInfo: 'Información de la empresa',
      companySubtitle: 'Datos básicos de la empresa para la solicitud',
      position: 'Posición requerida',
      positionSubtitle: 'Detalles del puesto que necesitas cubrir',
      profile: 'Perfil del candidato',
      profileSubtitle: 'Definí las características que debe tener la persona',
      conditions: 'Condiciones laborales',
      conditionsSubtitle: 'Definí las condiciones de la posición',
      selection: 'Proceso de selección',
      selectionSubtitle: 'Definí cómo querés que sea el proceso',
      review: 'Revisión y confirmación',
      reviewSubtitle: 'Revisá la información antes de enviar la solicitud',
    },
    processes: {
      title: 'Mis procesos',
      subtitle: 'Seguimiento de todas tus solicitudes de personal',
      noProcesses: 'No hay procesos activos',
    },
    candidates: {
      title: 'Candidatos',
      subtitle: 'Candidatos asociados a tus procesos de selección',
    },
    history: {
      title: 'Historial',
      subtitle: 'Todos tus procesos anteriores',
    },
  },
  candidato: {
    dashboard: {
      welcome: 'Bienvenido',
      subtitle: 'Resumen de tus procesos de postulación',
      activeApplications: 'Postulaciones activas',
      pendingInterviews: 'Entrevistas pendientes',
      availableOpportunities: 'Oportunidades disponibles',
      upcomingInterviews: 'Próximas entrevistas',
      recentUpdates: 'Últimas actualizaciones',
    },
    profile: {
      title: 'Mi perfil',
      personalInfo: 'Información personal',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      phone: 'Teléfono',
      experience: 'Experiencia profesional',
      skills: 'Habilidades',
      save: 'Guardar cambios',
    },
    opportunities: {
      title: 'Oportunidades disponibles',
      apply: 'Postularme',
    },
    applications: {
      title: 'Mis postulaciones',
      company: 'Empresa',
      position: 'Cargo',
      date: 'Fecha',
      sent: 'Enviada',
      reviewed: 'Revisada',
      shortlisted: 'Preseleccionado',
    },
    interviews: {
      title: 'Entrevistas',
      virtual: 'Virtual',
      presential: 'Presencial',
    },
    documents: {
      title: 'Documentos',
      upload: 'Arrastrá archivos aquí o hacé click para subir',
      uploaded: 'Subido hace',
      update: 'Actualizar',
      uploadNew: 'Subir nuevo documento',
      uploading: 'Subiendo...',
      formatInfo: 'Formatos aceptados: PDF, JPG, PNG. Tamaño máximo: 5MB',
    },
    notifications: {
      title: 'Notificaciones',
    },
  },
  auth: {
    roleSelection: {
      title: 'Bienvenido a Recluter',
      subtitle: '¿Cómo querés usar la plataforma?',
      company: 'Soy empresa',
      companyDesc: 'Necesito contratar personal para mi equipo',
      companyAction: 'Crear solicitud de personal →',
      candidate: 'Busco oportunidades laborales',
      candidateDesc: 'Quiero encontrar trabajo en empresas de Estados Unidos',
      candidateAction: 'Explorar oportunidades →',
      note: 'Podés cambiar tu perfil más adelante desde la configuración',
    },
  },
}

interface NextIntlProviderProps {
  children: ReactNode
}

export function NextIntlProvider({ children }: NextIntlProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/prerendering, render children without the provider
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextIntlClientProvider messages={defaultMessages}>
      {children}
    </NextIntlClientProvider>
  )
}
