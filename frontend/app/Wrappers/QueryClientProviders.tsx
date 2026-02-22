'use client';
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryClientProviders