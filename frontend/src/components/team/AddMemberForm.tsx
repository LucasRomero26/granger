import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { TeamMemberForm } from '@/types'
import { findUserByEmail } from '@/api/TeamAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useT } from '@/hooks/useT'
import SearchResult from './SearchResult'

export default function AddMemberForm() {
  const t = useT()
  const params = useParams()
  const projectId = params.projectId!

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamMemberForm>({ defaultValues: { email: '' } })

  const mutation = useMutation({
    mutationFn: findUserByEmail,
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSearchUser = async (formData: TeamMemberForm) => {
    mutation.mutate({ projectId, formData })
  }

  return (
    <>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit(handleSearchUser)} noValidate>
        <Input
          label={t('team.emailLabel')}
          type="email"
          autoComplete="email"
          placeholder={t('team.emailPlaceholder')}
          error={errors.email?.message}
          {...register('email', {
            required: t('validation.email'),
            pattern: { value: /\S+@\S+\.\S+/, message: t('validation.emailInvalid') },
          })}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t('team.searching') : t('team.searchSubmit')}
        </Button>
      </form>

      <div className="mt-6">
        {mutation.data && (
          <SearchResult user={mutation.data} reset={reset} resetMutation={mutation.reset} />
        )}
      </div>
    </>
  )
}
