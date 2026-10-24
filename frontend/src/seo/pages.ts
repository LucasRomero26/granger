/**
 * Single source of truth for per-page SEO metadata.
 *
 * Shared by the browser (`usePageMeta` keeps <head> in sync on client-side
 * navigation) and by the build (`plugins/seo.ts` prerenders one HTML file per
 * route so crawlers get real content in view-source). Keep this module free of
 * `@/` aliases, `import.meta.env` and DOM APIs: it also runs in Node.
 */

export type Lang = 'en' | 'es'

export const SITE_NAME = 'Granger'
export const DEFAULT_SITE_URL = 'https://grangerproject.vercel.app'
export const OG_IMAGE_PATH = '/og-image.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const THEME_COLOR = '#0b1b3a'

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', es: 'es_ES' }

type LocalizedMeta = {
  /** Full document title, unique per page. */
  title: string
  description: string
  /** Visible <h1> of the prerendered HTML. */
  heading: string
  /** Paragraph shown under the heading in the prerendered HTML. */
  intro: string
  /** Breadcrumb label. */
  label: string
}

export type PageMeta = {
  path: string
  /** Indexable pages are listed in sitemap.xml and llms.txt. */
  indexable: boolean
  /** Whether the build writes a static HTML file for this route. */
  prerender: boolean
  /** Output file inside dist/. Defaults to `<path>/index.html`. */
  file?: string
  /** Set to false to omit <link rel="canonical"> (404 and dynamic shells). */
  canonical?: boolean
  en: LocalizedMeta
  es: LocalizedMeta
}

