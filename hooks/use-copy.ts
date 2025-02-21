'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function useCopy() {
  const [isCopying, setIsCopying] = useState(false)

  const copy = async (text: string) => {
    if (isCopying) return

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
      console.error('复制失败:', error)
    } finally {
      setIsCopying(false)
    }
  }

  return {
    copy,
    isCopying
  }
}
