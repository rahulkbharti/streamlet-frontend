"use client";
import { Provider } from 'react-redux';
import store, { persistor } from './store'; // persistor ko import karein
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
        },
    },
})
export function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    );
}