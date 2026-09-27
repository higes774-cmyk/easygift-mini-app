# EasyGift Mini App — Инструкция по запуску и деплою

## 🚀 Быстрый старт (локально)

```bash
# 1. Перейди в папку проекта
cd easygift-mini-app

# 2. Установи зависимости
npm install

# 3. Запусти dev-сервер
npm run dev
```

Приложение будет доступно на http://localhost:3000

---

## ☁️ Деплой на Vercel (бесплатно, рекомендуется)

### Способ 1: Через GitHub (самый простой)

1. **Создай репозиторий на GitHub**
   - Зайди на https://github.com/new
   - Назови репозиторий (например, `easygift-mini-app`)
   - Залей код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_НИК/easygift-mini-app.git
   git push -u origin main
   ```

2. **Импортируй в Vercel**
   - Зайди на https://vercel.com
   - Нажми "Add New" → "Project"
   - Выбери свой репозиторий из GitHub
   - Vercel автоматически определит Next.js
   - Нажми "Deploy"

3. **Готово!** Vercel выдаст URL вида `https://easygift-mini-app.vercel.app`

### Способ 2: Через Vercel CLI

```bash
# Установи Vercel CLI
npm i -g vercel

# Залей проект
vercel

# Следуй инструкциям в терминале
```

---

## 🗄️ Деплой на Supabase

### Что даёт Supabase:
- **Supabase Storage** — для хранения изображений/файлов
- **Supabase Database** — PostgreSQL база данных
- **Supabase Edge Functions** — серверный код

### Шаг 1: Создай проект на Supabase

1. Зайди на https://supabase.com
2. Нажми "New Project"
3. Заполни:
   - Name: `easygift-mini-app`
   - Database Password: (придумай надёжный пароль)
   - Region: выбери ближайший
4. Нажми "Create new project" (подождите ~2 минуты)

### Шаг 2: Создай таблицу для данных

В Supabase Dashboard:
1. Открой **Table Editor** (слева)
2. Нажми **Create a new table**
3. Заполни:
   - Name: `cards`
   - Columns:
     - `id` — uuid, primary key, default: `gen_random_uuid()`
     - `user_id` — bigint, not null
     - `title` — text, not null
     - `amount` — integer, not null
     - `cashback` — integer, not null
     - `created_at` — timestamptz, default: `now()`
4. Нажми **Save**

### Шаг 3: Включи Row Level Security (RLS)

В SQL Editor выполни:

```sql
-- Включаем RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Политика: пользователь видит только свои записи
CREATE POLICY "Users can view own cards"
ON cards FOR SELECT
USING (true); -- Для простоты — все видят все (демо режим)

CREATE POLICY "Users can insert own cards"
ON cards FOR INSERT
WITH CHECK (true); -- Для простоты — все могут вставлять
```

### Шаг 4: Подключи Supabase к проекту

1. В Supabase Dashboard зайди в **Project Settings** → **API**
2. Скопируй:
   - `Project URL` (например, `https://xyzcompany.supabase.co`)
   - `anon public` ключ

3. Создай файл `.env.local` в папке `easygift-mini-app`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_anon_ключ
```

### Шаг 5: Установи Supabase JS и используй в коде

```bash
npm install @supabase/supabase-js
```

Пример использования:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Вставка открытки
const { data, error } = await supabase
  .from('cards')
  .insert({
    user_id: telegramUserId,
    title: 'С Днём Рождения!',
    amount: 1000,
    cashback: 100
  });
```

---

## 🤖 Привязка к Telegram-боту

1. **Создай бота у @BotFather**
   - Открой @BotFather в Telegram
   - Отправь `/newbot`
   - Следуй инструкциям
   - Скопируй токен

2. **Создай Mini App у @BotFather**
   - Отправь `/newapp`
   - Выбери своего бота
   - Введи название: `EasyGift`
   - Введи URL: твой Vercel URL (`https://easygift-mini-app.vercel.app`)

3. **Готово!** Теперь бот может запускать Mini App по кнопке.

---

## 📱 Как протестировать Mini App без бота

1. Разверни приложение на Vercel
2. Открой URL в любом браузере
3. Приложение будет работать в демо-режиме (данные хранятся в памяти)

---

## 🔧 Структура проекта

```
easygift-mini-app/
├── app/
│   ├── globals.css    — Стили
│   ├── layout.tsx     — Корневой layout
│   └── page.tsx       — Главная страница
├── .env.local         — Переменные окружения (не коммитить!)
├── next.config.mjs    — Конфиг Next.js
├── package.json
└── tsconfig.json
```

---

## ⚠️ Важные замечания

1. **Не коммить `.env.local`** — добавь его в `.gitignore`
2. **Для продакшена** настрой  proper RLS политики в Supabase
3. **Telegram WebApp** работает только в клиенте Telegram (iOS/Android/Desktop)
4. **Vercel** — самый простой способ деплоя для Next.js
5. **Supabase** используй для хранения данных, не для хостинга фронтенда
