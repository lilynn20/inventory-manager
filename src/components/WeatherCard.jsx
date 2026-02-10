import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCity, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { WEATHER_ICONS } from '../utils/constants';

/**
 * Composant WeatherCard
 * Affiche les informations météo d'une ville
 * @param {Object} weatherData - Données météo de l'API
 */
const WeatherCard = ({ weatherData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFavorite = useSelector(state => 
    selectIsFavorite(state, weatherData?.id)
  );

  if (!weatherData) return null;

  const {
    id,
    name,
    sys,
    main,
    weather,
    wind,
  } = weatherData;

  const weatherIcon = WEATHER_ICONS[weather[0]?.icon] || '🌤️';
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);

  /**
   * Ajoute la ville aux favoris
   */
  const handleAddToFavorites = () => {
    const cityData = {
      id,
      name,
      country: sys.country,
      temp: temperature,
      weather: weather[0].main,
      description: weather[0].description,
      icon: weather[0].icon,
      humidity: main.humidity,
      windSpeed: wind.speed,
    };
    dispatch(addCity(cityData));
  };

  /**
   * Navigation vers les détails
   */
  const handleViewDetails = () => {
    navigate(`/city/${name}`);
  };

  return (
    <div className="card">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {name}, {sys.country}
          </h2>
          <p className="text-gray-600 mt-1 capitalize">
            {weather[0].description}
          </p>
        </div>
        <div className="text-6xl">{weatherIcon}</div>
      </div>

      {/* Température principale */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-gray-900">
            {temperature}°
          </span>
          <span className="text-2xl text-gray-600">C</span>
        </div>
        <p className="text-gray-600 mt-2">
          Ressenti : {feelsLike}°C
        </p>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <div>
            <p className="text-sm text-gray-600">Humidité</p>
            <p className="font-semibold">{main.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌬️</span>
          <div>
            <p className="text-sm text-gray-600">Vent</p>
            <p className="font-semibold">{wind.speed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌡️</span>
          <div>
            <p className="text-sm text-gray-600">Min / Max</p>
            <p className="font-semibold">
              {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔽</span>
          <div>
            <p className="text-sm text-gray-600">Pression</p>
            <p className="font-semibold">{main.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!isFavorite ? (
          <button
            onClick={handleAddToFavorites}
            className="btn-primary flex-1"
          >
            ⭐ Épingler cette ville
          </button>
        ) : (
          <button
            disabled
            className="btn-secondary flex-1 opacity-60 cursor-not-allowed"
          >
            ✓ Déjà épinglée
          </button>
        )}
        <button
          onClick={handleViewDetails}
          className="btn-secondary"
        >
          📊 Voir détails
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
