import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { profile as seedProfile, projects as seedProjects, experience as seedExperience } from '../data/portfolioData'
import { fetchLiveData } from '../lib/scriptApi'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(seedProfile)
  const [projects, setProjects] = useState(seedProjects)
  const [experience, setExperience] = useState(seedExperience)
  const [source, setSource] = useState('seed') // 'seed' | 'live'
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const live = await fetchLiveData()
    if (live) {
      if (Array.isArray(live.projects) && live.projects.length) setProjects(live.projects)
      if (Array.isArray(live.experience) && live.experience.length) setExperience(live.experience)
      if (live.profile && typeof live.profile === 'object') {
        setProfile((prev) => ({ ...prev, ...live.profile }))
      }
      setSource('live')
    } else {
      setSource('seed')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <DataContext.Provider value={{ profile, projects, experience, source, loading, refresh }}>
      {children}
    </DataContext.Provider>
  )
}

export function usePortfolioData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('usePortfolioData must be used within DataProvider')
  return ctx
}
