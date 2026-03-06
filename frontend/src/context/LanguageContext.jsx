import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

// Translation keys
const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      products: 'Products',
      categories: 'Categories',
      suppliers: 'Suppliers',
      stockMovements: 'Stock Movements',
      predictions: 'Predictions',
      team: 'Team',
      activityLogs: 'Activity Logs',
      notifications: 'Notifications',
      importData: 'Import Data',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      overview: 'Overview',
      inventory: 'Inventory',
      analytics: 'Analytics',
      administration: 'Administration',
    },
    // Common actions
    actions: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      view: 'View',
      close: 'Close',
      submit: 'Submit',
      reset: 'Reset',
      back: 'Back',
      next: 'Next',
      create: 'Create',
      update: 'Update',
      loading: 'Loading...',
      saving: 'Saving...',
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalProducts: 'Total Products',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      totalValue: 'Total Value',
      recentMovements: 'Recent Movements',
      topProducts: 'Top Products',
      stockOverview: 'Stock Overview',
      period: 'Period',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisYear: 'This Year',
      allTime: 'All Time',
    },
    // Products
    products: {
      title: 'Products',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      productName: 'Product Name',
      sku: 'SKU',
      category: 'Category',
      supplier: 'Supplier',
      quantity: 'Quantity',
      price: 'Price',
      minStock: 'Minimum Stock',
      description: 'Description',
      status: 'Status',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      noProducts: 'No products found',
      deleteConfirm: 'Are you sure you want to delete this product?',
    },
    // Categories
    categories: {
      title: 'Categories',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      categoryName: 'Category Name',
      description: 'Description',
      productCount: 'Products',
      noCategories: 'No categories found',
      deleteConfirm: 'Are you sure you want to delete this category?',
    },
    // Suppliers
    suppliers: {
      title: 'Suppliers',
      addSupplier: 'Add Supplier',
      editSupplier: 'Edit Supplier',
      supplierName: 'Supplier Name',
      contactName: 'Contact Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      noSuppliers: 'No suppliers found',
      deleteConfirm: 'Are you sure you want to delete this supplier?',
    },
    // Stock Movements
    movements: {
      title: 'Stock Movements',
      addMovement: 'Add Movement',
      type: 'Type',
      in: 'Stock In',
      out: 'Stock Out',
      product: 'Product',
      quantity: 'Quantity',
      reason: 'Reason',
      date: 'Date',
      noMovements: 'No movements found',
    },
    // Predictions
    predictions: {
      title: 'Predictions',
      forecast: 'Demand Forecast',
      reorderSuggestions: 'Reorder Suggestions',
      predictedDemand: 'Predicted Demand',
      confidence: 'Confidence',
      reorderPoint: 'Reorder Point',
      suggestedQuantity: 'Suggested Quantity',
    },
    // Team/Employees
    team: {
      title: 'Team',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      admin: 'Admin',
      employee: 'Employee',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      noEmployees: 'No employees found',
      deleteConfirm: 'Are you sure you want to delete this employee?',
    },
    // Profile
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updateProfile: 'Update Profile',
    },
    // Settings
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      companyName: 'Company Name',
      fullName: 'Full Name',
    },
    // Messages
    messages: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      saved: 'Saved successfully',
      deleted: 'Deleted successfully',
      updated: 'Updated successfully',
      created: 'Created successfully',
      confirmDelete: 'Are you sure you want to delete this item?',
      noData: 'No data available',
      loading: 'Loading...',
    },
    // Table
    table: {
      actions: 'Actions',
      showing: 'Showing',
      of: 'of',
      results: 'results',
      noResults: 'No results found',
      rowsPerPage: 'Rows per page',
      page: 'Page',
    },
    // Time
    time: {
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      lastWeek: 'Last week',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      thisYear: 'This year',
    },
  },
  fr: {
    // Navigation
    nav: {
      dashboard: 'Tableau de bord',
      products: 'Produits',
      categories: 'Catégories',
      suppliers: 'Fournisseurs',
      stockMovements: 'Mouvements de stock',
      predictions: 'Prédictions',
      team: 'Équipe',
      activityLogs: 'Journaux d\'activité',
      notifications: 'Notifications',
      importData: 'Importer des données',
      profile: 'Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      overview: 'Aperçu',
      inventory: 'Inventaire',
      analytics: 'Analytique',
      administration: 'Administration',
    },
    // Common actions
    actions: {
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      search: 'Rechercher',
      filter: 'Filtrer',
      export: 'Exporter',
      import: 'Importer',
      refresh: 'Actualiser',
      view: 'Voir',
      close: 'Fermer',
      submit: 'Soumettre',
      reset: 'Réinitialiser',
      back: 'Retour',
      next: 'Suivant',
      create: 'Créer',
      update: 'Mettre à jour',
      loading: 'Chargement...',
      saving: 'Enregistrement...',
    },
    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      totalProducts: 'Total des produits',
      lowStock: 'Stock faible',
      outOfStock: 'Rupture de stock',
      totalValue: 'Valeur totale',
      recentMovements: 'Mouvements récents',
      topProducts: 'Produits populaires',
      stockOverview: 'Aperçu du stock',
      period: 'Période',
      today: 'Aujourd\'hui',
      thisWeek: 'Cette semaine',
      thisMonth: 'Ce mois',
      thisYear: 'Cette année',
      allTime: 'Tout le temps',
    },
    // Products
    products: {
      title: 'Produits',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      productName: 'Nom du produit',
      sku: 'SKU',
      category: 'Catégorie',
      supplier: 'Fournisseur',
      quantity: 'Quantité',
      price: 'Prix',
      minStock: 'Stock minimum',
      description: 'Description',
      status: 'Statut',
      inStock: 'En stock',
      lowStock: 'Stock faible',
      outOfStock: 'Rupture de stock',
      noProducts: 'Aucun produit trouvé',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit?',
    },
    // Categories
    categories: {
      title: 'Catégories',
      addCategory: 'Ajouter une catégorie',
      editCategory: 'Modifier la catégorie',
      categoryName: 'Nom de la catégorie',
      description: 'Description',
      productCount: 'Produits',
      noCategories: 'Aucune catégorie trouvée',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
    },
    // Suppliers
    suppliers: {
      title: 'Fournisseurs',
      addSupplier: 'Ajouter un fournisseur',
      editSupplier: 'Modifier le fournisseur',
      supplierName: 'Nom du fournisseur',
      contactName: 'Nom du contact',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      noSuppliers: 'Aucun fournisseur trouvé',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce fournisseur?',
    },
    // Stock Movements
    movements: {
      title: 'Mouvements de stock',
      addMovement: 'Ajouter un mouvement',
      type: 'Type',
      in: 'Entrée de stock',
      out: 'Sortie de stock',
      product: 'Produit',
      quantity: 'Quantité',
      reason: 'Raison',
      date: 'Date',
      noMovements: 'Aucun mouvement trouvé',
    },
    // Predictions
    predictions: {
      title: 'Prédictions',
      forecast: 'Prévision de la demande',
      reorderSuggestions: 'Suggestions de réapprovisionnement',
      predictedDemand: 'Demande prévue',
      confidence: 'Confiance',
      reorderPoint: 'Point de réapprovisionnement',
      suggestedQuantity: 'Quantité suggérée',
    },
    // Team/Employees
    team: {
      title: 'Équipe',
      addEmployee: 'Ajouter un employé',
      editEmployee: 'Modifier l\'employé',
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      admin: 'Administrateur',
      employee: 'Employé',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      noEmployees: 'Aucun employé trouvé',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet employé?',
    },
    // Profile
    profile: {
      title: 'Profil',
      personalInfo: 'Informations personnelles',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      updateProfile: 'Mettre à jour le profil',
    },
    // Settings
    settings: {
      title: 'Paramètres',
      appearance: 'Apparence',
      language: 'Langue',
      theme: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
      notifications: 'Notifications',
      emailNotifications: 'Notifications par email',
      pushNotifications: 'Notifications push',
    },
    // Auth
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      rememberMe: 'Se souvenir de moi',
      noAccount: 'Vous n\'avez pas de compte?',
      hasAccount: 'Vous avez déjà un compte?',
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      signOut: 'Se déconnecter',
      companyName: 'Nom de l\'entreprise',
      fullName: 'Nom complet',
    },
    // Messages
    messages: {
      success: 'Succès',
      error: 'Erreur',
      warning: 'Avertissement',
      info: 'Info',
      saved: 'Enregistré avec succès',
      deleted: 'Supprimé avec succès',
      updated: 'Mis à jour avec succès',
      created: 'Créé avec succès',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément?',
      noData: 'Aucune donnée disponible',
      loading: 'Chargement...',
    },
    // Table
    table: {
      actions: 'Actions',
      showing: 'Affichage de',
      of: 'sur',
      results: 'résultats',
      noResults: 'Aucun résultat trouvé',
      rowsPerPage: 'Lignes par page',
      page: 'Page',
    },
    // Time
    time: {
      today: 'Aujourd\'hui',
      yesterday: 'Hier',
      thisWeek: 'Cette semaine',
      lastWeek: 'La semaine dernière',
      thisMonth: 'Ce mois',
      lastMonth: 'Le mois dernier',
      thisYear: 'Cette année',
    },
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('language')
    if (stored && (stored === 'en' || stored === 'fr')) return stored
    // Check browser language
    const browserLang = navigator.language.slice(0, 2)
    return browserLang === 'fr' ? 'fr' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en')
  }

  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'fr') {
      setLanguage(lang)
    }
  }

  // Get translation by key path (e.g., 'nav.dashboard')
  const t = (keyPath, fallback = '') => {
    const keys = keyPath.split('.')
    let value = translations[language]
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return fallback || keyPath
      }
    }
    
    return typeof value === 'string' ? value : fallback || keyPath
  }

  const isFrench = language === 'fr'

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: switchLanguage, 
      toggleLanguage, 
      t, 
      isFrench,
      translations: translations[language]
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
