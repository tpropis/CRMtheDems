import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { matterId: string } }) {
  redirect(`/matters/${params.matterId}/overview`)
}
