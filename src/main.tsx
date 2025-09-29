import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './routes.ts'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider  router={router} />
  </QueryClientProvider>
)
