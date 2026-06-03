FROM php:8.2-apache

# Habilitar mod_rewrite de Apache (útil para URLs limpias y APIs)
RUN a2enmod rewrite

# Instalar y habilitar las extensiones de PDO y MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Damos permisos al directorio de trabajo
RUN chown -R www-data:www-data /var/www/html