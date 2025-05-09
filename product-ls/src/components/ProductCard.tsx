import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import styles from './ProductCard.module.css'

type Product = {
  id: number
  title: string
  price: number
  images: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient()

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: async () => {
        const res = await fetch(`http://localhost:3000/api/v1/products/${product.id}`)
        if (!res.ok) throw new Error('Failed to load product')
        return res.json()
      },
    })
  }, [product.id, queryClient])

return (
  <Link to={`/product/${product.id}`} onMouseEnter={prefetch} className={styles.card}>
    <img src={product.images[0]} alt={product.title} className={styles.image} />
    <h3 className={styles.title}>{product.title}</h3>
    <p className={styles.price}>${product.price.toFixed(2)}</p>
  </Link>
)
}
