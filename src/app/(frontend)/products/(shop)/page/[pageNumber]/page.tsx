import { redirect } from 'next/navigation'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function ProductsPageNumberRedirect({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)

  if (Number.isInteger(page) && page > 1) {
    redirect(`/products?page=${page}`)
  }

  redirect('/products')
}
