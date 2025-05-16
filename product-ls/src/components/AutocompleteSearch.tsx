import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import styles from './AutocompleteSearch.module.css' // Create as needed

type Product = {
  id: number
  title: string
}

export default function AutocompleteSearch() {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query) return setSuggestions([])
    try {
      const res = await fetch(`http://localhost:3000/api/v1/products?title=${query}&limit=5`)
      const data = await res.json()
      setSuggestions(data)
      setShowDropdown(true)
    } catch (err) {
      console.error(err)
    }
  }, 300)

  useEffect(() => {
    fetchSuggestions(input)
  }, [input])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && suggestions[selectedIndex]) {
      navigate(`/product/${suggestions[selectedIndex].id}`)
      setShowDropdown(false)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const handlePrefetch = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['product', String(id)],
      queryFn: async () => {
        const res = await fetch(`http://localhost:3000/api/v1/products/${id}`)
        if (!res.ok) throw new Error('Failed to prefetch product')
        return res.json()
      }
    })
  }

  const highlightMatch = (text: string) => {
    const idx = text.toLowerCase().indexOf(input.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + input.length)}</mark>
        {text.slice(idx + input.length)}
      </>
    )
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        placeholder="Search products..."
        className={styles.input}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className={styles.dropdown}>
          {suggestions.map((product, index) => (
            <li
              key={product.id}
              className={`${styles.item} ${index === selectedIndex ? styles.active : ''}`}
              onMouseEnter={() => {
                setSelectedIndex(index)
                handlePrefetch(product.id)
              }}
              onClick={() => {
                navigate(`/product/${product.id}`)
                setShowDropdown(false)
              }}
            >
              {highlightMatch(product.title)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
