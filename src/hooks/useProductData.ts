/**
 * React hook for loading product data from runtime files
 */

import { useState, useEffect } from 'react'
import { loadProductDataRuntime } from '@/lib/product-loader'
import type { ProductData } from '@/types/product'

export function useProductData(): ProductData | null {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      setLoading(true)
      try {
        const data = await loadProductDataRuntime()
        if (mounted) {
          setProductData(data)
        }
      } catch (error) {
        console.error('Failed to load product data:', error)
        if (mounted) {
          setProductData(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  return loading ? null : productData
}

