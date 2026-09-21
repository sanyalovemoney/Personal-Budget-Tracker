# BudgetFlow — Personal Budget Tracker

Вебдодаток для обліку особистих фінансів: доходи й витрати по категоріях, місячні ліміти бюджету, аналітика та прогноз витрат, експорт у CSV. Працює або локально (LocalStorage, без реєстрації), або з хмарною синхронізацією через Firebase.

## Можливості

- Додавання, редагування та видалення доходів і витрат
- Фільтрація по місяцю, типу, категорії та пошук по примітках
- Місячні ліміти по 8 категоріях з індикатором перевитрати
- Графіки: щоденна динаміка доходів/витрат і розподіл витрат по категоріях
- Прогноз витрат до кінця місяця за поточним темпом
- Перемикання валют USD / EUR / UAH з реальною конвертацією сум
- Темна тема зі збереженням вибору
- Експорт транзакцій у CSV (UTF-8 BOM, із захистом від формул у Excel)
- Адаптивний інтерфейс від 390px

## Стек

React 19, Vite 8, Tailwind CSS 4, Chart.js (react-chartjs-2), Firebase 12 (Auth + Firestore), date-fns, lucide-react, Oxlint.

## Запуск

Потрібен Node.js 20+ (перевірено на 24).

```bash
npm install
npm run dev
```

Vite виведе адресу (типово http://localhost:5173) — відкрийте її в браузері й не закривайте термінал.

Інші команди:

```bash
npm run build     # продакшн-збірка у dist/
npm run preview   # локальний перегляд зібраного бандла
npm run lint      # Oxlint
```

## Режими роботи

**Демо-режим (за замовчуванням).** Якщо файлу `.env` немає, Firebase не ініціалізується взагалі, а дані зберігаються в LocalStorage браузера під гостьовим профілем. Нічого налаштовувати не треба.

**Хмарний режим.** Якщо в `.env` задані ключі Firebase, стають доступними вхід через email/пароль або Google і синхронізація транзакцій та бюджетів у Cloud Firestore. Після виходу з акаунта додаток повертається до гостьових даних у LocalStorage — дані акаунта й гостя не змішуються.

### Налаштування Firebase

1. Створіть проєкт у [Firebase Console](https://console.firebase.google.com/) і додайте вебдодаток.
2. Увімкніть **Authentication → Sign-in method → Email/Password** (і Google, якщо потрібен вхід через Google).
3. Створіть базу **Cloud Firestore**.
4. Скопіюйте `.env.example` у `.env` і підставте значення з налаштувань вебдодатка:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env` у git не потрапляє. Перезапустіть `npm run dev` після зміни змінних.

Дані користувача зберігаються за шляхами `users/{uid}/transactions` і `users/{uid}/budgets`, тож правила Firestore мають дозволяти доступ лише власнику:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Валюти

Суми зберігаються в базовій валюті (USD) і конвертуються лише для відображення та вводу. Курси захардкоджені у `src/utils/currency.js` (`EXCHANGE_RATES`, дата в `RATES_UPDATED_AT`) — щоб оновити їх, змініть цей файл або підставте значення з зовнішнього API.

## Структура

```
src/
  components/
    analytics/   графіки та прогнози
    auth/        модалка входу/реєстрації
    budgets/     картки лімітів і їх редагування
    expenses/    форма, список і рядки транзакцій
    layout/      навбар і каркас сторінки
    ui/          Button, Card, Modal, Badge, Alert
  context/       AuthContext, BudgetContext (стан, синхронізація, CRUD)
  config/        ініціалізація Firebase
  utils/         категорії, конвертація валют, формати, експорт CSV
  App.jsx        дашборд і керування модалками
```

## Категорії за замовчуванням

Продукти харчування (400), Житло та Комунальні (600), Транспорт та Паливо (150), Розваги та Відпочинок (200), Здоров'я та Аптека (100), Освіта та Книги (150), Одяг та Покупки (250), Інше (100). Ліміти в USD; якщо категорії не задали власний ліміт, використовується значення за замовчуванням.
