
import { useInfiniteQuery, type QueryFunction } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import type { Product } from '../types/Product'
import type { InfiniteData } from '@tanstack/react-query'
import styles from './ProductListPage.module.css'

const LIMIT = 20

const fetchProducts: QueryFunction<
  Product[],                                    // data returned
  ['products', { search: string; category: string }], // query‑key tuple
  number                                        // pageParam type
> = async ({ pageParam = 0, queryKey }) => {
  const [_key, { search, category }] = queryKey

  const params = new URLSearchParams()
  params.set('offset', String(pageParam))
  params.set('limit', String(LIMIT))
  if (search) params.set('title', search)
  if (category !== 'all') params.set('category', category)

  const res = await fetch(
    `http://localhost:3000/api/v1/products?${params.toString()}`
  )
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}


export default function ProductListPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | 'electronics' | 'shoes'>('all')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<
        Product[],                                      // queryFnData
        Error,                                          // error
        InfiniteData<Product[], number>,                                    // select‑data (same)
        ['products', { search: string; category: string }], // query‑key shape
        number                                          // page‑param type
        >({
    queryKey: ['products', { search, category }],
    queryFn: fetchProducts,
    initialPageParam: 0,  
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length * LIMIT,
  })

  useIntersectionObserver({
    target: loadMoreRef as React.RefObject<Element>,
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  })

  if (isLoading) return <ProductSkeleton />
  if (error) return <div>Error: {error.message}</div>

    return (
    <div className={styles.container}>
        <div className={styles.controls}>
        <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'all' | 'electronics' | 'shoes')}
        >
            <option value="electronics">Electronics</option>
            <option value="shoes">Jewelery</option>
            <option value="all">All</option>
        </select>
        </div>

        <div className={styles.grid}>
        {data?.pages.flat().map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>

        <div ref={loadMoreRef} className={styles.loadMore}>
        {isFetchingNextPage && <ProductSkeleton />}
        </div>
    </div>
    )
}
