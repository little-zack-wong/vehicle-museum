import { useEffect, useState } from 'react'
import { Gallery } from './components/Gallery'
import { Detail } from './components/Detail'
import { vehicleById, type Vehicle } from './data/vehicles'

function currentVehicleId(): string | null {
  const m = window.location.hash.match(/^#\/([a-z-]+)$/)
  return m ? m[1] : null
}

export default function App() {
  const [vehicleId, setVehicleId] = useState<string | null>(currentVehicleId)

  useEffect(() => {
    const onHashChange = () => setVehicleId(currentVehicleId())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const vehicle: Vehicle | null = vehicleId ? vehicleById(vehicleId) ?? null : null

  if (vehicle) {
    return (
      <Detail
        vehicle={vehicle}
        onBack={() => {
          window.location.hash = '#/'
        }}
        onSwitch={(v) => {
          window.location.hash = `#/${v.id}`
        }}
      />
    )
  }

  return (
    <Gallery
      onSelect={(v) => {
        window.location.hash = `#/${v.id}`
      }}
    />
  )
}
