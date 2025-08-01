import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.faq': 'FAQ',
      'nav.login': 'Login',
      'nav.register': 'Get Started',
      
      // Common
      'common.loading': 'Loading...',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.view': 'View',
      'common.download': 'Download',
      'common.upload': 'Upload',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',
      'common.required': 'Required',
      'common.optional': 'Optional',
      
      // Authentication
      'auth.login.title': 'Sign in to your account',
      'auth.register.title': 'Create your account',
      'auth.email': 'Email address',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.rememberMe': 'Remember me',
      'auth.forgotPassword': 'Forgot your password?',
      'auth.signIn': 'Sign in',
      'auth.createAccount': 'Create Account',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back',
      'dashboard.quickActions': 'Quick Actions',
      'dashboard.newApplication': 'New Application',
      'dashboard.myApplications': 'My Applications',
      'dashboard.statistics': 'Application Statistics',
      
      // Applications
      'app.organizationName': 'Organization Name',
      'app.status': 'Status',
      'app.submittedAt': 'Submitted At',
      'app.lastModified': 'Last Modified',
      'app.riskScore': 'Risk Score',
      
      // Status values
      'status.pending': 'Pending',
      'status.underReview': 'Under Review',
      'status.approved': 'Approved',
      'status.rejected': 'Rejected',
      'status.missingDocuments': 'Reviewing Again',
      
      // Error messages
      'error.required': 'This field is required',
      'error.email': 'Please enter a valid email address',
      'error.password': 'Password must be at least 8 characters',
      'error.passwordMatch': 'Passwords do not match',
      'error.network': 'Network error. Please try again.',
      'error.server': 'Server error. Please try again later.',
    }
  },
  rw: {
    translation: {
      // Navigation
      'nav.home': 'Ahabanza',
      'nav.services': 'Serivisi',
      'nav.about': 'Ibibazo',
      'nav.faq': 'Ibibazo Bikunze Kubazwa',
      'nav.login': 'Kwinjira',
      'nav.register': 'Tangira',
      
      // Common
      'common.loading': 'Birashakishwa...',
      'common.submit': 'Kohereza',
      'common.cancel': 'Kuraguza',
      'common.save': 'Bika',
      'common.edit': 'Hindura',
      'common.delete': 'Siba',
      'common.view': 'Reba',
      'common.download': 'Pakurura',
      'common.upload': 'Ohereza',
      'common.search': 'Shakisha',
      'common.filter': 'Shungura',
      'common.sort': 'Shyira muburyo',
      'common.required': 'Bisabwa',
      'common.optional': 'Bidashoboka',
      
      // Authentication
      'auth.login.title': 'Injira muri konti yawe',
      'auth.register.title': 'Kora konti nshya',
      'auth.email': 'Aderesi ya imeyili',
      'auth.password': 'Ijambo ry\'ibanga',
      'auth.confirmPassword': 'Emeza Ijambo ry\'ibanga',
      'auth.rememberMe': 'Nyibuka',
      'auth.forgotPassword': 'Wibagiwe ijambo ry\'ibanga?',
      'auth.signIn': 'Injira',
      'auth.createAccount': 'Kora Konti',
      
      // Dashboard
      'dashboard.welcome': 'Murakaza neza',
      'dashboard.quickActions': 'Ibikorwa Byihuse',
      'dashboard.newApplication': 'Gusaba Gushya',
      'dashboard.myApplications': 'Ibisabwa Byanjye',
      'dashboard.statistics': 'Imibare y\'Ibisabwa',
      
      // Applications  
      'app.organizationName': 'Izina ry\'Umuryango',
      'app.status': 'Uko Bimeze',
      'app.submittedAt': 'Byoherejwe ku wa',
      'app.lastModified': 'Byahinduwe bwa nyuma ku wa',
      'app.riskScore': 'Amanota y\'Ingaruka',
      
      // Status values
      'status.pending': 'Bitegerejwe',
      'status.underReview': 'Birageuzwa',
      'status.approved': 'Byemewe',
      'status.rejected': 'Byanze',
      'status.missingDocuments': 'Inyandiko Zibura',
      
      // Error messages
      'error.required': 'Uru ruga ni ngombwa',
      'error.email': 'Shyiramo imeyili nyayo',
      'error.password': 'Ijambo ry\'ibanga rigomba kuba rirenze inyuguti 8',
      'error.passwordMatch': 'Amagambo y\'ibanga ntabwo asa',
      'error.network': 'Ikibazo cya network. Gerageza nanone.',
      'error.server': 'Ikibazo cya seriveri. Gerageza nanone nyuma.',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.services': 'Services',
      'nav.about': 'À Propos',
      'nav.faq': 'FAQ',
      'nav.login': 'Connexion',
      'nav.register': 'Commencer',
      
      // Common
      'common.loading': 'Chargement...',
      'common.submit': 'Soumettre',
      'common.cancel': 'Annuler',
      'common.save': 'Sauvegarder',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.view': 'Voir',
      'common.download': 'Télécharger',
      'common.upload': 'Téléverser',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',
      'common.required': 'Requis',
      'common.optional': 'Optionnel',
      
      // Authentication
      'auth.login.title': 'Connectez-vous à votre compte',
      'auth.register.title': 'Créez votre compte',
      'auth.email': 'Adresse e-mail',
      'auth.password': 'Mot de passe',
      'auth.confirmPassword': 'Confirmer le mot de passe',
      'auth.rememberMe': 'Se souvenir de moi',
      'auth.forgotPassword': 'Mot de passe oublié?',
      'auth.signIn': 'Se connecter',
      'auth.createAccount': 'Créer un compte',
      
      // Dashboard
      'dashboard.welcome': 'Bienvenue',
      'dashboard.quickActions': 'Actions Rapides',
      'dashboard.newApplication': 'Nouvelle Demande',
      'dashboard.myApplications': 'Mes Demandes',
      'dashboard.statistics': 'Statistiques des Demandes',
      
      // Applications
      'app.organizationName': 'Nom de l\'Organisation',
      'app.status': 'Statut',
      'app.submittedAt': 'Soumis le',
      'app.lastModified': 'Dernière modification',
      'app.riskScore': 'Score de Risque',
      
      // Status values
      'status.pending': 'En Attente',
      'status.underReview': 'En Révision',
      'status.approved': 'Approuvé',
      'status.rejected': 'Rejeté',
      'status.missingDocuments': 'Documents Manquants',
      
      // Error messages
      'error.required': 'Ce champ est requis',
      'error.email': 'Veuillez entrer une adresse e-mail valide',
      'error.password': 'Le mot de passe doit contenir au moins 8 caractères',
      'error.passwordMatch': 'Les mots de passe ne correspondent pas',
      'error.network': 'Erreur réseau. Veuillez réessayer.',
      'error.server': 'Erreur serveur. Veuillez réessayer plus tard.',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;