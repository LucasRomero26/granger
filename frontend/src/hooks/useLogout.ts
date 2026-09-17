import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { logoutUser } from '@/api/AuthAPI'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return async () => {
    try {
      await logoutUser()
    } catch {
      /* Even if the backend logout fails, clear the local state */
    }
    queryClient.invalidateQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }
}
