import type { TaskStatus } from '@/types'

export const messages = {
  // Task statuses
  'status.pending': 'Por hacer',
  'status.onHold': 'En espera',
  'status.inProgress': 'En progreso',
  'status.underReview': 'En revisión',
  'status.completed': 'Completada',

  // Brand / common
  'app.name': 'Granger',
  'common.or': 'o',
  'common.optional': 'opcional',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.save': 'Guardar',
  'common.saving': 'Guardando…',
  'common.back': 'Volver',
  'common.search': 'Buscar',
  'common.options': 'Opciones',
  'common.loading': 'Cargando',

  // Nav / header
  'nav.hi': 'Hola, {name}',
  'nav.myProfile': 'Mi perfil',
  'nav.myProjects': 'Mis proyectos',
  'nav.signOut': 'Cerrar sesión',
  'nav.toggleLang': 'Cambiar a inglés',
  'nav.footer': '© {year} Granger',


  // Auth layout
  'auth.tagline': 'Planifica proyectos.\nEntrega a tiempo.',
  'auth.taglineSub': 'Tableros, tareas y notas para equipos que prefieren el orden.',

  // Auth: Login
  'login.title': 'Iniciar sesión',
  'login.subtitle': 'Empieza a planificar tus proyectos iniciando sesión en Granger.',
  'login.email': 'Correo',
  'login.emailPlaceholder': 'tu@ejemplo.com',
  'login.password': 'Contraseña',
  'login.passwordPlaceholder': 'Tu contraseña',
  'login.submit': 'Iniciar sesión',
  'login.submitting': 'Iniciando…',
  'login.welcomeBack': 'Bienvenido de nuevo',
  'login.notConfirmedRedirect': 'Tu cuenta no está confirmada. Te redirigimos para ingresar tu código…',
  'login.createAccount': '¿No tienes cuenta? Crea una',
  'login.forgotPassword': '¿Olvidaste tu contraseña? Recupérala',
  'login.oauthMissingData': 'Faltan datos del proveedor OAuth. Intenta de nuevo.',
  'login.oauthInvalid': 'La sesión OAuth no es válida. Intenta de nuevo.',
  'login.oauthFailed': 'No se pudo completar el inicio de sesión. Intenta de nuevo.',

  // Auth: Register
  'register.title': 'Crear cuenta',
  'register.subtitle': 'Rellena el formulario para crear tu cuenta de Granger.',
  'register.name': 'Nombre',
  'register.namePlaceholder': 'Tu nombre',
  'register.email': 'Correo',
  'register.emailPlaceholder': 'tu@ejemplo.com',
  'register.password': 'Contraseña',
  'register.passwordPlaceholder': 'Al menos 8 caracteres',
  'register.confirm': 'Confirmar contraseña',
  'register.confirmPlaceholder': 'Repite la contraseña',
  'register.submit': 'Registrarme',
  'register.submitting': 'Creando…',
  'register.signIn': '¿Ya tienes cuenta? Inicia sesión',

  // Auth: Confirm account
  'confirm.title': 'Confirma tu cuenta',
  'confirm.subtitle': 'Ingresa el código que enviamos a tu correo.',
  'confirm.requestNew': 'Solicitar un código nuevo',

  // Auth: Forgot password
  'forgot.title': 'Recuperar contraseña',
  'forgot.subtitle': '¿Olvidaste tu contraseña? Ingresa tu correo y te enviaremos instrucciones.',
  'forgot.submit': 'Enviar instrucciones',
  'forgot.submitting': 'Enviando…',
  'forgot.signIn': '¿Ya tienes cuenta? Inicia sesión',
  'forgot.createOne': '¿No tienes cuenta? Crea una',

  // Auth: New password
  'newPassword.title': 'Recuperar contraseña',
  'newPassword.subtitle': 'Elige una nueva contraseña para tu cuenta.',
  'newPassword.subtitleCode': 'Ingresa el código que enviamos a tu correo.',
  'newPassword.requestNew': 'Solicitar un código nuevo',
  'newPassword.new': 'Nueva contraseña',
  'newPassword.confirm': 'Confirmar contraseña',
  'newPassword.submit': 'Establecer contraseña',
  'newPassword.submitting': 'Guardando…',

  // Auth: Request code
  'requestCode.title': 'Solicitar código de confirmación',
  'requestCode.subtitle': 'Ingresa tu correo para recibir un código nuevo.',
  'requestCode.submit': 'Enviar código',
  'requestCode.submitting': 'Enviando…',
  'requestCode.signIn': '¿Ya tienes cuenta? Inicia sesión',
  'requestCode.forgot': '¿Olvidaste tu contraseña? Recupérala',

  // Auth: OAuth
  'oauth.google': 'Continuar con Google',
  'oauth.github': 'Continuar con GitHub',
  'oauth.successWelcome': 'Bienvenido a Granger',
  'oauth.requireLogin': 'Primero debes iniciar sesión',
  'oauth.processing': 'Completando inicio de sesión…',

  // OTP input
  'otp.label': 'Código de 6 dígitos',
  'otp.digit': 'Dígito {n}',

  // Dashboard
  'dashboard.title': 'Mis proyectos',
  'dashboard.subtitle': 'Administra y organiza tus espacios de trabajo',
  'dashboard.newProject': 'Nuevo proyecto',
  'dashboard.emptyTitle': 'Aún no hay proyectos',
  'dashboard.emptyDesc': 'Crea tu primer espacio para empezar a organizar tareas.',
  'dashboard.emptyAction': 'Crear proyecto',

  // Projects: Create
  'project.create.title': 'Crear proyecto',
  'project.create.subtitle': 'Rellena el formulario para crear un nuevo proyecto',
  'project.create.back': 'Volver a proyectos',
  'project.create.submit': 'Crear proyecto',
  'project.create.submitting': 'Creando…',
  'project.created': 'Proyecto creado',

  // Projects: Edit
  'project.edit.title': 'Editar proyecto',
  'project.edit.subtitle': 'Actualiza los detalles del proyecto',
  'project.edit.back': 'Volver a proyectos',
  'project.edit.submit': 'Guardar cambios',
  'project.edit.submitting': 'Guardando…',
  'project.updated': 'Proyecto actualizado',

  // Projects: Delete
  'project.delete.title': 'Eliminar proyecto',
  'project.delete.body': 'Confirma la eliminación ingresando tu contraseña',
  'project.delete.password': 'Contraseña',
  'project.delete.passwordPlaceholder': 'Tu contraseña de inicio de sesión',
  'project.delete.submit': 'Eliminar proyecto',
  'project.deleted': 'Proyecto eliminado',

  // Projects: Details
  'project.details.create': 'Crear',
  'project.details.team': 'Equipo',

  // Projects: Team
  'team.title': 'Administrar equipo',
  'team.subtitle': 'Administra los colaboradores de este proyecto',
  'team.add': 'Agregar colaborador',
  'team.back': 'Volver al proyecto',
  'team.current': 'Miembros actuales',
  'team.remove': 'Quitar del proyecto',
  'team.removed': 'Miembro removido',
  'team.emptyTitle': 'No hay miembros en este equipo',
  'team.emptyDesc': 'Invita a colaboradores para trabajar juntos.',
  'team.result': 'Resultado',
  'team.addMember': 'Agregar al proyecto',
  'team.memberAdded': 'Miembro agregado',

  // Add member form
  'team.emailLabel': 'Correo del usuario',
  'team.emailPlaceholder': 'colega@ejemplo.com',
  'team.searchSubmit': 'Buscar usuario',
  'team.searching': 'Buscando…',
  'team.addMemberTitle': 'Agregar miembro al equipo',

  // Project form
  'project.form.name': 'Nombre del proyecto',
  'project.form.namePlaceholder': 'Nombre del proyecto',
  'project.form.client': 'Nombre del cliente',
  'project.form.clientPlaceholder': 'Nombre del cliente',
  'project.form.description': 'Descripción',
  'project.form.descriptionPlaceholder': 'Descripción del proyecto',
  'project.form.clientLabel': 'Cliente: {name}',

  // Project card
  'project.card.open': 'Abrir {name}',
  'project.card.view': 'Ver proyecto',
  'project.card.edit': 'Editar proyecto',
  'project.card.delete': 'Eliminar proyecto',
  'project.card.manager': 'Administrador',
  'project.card.collaborator': 'Colaborador',

  // Tasks
  'task.created': 'Tarea creada',
  'task.updated': 'Tarea actualizada',
  'task.deleted': 'Tarea eliminada',
  'task.statusUpdated': 'Estado actualizado',
  'task.view': 'Ver tarea',
  'task.edit': 'Editar tarea',
  'task.delete': 'Eliminar tarea',
  'task.add': 'Agregar tarea',
  'task.dropHere': 'Suelta las tareas aquí',
  'task.notes_count': '{count} notas',
  'task.notes_one': '{count} nota',
  'task.notes_other': '{count} notas',
  'task.form.name': 'Nombre de la tarea',
  'task.form.namePlaceholder': 'Nombre de la tarea',
  'task.form.description': 'Descripción',
  'task.form.descriptionPlaceholder': 'Descripción de la tarea',
  'task.modal.new': 'Nueva tarea',
  'task.modal.edit': 'Editar tarea',
  'task.modal.save': 'Guardar tarea',
  'task.modal.saving': 'Guardando…',
  'task.modal.added': 'Agregada: {date}',
  'task.modal.updated': 'Última actualización: {date}',
  'task.modal.history': 'Historial de cambios',
  'task.modal.by': 'por {name}',
  'task.modal.currentStatus': 'Estado actual',

  // Notes
  'note.created': 'Nota creada',
  'note.deleted': 'Nota eliminada',
  'note.create': 'Crear nota',
  'note.placeholder': 'Escribe una nota…',
  'note.add': 'Agregar nota',
  'note.delete': 'Eliminar',
  'note.by': 'por {name}',
  'note.title': 'Notas',
  'note.empty': 'Aún no hay notas',

  // Profile
  'profile.title': 'Mi perfil',
  'profile.subtitle': 'Actualiza la información de tu cuenta',
  'profile.name': 'Nombre',
  'profile.namePlaceholder': 'Tu nombre',
  'profile.email': 'Correo',
  'profile.emailPlaceholder': 'Tu correo',
  'profile.save': 'Guardar cambios',
  'profile.saving': 'Guardando…',
  'profile.updated': 'Perfil actualizado',
  'profile.passwordSection': 'Contraseña',
  'profile.passwordHelp': 'Cambia tu contraseña regularmente para mantener tu cuenta segura.',
  'profile.changePassword': 'Cambiar contraseña',

  // Change password modal
  'changePassword.title': 'Cambiar contraseña',
  'changePassword.subtitle': 'Usa este formulario para actualizar tu contraseña.',
  'changePassword.current': 'Contraseña actual',
  'changePassword.currentPlaceholder': 'Contraseña actual',
  'changePassword.current.required': 'La contraseña actual es obligatoria',
  'changePassword.new': 'Nueva contraseña',
  'changePassword.newPlaceholder': 'Al menos 8 caracteres',
  'changePassword.password.required': 'La contraseña es obligatoria',
  'changePassword.passwordMin': 'La contraseña debe tener al menos 8 caracteres',
  'changePassword.confirm': 'Confirmar contraseña',
  'changePassword.confirm.required': 'Por favor confirma tu contraseña',
  'changePassword.confirmPlaceholder': 'Repite la contraseña',
  'changePassword.submit': 'Cambiar contraseña',
  'changePassword.submitting': 'Actualizando…',
  'changePassword.cancel': 'Cancelar',
  'changePassword.changed': 'Contraseña modificada',

  // Avatar upload
  'avatar.updated': 'Avatar actualizado',
  'avatar.invalidType': 'Solo se permiten PNG, JPEG, WEBP o GIF',
  'avatar.tooBig': 'La imagen no puede superar 1.5 MB',
  'avatar.changeAria': 'Cambiar avatar',
  'avatar.hint': 'Haz clic en el avatar para subir uno nuevo (máx 1.5 MB)',

  // Validation errors
  'validation.required': '{field} es obligatorio',
  'validation.email': 'El correo es obligatorio',
  'validation.emailInvalid': 'Correo no válido',
  'validation.name': 'El nombre es obligatorio',
  'validation.password': 'La contraseña es obligatoria',
  'validation.passwordMin': 'La contraseña debe tener al menos 8 caracteres',
  'validation.confirm': 'Por favor confirma tu contraseña',
  'validation.match': 'Las contraseñas no coinciden',
  'validation.currentPassword': 'La contraseña actual es obligatoria',
  'validation.projectName': 'El nombre del proyecto es obligatorio',
  'validation.clientName': 'El nombre del cliente es obligatorio',
  'validation.description': 'La descripción es obligatoria',
  'validation.taskName': 'El nombre de la tarea es obligatorio',
  'validation.noteContent': 'El contenido de la nota es obligatorio',

  // Error boundary
  'error.title': 'Algo salió mal',
  'error.body': 'Se produjo un error al renderizar esta sección. Puedes intentar recargarla o volver atrás.',
  'error.retry': 'Reintentar',

  // 404
  'notFound.title': 'Página no encontrada',
  'notFound.body': 'Quizás quieras volver a',
  'notFound.link': 'Proyectos',

  // Demo nav
  'demo.title': 'Pantallas de demo',
  'demo.subtitle': 'Backend apagado — navegando con datos simulados.',
  'demo.groupAuth': 'Auth',
  'demo.groupApp': 'App',
  'demo.groupOther': 'Otro',
} as const

// Legacy export (kept while migrating `statusTranslations` consumers)
export const statusTranslations: Record<TaskStatus, string> = {
  pending: messages['status.pending'],
  onHold: messages['status.onHold'],
  inProgress: messages['status.inProgress'],
  underReview: messages['status.underReview'],
  completed: messages['status.completed'],
}

export const statusAccent: Record<TaskStatus, string> = {
  pending: 'bg-slate-400',
  onHold: 'bg-rose-400',
  inProgress: 'bg-sky-400',
  underReview: 'bg-amber-400',
  completed: 'bg-emerald-400',
}
