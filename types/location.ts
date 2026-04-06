export type LocationCoordinates = {
  latitude: number
  longitude: number
}

export type LocationItem = {
  key: string
  name: string
  address: string
  description?: string
  picture: string
  coordinates: LocationCoordinates
}

export type LocationSummary = {
  key: string
  name: string
  address: string
}

export type LocationMapProps = {
  latitude?: number | null
  longitude?: number | null
  name?: string
  address?: string
  zoom?: number
  height?: number
}

export type ExternalLinkItem = {
  label: string
  href: string
  icon: string
}

export type NavigableLinkItem = {
  label: string
  to: string
  icon: string
}
