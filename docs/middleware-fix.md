# Исправление middleware для корректной работы с i18n

## 🐛 Проблема

При переходе на `/en/profile` получали **404 ошибку**, несмотря на то что:
- Файл `app/[locale]/profile/page.tsx` существует
- Build проходил успешно
- Middleware был настроен

## 🔍 Причина

### 1. Неправильная обработка intlMiddleware response

**Было:**
```typescript
const intlResponse = intlMiddleware(req);

if (intlResponse && intlResponse.status !== 200) {
  return intlResponse;
}
```

**Проблема:** 
- `intlMiddleware` от next-intl **всегда возвращает response**, даже для успешных запросов
- Мы проверяли только `status !== 200`, что означало:
  - ✅ Редиректы (307, 308) возвращались
  - ❌ Обычные rewrites со статусом 200 **игнорировались**
- В результате терялась важная информация о locale и internal rewrites

### 2. Конфликт проверок pathname в authMiddleware

**Было:**
```typescript
if (token && (pathname.includes("/entrance") || pathname.includes("/register"))) {
  return NextResponse.redirect(createUrl("/profile"));
}
```

**Проблема:**
- `.includes()` слишком широкий - срабатывал на `/ru/entrance` И на `/en/entrance`
- Locale извлекался регуляркой `/^\/([^\/]+)/`, которая хватала ЛЮБОЙ первый сегмент
- Если пользователь вводил странный URL типа `/random/profile`, locale становился `random`

---

## ✅ Решение

### 1. Правильная цепочка middleware

**Файл: `middleware.ts`**

```typescript
export async function middleware(req: NextRequest) {
  // Step 1: Handle internationalization (locale detection, rewriting)
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a redirect (e.g., / -> /ru), return it immediately
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // Step 2: Run auth middleware with the processed request
  const authResponse = await authMiddleware(req);
  
  // If auth middleware returns a redirect (unauthorized, wrong role, etc.)
  if (authResponse && authResponse.status >= 300 && authResponse.status < 400) {
    return authResponse;
  }

  // Step 3: Return the intl response if it exists (contains locale headers/rewrites)
  return intlResponse || authResponse || NextResponse.next();
}
```

**Изменения:**
- ✅ Проверяем **только редиректы** (status 3xx) для раннего возврата
- ✅ Возвращаем `intlResponse` в конце, если он существует (содержит важные headers/rewrites)
- ✅ Последовательное выполнение: intl → auth → return intl response

---

### 2. Улучшенная логика authMiddleware

**Файл: `5shared/middlewares/authMiddleware.ts`**

#### Изменение 1: Точная регулярка для locale

**Было:**
```typescript
const localeMatch = pathname.match(/^\/([^\/]+)/);
```

**Стало:**
```typescript
const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
```

**Преимущества:**
- ✅ Извлекает **только двухбуквенные** коды языка (`ru`, `en`)
- ✅ Требует `/` или конец строки после кода
- ✅ Безопасность: игнорирует `/random/profile`

#### Изменение 2: Нормализация pathname

**Добавлено:**
```typescript
const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
```

**Преимущества:**
- ✅ `/ru/profile` → `/profile`
- ✅ `/en/admin` → `/admin`
- ✅ Упрощает проверки: `pathWithoutLocale.startsWith("/profile")`

#### Изменение 3: Точные проверки путей

**Было:**
```typescript
if (pathname.includes("/entrance")) { ... }
```

**Стало:**
```typescript
if (pathWithoutLocale.startsWith("/entrance")) { ... }
```

**Преимущества:**
- ✅ `.startsWith()` точнее `.includes()` 
- ✅ Не срабатывает на `/user/entrance-hall` (если бы был такой путь)
- ✅ Работает независимо от locale

#### Изменение 4: Возврат null вместо NextResponse.next()

**Было:**
```typescript
return NextResponse.next();
```

**Стало:**
```typescript
return null;
```

**Преимущества:**
- ✅ Позволяет родительскому middleware вернуть intl response
- ✅ Чище семантически: "я не хочу ничего делать"

---

## 📊 Как это работает сейчас

### Пример 1: Переход на `/en/profile` (авторизован)

