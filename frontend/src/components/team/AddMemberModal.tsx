import { useLocation, useNavigate } from 'react-router-dom'
import Modal from '@/components/ui/Modal'
import { useT } from '@/hooks/useT'
import AddMemberForm from './AddMemberForm'

export default function AddMemberModal() {
  const t = useT()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const show = queryParams.get('addMember') === 'true'

  return (
    <Modal
      open={show}
      onClose={() => navigate(location.pathname, { replace: true })}
      title={t('team.addMemberTitle')}
      size="md"
    >
      <AddMemberForm />
    </Modal>
  )
}
