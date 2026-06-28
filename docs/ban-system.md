# Система банов — Архитектура после рефакторинга

## Источник правды

**Redis** (`blacklist:${userId}`) → NextAuth session → клиент

Бан-статус теперь живёт в NextAuth сессии, а не в Zustand store. При каждом обращении к сессии автоматически проверяется Redis.

---

## Архитектура

### Server Side

**authOptions.ts** — session callback
```typescript
async session({ session, token }) {
  if (token.userId && session.user) {
    session.user.id = token.userId;
    session.user.role = token.role;
    
    // Проверяем бан из Redis при каждом getServerSession()
    const banned = await redis.get(`blacklist:${token.userId}`);
    session.user.isBanned = !!banned;
  }
  return session;
}
```

**Server Actions** (createTodo, updateTodo, deleteTodo)
```typescript
const session = await getServerSession(authOptions);

if (session.user.isBanned) {
  return { status: "banned" };
}
```

Больше нет отдельных вызовов `checkUserBan()` — один запрос в Redis внутри session callback.

---

### Client Side

**layout.tsx** — обёртка для всего приложения
```tsx
<SessionProviderWrapper>
  <QueryProvider>{children}</QueryProvider>
  <Redirector />
</SessionProviderWrapper>
```

**Redirector.tsx** — следит за session.user.isBanned
```typescript
const { data: session } = useSession();

useEffect(() => {
  if (session?.user?.isBanned && pathname !== "/banned") {
    router.push("/banned");
  }
}, [session?.user?.isBanned, pathname, router]);
```

**Client hooks** (TodoCard.hook, CreateTodo.hook)
```typescript
const { update } = useSession();

if (result.status === "banned") {
  await update(); // перечитывает сессию с сервера
  // Redirector автоматически увидит isBanned и сделает редирект
}
```

---

## Полный flow

### 1. Админ банит пользователя
```
Admin нажимает "Ban"
  ↓
banUser() → redis.set(`blacklist:${userId}`, "1")
```

### 2. Пользователь пытается создать todo
```
Client: createTodo()
  ↓
Server: getServerSession(authOptions)
  ↓
authOptions → session callback → redis.get(`blacklist:${userId}`)
  ↓
session.user.isBanned = true
  ↓
if (session.user.isBanned) return { status: "banned" }
  ↓
Client: result.status === "banned"
  ↓
await update() // перечитывает сессию
  ↓
useSession обновляется → session.user.isBanned = true
  ↓
Redirector видит изменение
  ↓
router.push("/banned")
```

### 3. Пользователь перезагружает страницу
```
Next.js SSR → getServerSession()
  ↓
session callback → redis.get(`blacklist:${userId}`)
  ↓
session.user.isBanned = true
  ↓
Client получает сессию с isBanned = true
  ↓
Redirector сразу редиректит на /banned
```

---

## Преимущества нового подхода

| Аспект | Zustand (старое) | NextAuth (новое) |
|--------|------------------|------------------|
| **Source of truth** | Client memory | Server (Redis) |
| **Синхронизация** | Ручная (setBanned в каждом хуке) | Автоматическая |
| **Дублирование запросов** | Да (checkUserBan в каждом action) | Нет (1 раз в session callback) |
| **При reload страницы** | Теряется | Сохраняется |
| **Консистентность** | Может рассинхрониться | Всегда актуальна |

---

## Ключевые файлы

### Изменены
- `authOptions.ts` — добавлен Redis check в session callback
- `next-auth.d.ts` — добавлен `isBanned: boolean` в тип Session
- `createTodo.ts`, `updateTodo.ts`, `deleteTodo.ts` — заменён checkUserBan на session.user.isBanned
- `Redirector.tsx` — заменён Zustand на useSession
- `TodoCard.hook.ts`, `CreateTodo.hook.ts` — заменён setBanned на update()
- `layout.tsx` — добавлен SessionProviderWrapper

### Созданы
- `SessionProviderWrapper.tsx` — client boundary для SessionProvider

### Удалены
- `useSessionStore.ts` — больше не нужен
- `checkBan.ts` — больше не используется

---

## Зачем нужен SessionProviderWrapper?

Next.js App Router: все компоненты по умолчанию — Server Components.

`SessionProvider` из `next-auth/react` — клиентский компонент (использует React Context).

Нельзя использовать клиентский компонент напрямую в серверном:
```tsx
// ❌ Ошибка: React Context is unavailable in Server Components
export default function RootLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Решение — создать тонкую клиентскую обёртку:
```tsx
// ✅ SessionProviderWrapper.tsx
"use client";
export function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Теперь layout остаётся серверным, но может использовать клиентский провайдер через boundary.

---

## Метод update() из useSession

`update()` — принудительно перечитывает сессию с сервера:

1. Делает fetch к `/api/auth/session`
2. Сервер вызывает session callback
3. session callback проверяет Redis
4. Возвращает свежую сессию с актуальным `isBanned`
5. `useSession` обновляется → компоненты ререндерятся

**Зачем нужен?** Клиентская сессия кэшируется. После server action сессия не обновляется автоматически. Без `update()` Redirector не узнает о бане до следующей перезагрузки страницы.

---

## Чеклист для добавления нового protected action

1. ✅ Проверить сессию: `const session = await getServerSession(authOptions)`
2. ✅ Проверить бан: `if (session.user.isBanned) return { status: "banned" }`
3. ✅ В клиентском хуке: вызвать `await update()` если `result.status === "banned"`

Больше ничего! Redirector сработает автоматически.
