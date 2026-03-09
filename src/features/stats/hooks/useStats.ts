import { useState, useEffect } from 'react'
import { getAllStats, getDB } from '../../../lib/db'
import { StatsCalculation } from '../../../lib/stats'

type UseStatsReturn = {
  calculations: StatsCalculation[]
  totalCorrectRate: number
  totalCount: number
  isLoading: boolean
  error: Error | null
  reload: () => void
}

/**
 * IndexedDB から統計情報を読み込み計算結果を返すフック
 */
export const useStats = (): UseStatsReturn => {
  const [calculations, setCalculations] = useState<StatsCalculation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const db = await getDB()
        const records = await getAllStats(db)
        if (!cancelled) {
          const calcs = StatsCalculation.fromRecords(records)
          setCalculations(calcs)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const reload = () => setReloadKey(k => k + 1)

  const totalCorrectRate = StatsCalculation.totalCorrectRate(calculations)
  const totalCount = calculations.reduce((acc, c) => acc + c.totalCount, 0)

  return {
    calculations,
    totalCorrectRate,
    totalCount,
    isLoading,
    error,
    reload,
  }
}
