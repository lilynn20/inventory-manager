import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook for optimistic UI updates
 * Updates UI immediately, then syncs with server
 * Rolls back on error
 */
export function useOptimistic(initialData, options = {}) {
  const [data, setData] = useState(initialData)
  const [pending, setPending] = useState(new Set())
  const rollbackRef = useRef(new Map())

  const { onError = (err) => toast.error(err.message || 'Operation failed') } = options

  /**
   * Perform an optimistic update
   * @param {string} id - Unique operation ID
   * @param {Function} optimisticUpdate - Function to update state optimistically (data) => newData
   * @param {Function} serverAction - Async function to perform server action
   * @param {Function} rollback - Optional custom rollback function, defaults to restoring previous state
   */
  const optimistic = useCallback(async (id, optimisticUpdate, serverAction, customRollback) => {
    // Store current state for rollback
    const previousData = data
    rollbackRef.current.set(id, previousData)

    // Apply optimistic update immediately
    const newData = optimisticUpdate(data)
    setData(newData)
    setPending(prev => new Set(prev).add(id))

    try {
      // Perform server action
      const result = await serverAction()
      
      // Optionally update with server response
      if (result !== undefined) {
        setData(result)
      }
      
      rollbackRef.current.delete(id)
      return result
    } catch (err) {
      // Rollback on error
      if (customRollback) {
        customRollback(err)
      } else {
        setData(rollbackRef.current.get(id))
      }
      rollbackRef.current.delete(id)
      onError(err)
      throw err
    } finally {
      setPending(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [data, onError])

  /**
   * Add item optimistically
   */
  const addOptimistic = useCallback((item, serverAction) => {
    const tempId = `temp_${Date.now()}`
    const itemWithTemp = { ...item, _id: tempId, _temp: true }
    
    return optimistic(
      tempId,
      (current) => [...current, itemWithTemp],
      async () => {
        const result = await serverAction()
        // Replace temp item with real item from server
        setData(current => current.map(i => i._id === tempId ? result : i))
        return result
      }
    )
  }, [optimistic])

  /**
   * Update item optimistically
   */
  const updateOptimistic = useCallback((id, updates, serverAction) => {
    return optimistic(
      `update_${id}`,
      (current) => current.map(item => 
        (item._id || item.id) === id ? { ...item, ...updates, _updating: true } : item
      ),
      async () => {
        const result = await serverAction()
        setData(current => current.map(item => 
          (item._id || item.id) === id ? { ...result, _updating: false } : item
        ))
        return result
      }
    )
  }, [optimistic])

  /**
   * Delete item optimistically
   */
  const deleteOptimistic = useCallback((id, serverAction) => {
    return optimistic(
      `delete_${id}`,
      (current) => current.filter(item => (item._id || item.id) !== id),
      serverAction
    )
  }, [optimistic])

  /**
   * Check if an operation is pending
   */
  const isPending = useCallback((id) => {
    if (!id) return pending.size > 0
    return pending.has(id)
  }, [pending])

  return {
    data,
    setData,
    optimistic,
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    isPending,
    pendingCount: pending.size,
  }
}

/**
 * Hook for optimistic mutations with loading states
 */
export function useOptimisticMutation(mutationFn, options = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { 
    onSuccess, 
    onError = (err) => toast.error(err.message),
    onSettled,
  } = options

  const mutate = useCallback(async (variables, optimisticData) => {
    setIsLoading(true)
    setError(null)

    // If optimistic data provided, call onSuccess immediately
    if (optimisticData !== undefined) {
      onSuccess?.(optimisticData, variables, true) // true = optimistic
    }

    try {
      const result = await mutationFn(variables)
      onSuccess?.(result, variables, false) // false = from server
      return result
    } catch (err) {
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
      onSettled?.()
    }
  }, [mutationFn, onSuccess, onError, onSettled])

  return { mutate, isLoading, error }
}

export default useOptimistic
