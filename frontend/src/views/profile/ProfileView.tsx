import { useAuth } from '@/hooks/useAuth'
import ProfileForm from '@/components/profile/ProfileForm'
import Spinner from '@/components/ui/Spinner'

export default function ProfileView() {
  const { data, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (data) return <ProfileForm data={data} />
  return null
}
