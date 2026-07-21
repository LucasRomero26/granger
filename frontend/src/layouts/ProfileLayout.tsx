import { Outlet } from 'react-router-dom'

export default function ProfileLayout() {
  return (
    <div className="mx-auto max-w-3xl">
      <Outlet />
    </div>
  )
}
