import { Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { DehydratedState, Mutation } from '@tanstack/react-query'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  focusManager,
  onlineManager,
  hydrate,
} from '@tanstack/react-query'

interface AdvancedQueryClientProviderProps {
  children: ReactNode
  dehydratedState?: DehydratedState
}

/**
 * Create queryCache with global error logging
 */
const queryCache = new QueryCache({
  onError: (error: unknown, query) => {
    console.error(`Query error on ${JSON.stringify(query.queryKey)}:`, error)
  },
})

/**
 * Create mutationCache with global error logging
 */
const mutationCache = new MutationCache({
  onError: (error: unknown, mutation) => {
    const typedMutation = mutation as Mutation<
      unknown,
      unknown,
      unknown,
      unknown
    >
    console.error(
      `Mutation error on ${JSON.stringify(typedMutation.options.mutationKey)}:`,
      error
    )
  },
})

function createMyQueryClient(): QueryClient {
  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        suspense: true,
        useErrorBoundary: true,
      },
      mutations: {
        retry: 1,
        useErrorBoundary: true,
      },
    },
  })
}

export function AdvancedQueryClientProvider({
  children,
  dehydratedState,
}: AdvancedQueryClientProviderProps) {
  const [queryClient] = useState<QueryClient>(() => createMyQueryClient())

  if (dehydratedState) {
    hydrate(queryClient, dehydratedState)
  }

  useEffect(() => {
    // Manage focus and online state for auto refetch
    function onFocus() {
      focusManager.setFocused(true)
    }
    function onBlur() {
      focusManager.setFocused(false)
    }
    function onOnline() {
      onlineManager.setOnline(true)
    }
    function onOffline() {
      onlineManager.setOnline(false)
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
