import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { matterId: string } }) {
  redirect(`/app/matters/${params.matterId}/overview`)
}
