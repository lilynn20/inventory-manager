import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

/**
 * Configuration du store Redux avec Redux Toolkit
 * 
 * Le store contient deux slices principaux :
 * - weather : gestion de la météo actuelle et des prévisions
 * - favorites : gestion des villes épinglées (persistées dans localStorage)
 */
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
  },
  // Middleware par défaut de Redux Toolkit inclut redux-thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore les warnings pour les dates dans les actions
        ignoredActions: ['favorites/addCity', 'favorites/updateCityWeather'],
        ignoredPaths: ['favorites.cities'],
      },
    }),
});

export default store;
