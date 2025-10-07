# Overview

This is an interactive class portfolio website for XI TJKT 1 (Teknik Jaringan Komputer dan Telekomunikasi) with 31 students. The project features a photo album system where all photos are user-uploaded (no static images), with like and comment functionality. The application is fully responsive across all devices and deployment-ready for Railway platform. Students can upload photos to different categories (Kegiatan, Praktikum, Acara, Lainnya) and interact with them through likes and comments.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a modern frontend stack with:
- **HTML5 with Jinja2 templating** for server-side rendering
- **Tailwind CSS** for utility-first styling with custom configuration
- **Three.js** for 3D background animations and visual effects
- **GSAP** for advanced animations and transitions
- **Font Awesome** for iconography

The frontend follows a responsive design pattern with mobile-first approach, featuring:
- Dark/light theme toggle with localStorage persistence
- Interactive floating elements and particle systems
- Smooth scrolling and parallax effects
- Mobile-responsive navigation with hamburger menu

## Backend Architecture
Built on **Flask** web framework with:
- **Route-based architecture** separating main portfolio and gallery views
- **Template rendering** using Jinja2 for dynamic content generation
- **Static file serving** for CSS, JavaScript, and asset management
- **Environment-based configuration** for session management

Key architectural decisions:
- Simple MVC pattern with Flask handling routing and templating
- Gallery data stored as in-memory dictionaries for quick access
- Modular JavaScript organization with separate files for animations and 3D scenes

## Data Management
The application uses:
- **PostgreSQL database** for persistent storage (Students, Photos, Likes, Comments)
- **File system storage** for uploaded photos (static/uploads directory)
- **Database-driven albums** - all album photos come from user uploads, no static images
- **Dynamic student data** - student information updates automatically when database changes

## Styling and Animation System
- **Tailwind CSS** with custom extensions for animations and color schemes
- **Custom CSS** for complex animations like yin-yang loader and floating elements
- **GSAP animation library** for smooth transitions and interactive effects
- **Three.js scene management** for 3D background elements

# External Dependencies

## CDN Services
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome 6.4.0** - Icon library
- **Three.js r128** - 3D graphics library
- **GSAP 3.12.2** - Animation library

## Database & Storage
- **PostgreSQL (Neon)** - Primary database for students, photos, likes, and comments
- **Local file system** - Photo uploads stored in static/uploads directory

## Font Services
- **Google Fonts** - Poppins font family for typography

## Python Dependencies
- **Flask** - Web application framework
- **Flask-SQLAlchemy** - Database ORM
- **Gunicorn** - WSGI HTTP server for production
- **psycopg2-binary** - PostgreSQL adapter
- **SendGrid** - Email service (if needed)

## Browser APIs
- **localStorage** - Theme preference persistence
- **CSS Custom Properties** - Dynamic theming support
- **Intersection Observer** (implied) - Scroll-based animations
- **RequestAnimationFrame** - Smooth animation loops

The architecture prioritizes performance through CDN usage, minimal server-side processing, and client-side caching for theme preferences.