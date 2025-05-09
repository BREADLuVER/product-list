import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProductSkeleton from '../components/ProductSkeleton'
import styles from './ProductDetailPage.module.css'

const fetchProduct = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  })

  if (isLoading) return <ProductSkeleton />
  if (isError && error instanceof Error) return <div>Error: {error.message}</div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        <img src={product.images[0]} alt={product.title} className={styles.image} />
        <div className={styles.info}>
          <h1>{product.title}</h1>
          <p>${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <span className={styles.tag}>{product.category?.name}</span>
        </div>
      </div>
    </div>
  )
}