export const PAGES = {
  home: {
    path: '/',
    indexable: true,
    prerender: true,
    en: {
      title: 'Granger | Project management with Kanban boards',
      description:
        'Granger is a project management app to plan projects, organize tasks on Kanban boards, keep notes and collaborate with your team. Plan projects, ship on time.',
      heading: 'Granger: project management with Kanban boards',
      intro:
        'Plan projects and ship on time. Granger gives your team Kanban boards, tasks, notes and role-based collaboration in one tidy workspace.',
      label: 'Home',
    },
    es: {
      title: 'Granger | Gestión de proyectos con tableros Kanban',
      description:
        'Granger es una app de gestión de proyectos para planificar, organizar tareas en tableros Kanban, tomar notas y colaborar con tu equipo. Entrega a tiempo.',
      heading: 'Granger: gestión de proyectos con tableros Kanban',
      intro:
        'Planifica proyectos y entrega a tiempo. Granger le da a tu equipo tableros Kanban, tareas, notas y colaboración por roles en un solo espacio ordenado.',
      label: 'Inicio',
    },
  },
  login: {
    path: '/auth/login',
    indexable: true,
    prerender: true,
    en: {
      title: 'Sign in | Granger',
      description:
        'Sign in to Granger to manage your projects, move tasks across Kanban boards and collaborate with your team. Email, Google and GitHub sign-in available.',
      heading: 'Sign in to Granger',
      intro: 'Start planning your projects by signing in with your email, Google or GitHub account.',
      label: 'Sign in',
    },
    es: {
      title: 'Iniciar sesión | Granger',
      description:
        'Inicia sesión en Granger para gestionar tus proyectos, mover tareas en tableros Kanban y colaborar con tu equipo. Accede con email, Google o GitHub.',
      heading: 'Inicia sesión en Granger',
      intro: 'Empieza a planificar tus proyectos iniciando sesión con tu email, Google o GitHub.',
      label: 'Iniciar sesión',
    },
  },
  register: {
    path: '/auth/register',
    indexable: true,
    prerender: true,
    en: {
      title: 'Create your free account | Granger',
      description:
        'Create a free Granger account and start planning projects with Kanban boards, tasks, notes and team collaboration in minutes.',
      heading: 'Create your Granger account',
      intro: 'Fill in the form to create your account and set up your first project.',
      label: 'Create account',
    },
    es: {
      title: 'Crea tu cuenta gratis | Granger',
      description:
        'Crea una cuenta gratuita en Granger y empieza a planificar proyectos con tableros Kanban, tareas, notas y colaboración en equipo en minutos.',
      heading: 'Crea tu cuenta de Granger',
      intro: 'Completa el formulario para crear tu cuenta y configurar tu primer proyecto.',
      label: 'Crear cuenta',
    },
  },
  forgotPassword: {
    path: '/auth/forgot-password',
    indexable: false,
    prerender: true,
    en: {
      title: 'Reset your password | Granger',
      description:
        'Forgot your Granger password? Enter the email address of your account and we will send you instructions to choose a new one.',
      heading: 'Reset your password',
      intro: "Enter your email and we'll send you instructions to reset your password.",
      label: 'Reset password',
    },
    es: {
      title: 'Restablece tu contraseña | Granger',
      description:
        '¿Olvidaste tu contraseña de Granger? Ingresa el email de tu cuenta y te enviaremos las instrucciones para elegir una nueva.',
      heading: 'Restablece tu contraseña',
      intro: 'Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña.',
      label: 'Restablecer contraseña',
    },
  },
  confirmAccount: {
    path: '/auth/confirm-account',
    indexable: false,
    prerender: true,
    en: {
      title: 'Confirm your account | Granger',
      description: 'Enter the six-digit code we sent to your email to confirm your Granger account.',
      heading: 'Confirm your account',
      intro: 'Enter the code we sent to your email.',
      label: 'Confirm account',
    },
    es: {
      title: 'Confirma tu cuenta | Granger',
      description: 'Ingresa el código de seis dígitos que enviamos a tu email para confirmar tu cuenta de Granger.',
      heading: 'Confirma tu cuenta',
      intro: 'Ingresa el código que enviamos a tu email.',
      label: 'Confirmar cuenta',
    },
  },
  requestCode: {
    path: '/auth/request-code',
    indexable: false,
    prerender: true,
    en: {
      title: 'Request a new confirmation code | Granger',
      description: 'Did your Granger confirmation code expire? Enter your email to receive a new one.',
      heading: 'Request a new confirmation code',
      intro: 'Enter your email to receive a new code.',
      label: 'Request code',
    },
    es: {
      title: 'Solicita un nuevo código de confirmación | Granger',
      description: '¿Tu código de confirmación de Granger expiró? Ingresa tu email para recibir uno nuevo.',
      heading: 'Solicita un nuevo código de confirmación',
      intro: 'Ingresa tu email para recibir un nuevo código.',
      label: 'Solicitar código',
    },
  },
  newPassword: {
    path: '/auth/new-password',
    indexable: false,
    prerender: true,
    en: {
      title: 'Choose a new password | Granger',
      description: 'Enter the code from your email and choose a new password for your Granger account.',
      heading: 'Choose a new password',
      intro: 'Enter the code we sent to your email and choose a new password.',
      label: 'New password',
    },
    es: {
      title: 'Elige una nueva contraseña | Granger',
      description: 'Ingresa el código de tu email y elige una nueva contraseña para tu cuenta de Granger.',
      heading: 'Elige una nueva contraseña',
      intro: 'Ingresa el código que enviamos a tu email y elige una nueva contraseña.',
      label: 'Nueva contraseña',
    },
  },
  oauthSuccess: {
    path: '/auth/oauth-success',
    indexable: false,
    prerender: true,
    en: {
      title: 'Signing you in | Granger',
      description: 'Completing your Google or GitHub sign-in to Granger.',
      heading: 'Signing you in',
      intro: 'Completing your sign-in, one moment please.',
      label: 'Signing in',
    },
    es: {
      title: 'Iniciando sesión | Granger',
      description: 'Completando tu inicio de sesión en Granger con Google o GitHub.',
      heading: 'Iniciando sesión',
      intro: 'Completando tu inicio de sesión, un momento por favor.',
      label: 'Iniciando sesión',
    },
  },
  profile: {
    path: '/profile',
    indexable: false,
    prerender: true,
    en: {
      title: 'My profile | Granger',
      description: 'Update your Granger account information, avatar and password.',
      heading: 'My profile',
      intro: 'Sign in to update your account information.',
      label: 'My profile',
    },
    es: {
      title: 'Mi perfil | Granger',
      description: 'Actualiza la información de tu cuenta de Granger, tu avatar y tu contraseña.',
      heading: 'Mi perfil',
      intro: 'Inicia sesión para actualizar la información de tu cuenta.',
      label: 'Mi perfil',
    },
  },
  createProject: {
    path: '/projects/create',
    indexable: false,
    prerender: true,
    en: {
      title: 'Create project | Granger',
      description: 'Create a new Granger project and start organizing its tasks on a Kanban board.',
      heading: 'Create project',
      intro: 'Sign in to create a new project.',
      label: 'Create project',
    },
    es: {
      title: 'Crear proyecto | Granger',
      description: 'Crea un nuevo proyecto en Granger y empieza a organizar sus tareas en un tablero Kanban.',
      heading: 'Crear proyecto',
      intro: 'Inicia sesión para crear un nuevo proyecto.',
      label: 'Crear proyecto',
    },
  },
  project: {
    // Dynamic routes (/projects/:id, /edit, /team) are served from this shell.
    path: '/projects/:projectId',
    indexable: false,
    prerender: true,
    file: 'app-shell.html',
    canonical: false,
    en: {
      title: 'Project | Granger',
      description: 'Kanban board with the tasks, notes and team of a Granger project.',
      heading: 'Project',
      intro: 'Sign in to open this project.',
      label: 'Project',
    },
    es: {
      title: 'Proyecto | Granger',
      description: 'Tablero Kanban con las tareas, notas y equipo de un proyecto de Granger.',
      heading: 'Proyecto',
      intro: 'Inicia sesión para abrir este proyecto.',
      label: 'Proyecto',
    },
  },
  editProject: {
    path: '/projects/:projectId/edit',
    indexable: false,
    prerender: false,
    en: {
      title: 'Edit project | Granger',
      description: 'Update the name, client and description of your Granger project.',
      heading: 'Edit project',
      intro: '',
      label: 'Edit project',
    },
    es: {
      title: 'Editar proyecto | Granger',
      description: 'Actualiza el nombre, cliente y descripción de tu proyecto de Granger.',
      heading: 'Editar proyecto',
      intro: '',
      label: 'Editar proyecto',
    },
  },
  team: {
    path: '/projects/:projectId/team',
    indexable: false,
    prerender: false,
    en: {
      title: 'Manage team | Granger',
      description: 'Add and remove the collaborators of your Granger project.',
      heading: 'Manage team',
      intro: '',
      label: 'Manage team',
    },
    es: {
      title: 'Gestionar equipo | Granger',
      description: 'Agrega y elimina a los colaboradores de tu proyecto de Granger.',
      heading: 'Gestionar equipo',
      intro: '',
      label: 'Gestionar equipo',
    },
  },
  notFound: {
    path: '/404',
    indexable: false,
    prerender: true,
    file: '404.html',
    canonical: false,
    en: {
      title: 'Page not found (404) | Granger',
      description: "The page you are looking for doesn't exist or has been moved. Go back to Granger to keep planning your projects.",
      heading: 'Page not found',
      intro: "The page you are looking for doesn't exist or has been moved.",
      label: 'Page not found',
    },
    es: {
      title: 'Página no encontrada (404) | Granger',
      description: 'La página que buscas no existe o fue movida. Vuelve a Granger para seguir planificando tus proyectos.',
      heading: 'Página no encontrada',
      intro: 'La página que buscas no existe o fue movida.',
      label: 'Página no encontrada',
    },
  },
} satisfies Record<string, PageMeta>

