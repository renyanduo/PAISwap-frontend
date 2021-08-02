import { createStore } from 'redux'
import reducer from './reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage: storageSession,
  stateReconciler: autoMergeLevel2
}

const myPersistReducer = persistReducer(persistConfig, reducer)

const store = createStore(myPersistReducer)

export const persistor = persistStore(store)
export default store
