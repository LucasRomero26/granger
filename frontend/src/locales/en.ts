import type { TaskStatus } from '@/types'

export const messages = {
  // Task statuses (legacy export, kept for migration)
  'status.pending': 'To Do',
  'status.onHold': 'On Hold',
  'status.inProgress': 'In Progress',
  'status.underReview': 'Review',
  'status.completed': 'Completed',

  // Brand / common
  'app.name': 'Granger',
  'common.or': 'or',
  'common.optional': 'optional',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.save': 'Save',
  'common.saving': 'Saving…',
  'common.back': 'Back',
  'common.search': 'Search',
  'common.options': 'Options',
  'common.loading': 'Loading',

  // Nav / header
  'nav.hi': 'Hi, {name}',
  'nav.myProfile': 'My Profile',
  'nav.myProjects': 'My Projects',
  'nav.signOut': 'Sign Out',
  'nav.toggleLang': 'Switch to Spanish',
  'nav.footer': '© {year} Granger',

  // Theme toggle aria
  'theme.toLight': 'Switch to light mode',
  'theme.toDark': 'Switch to dark mode',

  // Auth: Login
  'login.title': 'Sign in',
  'login.subtitle': 'Start planning your projects by signing in to Granger.',
  'login.email': 'Email',
  'login.emailPlaceholder': 'you@example.com',
  'login.password': 'Password',
  'login.passwordPlaceholder': 'Your password',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',
  'login.welcomeBack': 'Welcome back',
  'login.createAccount': "Don't have an account? Create one",
  'login.forgotPassword': 'Forgot your password? Reset it',
  'login.oauthMissingData': 'Missing OAuth provider data. Try again.',
  'login.oauthInvalid': 'OAuth session is invalid. Try again.',
  'login.oauthFailed': 'Could not complete sign in. Try again.',

  // Auth: Register
  'register.title': 'Create account',
  'register.subtitle': 'Fill in the form to create your Granger account.',
  'register.name': 'Name',
  'register.namePlaceholder': 'Your name',
  'register.email': 'Email',
  'register.emailPlaceholder': 'you@example.com',
  'register.password': 'Password',
  'register.passwordPlaceholder': 'At least 8 characters',
  'register.confirm': 'Confirm password',
  'register.confirmPlaceholder': 'Repeat password',
  'register.submit': 'Register',
  'register.submitting': 'Creating…',
  'register.signIn': 'Already have an account? Sign in',

  // Auth: Confirm account
  'confirm.title': 'Confirm your account',
  'confirm.subtitle': 'Enter the code we sent to your email.',
  'confirm.requestNew': 'Request a new code',

  // Auth: Forgot password
  'forgot.title': 'Reset password',
  'forgot.subtitle': "Forgot your password? Enter your email and we'll send reset instructions.",
  'forgot.submit': 'Send instructions',
  'forgot.submitting': 'Sending…',
  'forgot.signIn': 'Already have an account? Sign in',
  'forgot.createOne': "Don't have an account? Create one",

  // Auth: New password
  'newPassword.title': 'Reset password',
  'newPassword.subtitle': 'Choose a new password for your account.',
  'newPassword.subtitleCode': 'Enter the code we sent to your email.',
  'newPassword.requestNew': 'Request a new code',
  'newPassword.new': 'New password',
  'newPassword.confirm': 'Confirm password',
  'newPassword.submit': 'Set password',
  'newPassword.submitting': 'Saving…',

  // Auth: Request code
  'requestCode.title': 'Request confirmation code',
  'requestCode.subtitle': 'Enter your email to receive a new code.',
  'requestCode.submit': 'Send code',
  'requestCode.submitting': 'Sending…',
  'requestCode.signIn': 'Already have an account? Sign in',
  'requestCode.forgot': 'Forgot your password? Reset it',

  // Auth: OAuth
  'oauth.google': 'Continue with Google',
  'oauth.github': 'Continue with GitHub',
  'oauth.successWelcome': 'Welcome to Granger',
  'oauth.requireLogin': 'You must sign in first',
  'oauth.processing': 'Completing sign in…',

  // OTP input
  'otp.label': '6-digit code',
  'otp.digit': 'Digit {n}',

  // Dashboard
  'dashboard.title': 'My Projects',
  'dashboard.subtitle': 'Manage and organize your workspaces',
  'dashboard.newProject': 'New Project',
  'dashboard.emptyTitle': 'No projects yet',
  'dashboard.emptyDesc': 'Create your first workspace to start organizing tasks.',
  'dashboard.emptyAction': 'Create project',

  // Projects: Create
  'project.create.title': 'Create project',
  'project.create.subtitle': 'Fill in the form to create a new project',
  'project.create.back': 'Back to projects',
  'project.create.submit': 'Create project',
  'project.create.submitting': 'Creating…',
  'project.created': 'Project created',

  // Projects: Edit
  'project.edit.title': 'Edit project',
  'project.edit.subtitle': 'Update your project details',
  'project.edit.back': 'Back to projects',
  'project.edit.submit': 'Save changes',
  'project.edit.submitting': 'Saving…',
  'project.updated': 'Project updated',

  // Projects: Delete
  'project.delete.title': 'Delete project',
  'project.delete.body': 'Confirm deletion by entering your password',
  'project.delete.password': 'Password',
  'project.delete.passwordPlaceholder': 'Your sign-in password',
  'project.delete.submit': 'Delete project',
  'project.deleted': 'Project deleted',

  // Projects: Details
  'project.details.create': 'Create',
  'project.details.team': 'Team',

  // Projects: Team
  'team.title': 'Manage team',
  'team.subtitle': 'Manage collaborators for this project',
  'team.add': 'Add collaborator',
  'team.back': 'Back to project',
  'team.current': 'Current members',
  'team.remove': 'Remove from project',
  'team.removed': 'Member removed',
  'team.emptyTitle': 'No members on this team',
  'team.emptyDesc': 'Invite collaborators to work together.',
  'team.result': 'Result',
  'team.addMember': 'Add to project',
  'team.memberAdded': 'Member added',

  // Add member form
  'team.emailLabel': 'User email',
  'team.emailPlaceholder': 'colleague@example.com',
  'team.searchSubmit': 'Search user',
  'team.searching': 'Searching…',
  'team.addMemberTitle': 'Add team member',

  // Project form
  'project.form.name': 'Project name',
  'project.form.namePlaceholder': 'Project name',
  'project.form.client': 'Client name',
  'project.form.clientPlaceholder': 'Client name',
  'project.form.description': 'Description',
  'project.form.descriptionPlaceholder': 'Project description',
  'project.form.clientLabel': 'Client: {name}',

  // Project card
  'project.card.open': 'Open {name}',
  'project.card.view': 'View project',
  'project.card.edit': 'Edit project',
  'project.card.delete': 'Delete project',
  'project.card.manager': 'Manager',
  'project.card.collaborator': 'Collaborator',

  // Tasks
  'task.created': 'Task created',
  'task.updated': 'Task updated',
  'task.deleted': 'Task deleted',
  'task.statusUpdated': 'Status updated',
  'task.view': 'View task',
  'task.edit': 'Edit task',
  'task.delete': 'Delete task',
  'task.add': 'Add task',
  'task.dropHere': 'Drop tasks here',
  'task.notes_count': '{count} notes',
  'task.notes_one': '{count} note',
  'task.notes_other': '{count} notes',
  'task.form.name': 'Task name',
  'task.form.namePlaceholder': 'Task name',
  'task.form.description': 'Description',
  'task.form.descriptionPlaceholder': 'Task description',
  'task.modal.new': 'New task',
  'task.modal.edit': 'Edit task',
  'task.modal.save': 'Save task',
  'task.modal.saving': 'Saving…',
  'task.modal.added': 'Added: {date}',
  'task.modal.updated': 'Last updated: {date}',
  'task.modal.history': 'Change history',
  'task.modal.by': 'by {name}',
  'task.modal.currentStatus': 'Current status',

  // Notes
  'note.created': 'Note created',
  'note.deleted': 'Note deleted',
  'note.create': 'Create note',
  'note.placeholder': 'Write a note…',
  'note.add': 'Add note',
  'note.delete': 'Delete',
  'note.by': 'by {name}',
  'note.title': 'Notes',
  'note.empty': 'No notes yet',

  // Profile
  'profile.title': 'My profile',
  'profile.subtitle': 'Update your account information',
  'profile.name': 'Name',
  'profile.namePlaceholder': 'Your name',
  'profile.email': 'Email',
  'profile.emailPlaceholder': 'Your email',
  'profile.save': 'Save changes',
  'profile.saving': 'Saving…',
  'profile.updated': 'Profile updated',
  'profile.passwordSection': 'Password',
  'profile.passwordHelp': 'Change your password regularly to keep your account secure.',
  'profile.changePassword': 'Change password',

  // Change password modal
  'changePassword.title': 'Change password',
  'changePassword.subtitle': 'Use this form to update your password.',
  'changePassword.current': 'Current password',
  'changePassword.currentPlaceholder': 'Current password',
  'changePassword.current.required': 'Current password is required',
  'changePassword.new': 'New password',
  'changePassword.newPlaceholder': 'At least 8 characters',
  'changePassword.password.required': 'Password is required',
  'changePassword.passwordMin': 'Password must be at least 8 characters',
  'changePassword.confirm': 'Confirm password',
  'changePassword.confirm.required': 'Please confirm your password',
  'changePassword.confirmPlaceholder': 'Repeat password',
  'changePassword.submit': 'Change password',
  'changePassword.submitting': 'Updating…',
  'changePassword.cancel': 'Cancel',
  'changePassword.changed': 'Password changed',

  // Avatar upload
  'avatar.updated': 'Avatar updated',
  'avatar.invalidType': 'Only PNG, JPEG, WEBP or GIF are allowed',
  'avatar.tooBig': 'Image cannot exceed 1.5 MB',
  'avatar.changeAria': 'Change avatar',
  'avatar.hint': 'Click the avatar to upload a new one (max 1.5 MB)',

  // Validation errors
  'validation.required': '{field} is required',
  'validation.email': 'Email is required',
  'validation.emailInvalid': 'Invalid email',
  'validation.name': 'Name is required',
  'validation.password': 'Password is required',
  'validation.passwordMin': 'Password must be at least 8 characters',
  'validation.confirm': 'Please confirm your password',
  'validation.match': 'Passwords do not match',
  'validation.currentPassword': 'Current password is required',
  'validation.projectName': 'Project name is required',
  'validation.clientName': 'Client name is required',
  'validation.description': 'Description is required',
  'validation.taskName': 'Task name is required',
  'validation.noteContent': 'Note content is required',

  // Error boundary
  'error.title': 'Something went wrong',
  'error.body': 'An error occurred while rendering this section. You can try reloading it or go back.',
  'error.retry': 'Retry',

  // 404
  'notFound.title': 'Page not found',
  'notFound.body': 'You might want to go back to',
  'notFound.link': 'Projects',

  // Demo nav
  'demo.title': 'Demo screens',
  'demo.subtitle': 'Backend off — browsing with mock data. Toggle theme from the header.',
  'demo.groupAuth': 'Auth',
  'demo.groupApp': 'App',
  'demo.groupOther': 'Other',
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
