FROM php:8.2-cli

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# 2. Install Node.js (Required for Vite and React)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# 3. Install PHP extensions needed for Laravel and TiDB
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 4. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Set working directory
WORKDIR /app

# 6. Copy all project files into the container
COPY . .

# 7. Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# 8. Install Node dependencies and compile React frontend
RUN npm install
RUN npm run build

# 9. Start the Laravel server using Render's automatic PORT
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}