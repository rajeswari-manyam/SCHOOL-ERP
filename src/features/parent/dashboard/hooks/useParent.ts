import { useState, useEffect } from "react"
import { getParentById } from "@/services/parent.api"
import type { Parent } from "@/services/parent.api"

export function useParentById(parentId?: string) {
  const [parent, setParent] = useState<Parent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!parentId) {
      setParent(null)
      return
    }
    setLoading(true)
    setError(null)
    getParentById(parentId)
      .then(setParent)
      .catch((err) => {
        console.error("useParentById:", err)
        setError("Failed to load parent")
      })
      .finally(() => setLoading(false))
  }, [parentId])

  return { parent, loading, error }
}