export type PageKey = keyof typeof PAGES

export const FEATURES: Record<Lang, string[]> = {
  en: [
    'Kanban boards with drag-and-drop across five task statuses',
    'Projects, tasks and notes in one workspace',
    'Team members with manager and collaborator roles',
    'Email, Google and GitHub sign-in',
    'Available in English and Spanish',
  ],
  es: [
    'Tableros Kanban con arrastrar y soltar entre cinco estados de tarea',
    'Proyectos, tareas y notas en un solo espacio',
    'Miembros de equipo con roles de manager y colaborador',
    'Inicio de sesión con email, Google y GitHub',
    'Disponible en inglés y español',
  ],
}

export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, '')
  return path === '/' ? `${base}/` : `${base}${path}`
}

export function ogLocale(lang: Lang): string {
  return OG_LOCALE[lang]
}

export function alternateOgLocale(lang: Lang): string {
  return OG_LOCALE[lang === 'en' ? 'es' : 'en']
}

/** Schema.org graph (JSON-LD) describing the site, the organization and the page. */
export function buildJsonLd(
  page: PageMeta,
  lang: Lang,
  siteUrl: string,
  meta: { title: string; description: string; url: string } = {
    title: page[lang].title,
    description: page[lang].description,
    url: absoluteUrl(siteUrl, page.path),
  },
): Record<string, unknown> {
  const home = absoluteUrl(siteUrl, '/')
  const image = absoluteUrl(siteUrl, OG_IMAGE_PATH)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${home}#organization`,
      name: SITE_NAME,
      url: home,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteUrl, '/logo.png'),
        width: 768,
        height: 768,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${home}#website`,
      name: SITE_NAME,
      url: home,
      description: PAGES.home[lang].description,
      inLanguage: ['en', 'es'],
      publisher: { '@id': `${home}#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${meta.url}#webpage`,
      url: meta.url,
      name: meta.title,
      description: meta.description,
      inLanguage: lang,
      isPartOf: { '@id': `${home}#website` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: image,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      },
      ...(page.path === '/'
        ? { about: { '@id': `${home}#app` } }
        : { breadcrumb: { '@id': `${meta.url}#breadcrumb` } }),
    },
  ]

  if (page.path === '/') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${home}#app`,
      name: SITE_NAME,
      url: home,
      description: PAGES.home[lang].description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript and a modern web browser.',
      inLanguage: ['en', 'es'],
      image,
      featureList: FEATURES[lang],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${home}#organization` },
    })
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${meta.url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PAGES.home[lang].label, item: home },
        { '@type': 'ListItem', position: 2, name: page[lang].label, item: meta.url },
      ],
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
