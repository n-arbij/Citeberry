import { useState, useCallback, useEffect } from 'react'

/**
 * Fetches data from an async function.
 * @param {() => Promise<any>} fetchFn  - stable function reference (useCallback)
 * @param {boolean} immediate           - whether to load on mount (default: true)
 */
export function useFetch(fetchFn, immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [fetchFn])

  useEffect(() => { if (immediate) load() }, [load, immediate])

  return { data, loading, error, load, setData }
}