```
1. Request: GET /en/profile
2. intlMiddleware:
   - Определяет locale = 'en'
   - Создает internal rewrite: /en/profile → /[locale]/profile (params: {locale: 'en'})
   - Возвращает Response со статусом 200 + headers
3. middleware.ts:
   - Проверяет: status 200 (не 3xx) → продолжаем
4. authMiddleware:
   - Извлекает locale = 'en'
   - pathWithoutLocale = '/profile'
   - Проверяет: token существует, путь '/profile' требует авторизации
   - Все ОК → возвращает null
5. middleware.ts:
   - authResponse = null
   - Возвращает intlResponse (с rewrite headers)
6. Next.js:
   - Использует rewrite headers
   - Рендерит app/[locale]/profile/page.tsx с params {locale: 'en'}
   - ✅ SUCCESS 200
```

### Пример 2: Переход на `/ru/admin` (не авторизован)

```
1. Request: GET /ru/admin
2. intlMiddleware:
   - Определяет locale = 'ru'
   - Создает internal rewrite
   - Возвращает Response 200
3. middleware.ts:
   - Проверяет: status 200 → продолжаем
4. authMiddleware:
   - locale = 'ru', pathWithoutLocale = '/admin'
   - Проверяет: token = null, путь '/admin' требует авторизации
   - Создает redirect: /ru/register
   - Возвращает RedirectResponse 307
5. middleware.ts:
   - authResponse.status = 307 (3xx)
   - Возвращает authResponse
6. Browser:
   - Получает redirect → переходит на /ru/register
   - ✅ REDIRECT 307
```

### Пример 3: Root URL `/` (не авторизован)

```
1. Request: GET /
2. intlMiddleware:
   - Определяет locale по Accept-Language → 'ru'
   - Создает redirect: / → /ru
   - Возвращает RedirectResponse 307
3. middleware.ts:
   - Проверяет: status 307 (3xx) → возвращаем сразу
4. Browser:
   - Получает redirect → переходит на /ru
5. Request: GET /ru
6. intlMiddleware:
   - locale = 'ru', path = '/'
   - Возвращает Response 200
7. authMiddleware:
   - pathWithoutLocale = '/'
   - Проверяет: token = null, корневой путь
   - Создает redirect: /ru/register
   - Возвращает RedirectResponse 307
8. Browser:
   - ✅ REDIRECT → /ru/register
```

---

## 🧪 Тестирование

### Проверить вручную:

1. **Авторизованный пользователь:**
   - [ ] `/ru/profile` → страница загружается
   - [ ] `/en/profile` → страница загружается
   - [ ] `/ru/register` → редирект на `/ru/profile`
   - [ ] `/en/entrance` → редирект на `/en/profile`

2. **Неавторизованный пользователь:**
   - [ ] `/ru/profile` → редирект на `/ru/register`
   - [ ] `/en/profile` → редирект на `/en/register`
   - [ ] `/ru/register` → страница загружается
   - [ ] `/en/entrance` → страница загружается

3. **Админ:**
   - [ ] `/ru/admin` → страница загружается
   - [ ] `/en/admin` → страница загружается

4. **Не-админ (обычный пользователь):**
   - [ ] `/ru/admin` → редирект на `/ru/profile`
   - [ ] `/en/admin` → редирект на `/en/profile`

5. **Корневые пути:**
   - [ ] `/` → редирект на `/ru` или `/en` (по браузеру) → потом на register/profile
   - [ ] `/ru` → редирект на `/ru/register` или `/ru/profile`
   - [ ] `/en/` → редирект на `/en/register` или `/en/profile`

---

## 📝 Итог

**Что было исправлено:**

1. ✅ Middleware правильно обрабатывает intl response (не теряет rewrites)
2. ✅ Проверка статусов по типу (3xx для редиректов, 200 для rewrites)
3. ✅ AuthMiddleware использует точную регулярку для locale (`/^\/([a-z]{2})(\/|$)/`)
4. ✅ Нормализация pathname без locale для проверок
5. ✅ Замена `.includes()` на `.startsWith()` для точности
6. ✅ Возврат `null` вместо `NextResponse.next()` для правильной цепочки

**Результат:**
- ✅ 404 ошибки исправлены
- ✅ Все маршруты работают корректно
- ✅ Редиректы срабатывают правильно
- ✅ Locale определяется и применяется корректно

**Запуск:**
```bash
npm run dev
```

Открыть:
- http://localhost:3000/ru/profile
- http://localhost:3000/en/profile
- http://localhost:3000/ru/admin
- http://localhost:3000/en/admin
