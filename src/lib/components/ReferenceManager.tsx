import React, { useState, useEffect } from 'react'

interface Reference {
  id: number
  content: string
}

export function ReferenceManager() {
  const [references, setReferences] = useState<Reference[]>([])
  const [newReference, setNewReference] = useState('')

  useEffect(() => {
    // 从 localStorage 加载已存储的引用
    const storedReferences = localStorage.getItem('references')
    if (storedReferences) {
      setReferences(JSON.parse(storedReferences))
    }
  }, [])

  const saveReferences = (refs: Reference[]) => {
    setReferences(refs)
    localStorage.setItem('references', JSON.stringify(refs))
  }

  const addReference = () => {
    if (!newReference.trim()) return
    
    const newRef: Reference = {
      id: references.length + 1,
      content: newReference.trim()
    }
    
    saveReferences([...references, newRef])
    setNewReference('')
  }

} 