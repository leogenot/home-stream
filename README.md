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
