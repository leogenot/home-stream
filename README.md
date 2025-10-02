# 🎶 Home Stream

Turn your old computer into a self-hosted music streaming server!  
With **Home Stream**, you can build and run a Nuxt app on your machine, expose it to the internet, and enjoy your music library anywhere.

---

## 🚀 Features

- 🎧 Stream your music from any device (desktop, tablet, phone)
- 🌐 Access your music library from anywhere with an internet connection
- 💻 Recycle old hardware into a personal streaming server
- 🪶 Powered by [Nuxt](https://nuxt.com/) frontend

---

## 🛠️ Full Setup Guide

This guide assumes you’re setting up on **macOS**, but it also works on Linux/Windows with some adjustments.

### 1. Prepare Your Old Computer

- Install a fresh OS (recommended for simplicity).
- Make sure it’s connected to your router (Ethernet preferred for stability).

### 2: Install [Homebrew](https://brew.sh) for Mac packages

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3: Install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

### 4: Install Git

```bash
brew install git
```

### 5: Install PNPM package manager

```bash
npm install -g pnpm@latest-10
```

### 6: Install Certbot for SSL certificates

```bash
brew install certbot
```

### 7: Clone the repo

```bash
git clone https://github.com/leogenot/home-stream.git
```

### 8: Install project node_modules

```bash
cd home-stream
```

```bash
pnpm install
```

### 9. Import SQL database into Supabase

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.music (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title text,
  user_id uuid,
  artist text,
  album text,
  cover text,
  file text UNIQUE,
  CONSTRAINT music_pkey PRIMARY KEY (id),
  CONSTRAINT music_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.music_playlist_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  playlist_id bigint NOT NULL,
  music_id bigint,
  position integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT music_playlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT playlist_items_music_id_fkey FOREIGN KEY (music_id) REFERENCES public.music(id),
  CONSTRAINT music_playlist_items_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.music_playlists(id)
);
CREATE TABLE public.music_playlists (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT music_playlists_pkey PRIMARY KEY (id),
  CONSTRAINT playlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_details (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  auth_user_id uuid NOT NULL,
  favorite_music_id bigint,
  favorite_movie_id bigint,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  favorite_music_uuid uuid,
  favorite_movie_uuid uuid,
  username text UNIQUE,
  CONSTRAINT user_details_pkey PRIMARY KEY (id),
  CONSTRAINT user_details_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id),
  CONSTRAINT user_details_favorite_music_id_fkey FOREIGN KEY (favorite_music_id) REFERENCES public.music(id)
);
```

### 10. Add Supabase Auth

### 11. Set the right .env variables values

```env
BASE_URL=https://mymusicserver.com
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_KEY=
SUPABASE_ANON_KEY=
```

## 🌍 Exposing Home Stream with Nginx (Port 80/443)

Instead of exposing port `3000` directly, you can run your Nuxt app behind **Nginx**, which will:

- Serve the app at standard ports **80 (HTTP)** and **443 (HTTPS)**
- Handle SSL certificates via **Let’s Encrypt**
- Improve security and stability

---

### Register domain name

You can use your prefered way of registering a domain name or you can use
[Noip](https://www.noip.com/) to get a free domain name for personal use.

### 1. Install Nginx

```bash
brew install nginx
```

### 2. Configure Nginx as a Reverse Proxy

Create a new server block:

```bash
sudo nano /etc/nginx/sites-available/home-stream
```

```nginx
server {
    listen 80;
    server_name mymusicserver.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /_nuxt/ {
        root home-stream/.output/public;
    }

    location /public/ {
        root home-stream/.output/public;
    }


    location /uploads/ {
        alias home-stream/public/uploads/;
        autoindex on;
    }
}
```

Enable the config:

```bash
sudo ln -s /etc/nginx/sites-available/home-stream /etc/nginx/sites-enabled/
```

```bash
sudo nginx -t
```

```bash
sudo systemctl reload nginx
```

### 3. Add SSL

```bash
sudo certbot --nginx -d mymusicserver.com -d www.mymusicserver.com
```

Reload the config:

```bash
sudo nginx -t
```

```bash
sudo systemctl reload nginx
```

### 4. Install PM2 for automatic run of the project:

```bash
npm install pm2 -g
```

### 5. Set PM2

```bash
# Ensure old process is removed
pm2 delete home-stream || true
```

```bash
pm2 start .output/server/index.mjs --name "home-stream"
```

```bash
# Save PM2 process so it persists after a reboot
pm2 save
```
