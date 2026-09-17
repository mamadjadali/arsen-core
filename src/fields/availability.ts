import { L } from '@/i18n/label'

export const availabilityOptions = [
  { label: L('Available', 'موجود'), value: 'available' },
  { label: L('Unavailable', 'ناموجود'), value: 'unavailable' },
  { label: L('Limited', 'محدود'), value: 'limited' },
  { label: L('Coming soon', 'به‌زودی'), value: 'coming_soon' },
]

export type AvailabilityValue = 'available' | 'unavailable' | 'limited' | 'coming_soon'

export const availabilityFieldBase = {
  name: 'availability' as const,
  type: 'select' as const,
  label: L('Availability', 'موجودی'),
  defaultValue: 'available' as const,
  options: availabilityOptions,
}
