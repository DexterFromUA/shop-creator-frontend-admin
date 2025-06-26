// Firebase stub - мы используем GraphQL авторизацию
// Этот файл сохранен для совместимости с PhoneAuth компонентом

let app = null;
let auth = null;

// Проверяем наличие Firebase переменных окружения
const hasFirebaseConfig = 
  process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (hasFirebaseConfig) {
  // Загружаем Firebase только если есть настройки
  try {
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
} else {
  console.log('Firebase not configured - using GraphQL auth only');
}

export { auth }; 