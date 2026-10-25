import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProfileLayout from '@/layouts/ProfileLayout'
import DemoNav from '@/components/DemoNav'
import LoginView from '@/views/auth/LoginView'
import RegisterView from '@/views/auth/RegisterView'
import ConfirmAccountView from '@/views/auth/ConfirmAccountView'
import RequestNewCodeView from '@/views/auth/RequestNewCodeView'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView'
import NewPasswordView from '@/views/auth/NewPasswordView'
import OAuthSuccessView from '@/views/auth/OAuthSuccessView'
import NotFound from '@/views/404/NotFound'

const DashboardView = lazy(() => import('@/views/DashboardView'))
const CreateProjectView = lazy(() => import('@/views/projects/CreateProjectView'))
const EditProjectView = lazy(() => import('@/views/projects/EditProjectView'))
const ProjectDetailsView = lazy(() => import('@/views/projects/ProjectDetailsView'))
const ProjectTeamView = lazy(() => import('@/views/projects/ProjectTeamView'))
const ProfileView = lazy(() => import('@/views/profile/ProfileView'))

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} index />
          <Route path="/projects/create" element={<CreateProjectView />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
          <Route path="/projects/:projectId/edit" element={<EditProjectView />} />
          <Route path="/projects/:projectId/team" element={<ProjectTeamView />} />
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
          <Route path="/auth/request-code" element={<RequestNewCodeView />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
          <Route path="/auth/new-password" element={<NewPasswordView />} />
          <Route path="/auth/oauth-success" element={<OAuthSuccessView />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <DemoNav />
    </BrowserRouter>
  )
}
