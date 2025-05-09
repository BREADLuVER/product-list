import { useEffect } from 'react'

type Props = {
  target: React.RefObject<Element>
  onIntersect: () => void
  enabled: boolean
  rootMargin?: string
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled,
  rootMargin = '200px',
}: Props) {
  useEffect(() => {
    if (!enabled) return
    const node = target?.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.unobserve(node)
  }, [enabled, target, onIntersect, rootMargin])
}