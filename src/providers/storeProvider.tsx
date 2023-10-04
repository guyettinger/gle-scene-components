import { createContext, ReactNode, useContext } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import rootStore, { RootStore } from '../stores'

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({children}: { children: ReactNode }) => {
    const store = useLocalObservable(() => rootStore)
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    return store;
}