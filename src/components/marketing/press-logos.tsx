import React from 'react'

const brandNames = [
  'Galderma',
  'Allergan Aesthetics',
  'Merz Aesthetics',
  'La Roche-Posay',
  'SkinCeuticals',
] as const

function BrandLabel({ name }: { name: string }) {
  return (
    <span className="text-center text-sm font-semibold tracking-tight text-black/40 md:text-base">
      {name}
    </span>
  )
}

export const logoItems = brandNames.map((name) => {
  const Logo = () => <BrandLabel name={name} />
  Logo.displayName = name
  return Logo
})
