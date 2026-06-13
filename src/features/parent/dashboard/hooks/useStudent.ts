import { useState, useEffect } from "react"
import { getStudentById } from "@/services/student.api"
import type { Student } from "@/services/student.api"

export function useStudentById(studentId: string) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) {
      setStudent(null)
      return
    }
    setLoading(true)
    setError(null)
    getStudentById(studentId)
      .then(setStudent)
      .catch((err) => {
        console.error("useStudentById:", err)
        setError("Failed to load student")
      })
      .finally(() => setLoading(false))
  }, [studentId])

  return { student, loading, error }
}