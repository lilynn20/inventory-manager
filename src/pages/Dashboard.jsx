import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CityCard from '../components/CityCard';
import { removeCity, clearAllFavorites } from '../features/favorites/favoritesSlice';

/**
 * Page Dashboard
 * Affiche et gère les villes favorites épinglées
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.cities);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  /**
   * Supprime une ville des favoris
   */
  const handleRemoveCity = (cityId) => {
    dispatch(removeCity(cityId));
  };

  /**
   * Efface tous les favoris après confirmation
   */
  const handleClearAll = () => {
    if (showConfirmDelete) {
      dispatch(clearAllFavorites());
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      // Réinitialise après 3 secondes
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  /**
   * Navigation vers la page d'accueil
   */
  const handleGoToSearch = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📌 Mes Destinations
              </h1>
              <p className="text-gray-600">
                Vos villes épinglées ({favorites.length})
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGoToSearch}
                className="btn-secondary"
              >
                ➕ Ajouter une ville
              </button>
              {favorites.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className={`${
                    showConfirmDelete ? 'btn-danger' : 'btn-secondary'
                  }`}
                >
                  {showConfirmDelete ? '⚠️ Confirmer la suppression' : '🗑️ Tout effacer'}
                </button>
              )}
            </div>
          </div>

          {/* Barre de statistiques */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Température moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    favorites.reduce((acc, city) => acc + city.temp, 0) / favorites.length
                  )}°C
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Ville la plus chaude</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.reduce((max, city) => 
                    city.temp > max.temp ? city : max
                  ).name}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Ville la plus froide</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.reduce((min, city) => 
                    city.temp < min.temp ? city : min
                  ).name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Liste des villes favorites */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onRemove={handleRemoveCity}
              />
            ))}
          </div>
        ) : (
          // Message vide
          <div className="text-center py-16">
            <div className="card max-w-2xl mx-auto">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Aucune ville épinglée
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par rechercher une ville et ajoutez-la à vos favoris
                pour la retrouver ici facilement.
              </p>
              <button
                onClick={handleGoToSearch}
                className="btn-primary"
              >
                🔍 Rechercher une ville
              </button>
            </div>
          </div>
        )}

        {/* Conseils */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              💡 Conseil de voyage
            </h4>
            <p className="text-blue-800 text-sm">
              Consultez les détails météo de chaque ville pour planifier au mieux
              vos déplacements. Les températures et conditions peuvent varier
              rapidement !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
