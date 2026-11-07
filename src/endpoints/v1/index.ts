import type { Endpoint } from 'payload'

import { v1BundleEndpoints } from './bundles'
import { v1ProductEndpoints } from './products'

export const v1CatalogEndpoints: Endpoint[] = [...v1ProductEndpoints, ...v1BundleEndpoints]
