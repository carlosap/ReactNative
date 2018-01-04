import { AsyncStorage } from 'react-native'
import { createStore, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import reducer from './reducers'

const store = compose(autoRehydrate())(createStore)(reducer)
persistStore(store, { storage: AsyncStorage })

export default store