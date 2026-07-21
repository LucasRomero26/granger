import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/api/AuthAPI'

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  return { data, isError, isLoading }
}
