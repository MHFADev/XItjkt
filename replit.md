# Overview

This is a personal portfolio website for M Hilmi (MHFADEV), showcasing professional skills in web development and IT support. The portfolio features a modern, responsive design with dark/light theme support and includes dedicated gallery sections for coding projects and IT support activities. The application presents a comprehensive view of the developer's capabilities through interactive animations, 3D visual effects, and detailed project documentation.

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
- **In-memory data storage** for gallery content (images, titles, descriptions)
- **localStorage** for theme preference persistence
- **Static assets** hosted via external CDNs (Unsplash for images)

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

## Image Hosting
- **Unsplash API** - External image hosting for gallery content

## Font Services
- **Google Fonts** - Poppins font family for typography

## Python Dependencies
- **Flask** - Web application framework
- **Standard library modules** (os, logging) for configuration and debugging

## Browser APIs
- **localStorage** - Theme preference persistence
- **CSS Custom Properties** - Dynamic theming support
- **Intersection Observer** (implied) - Scroll-based animations
- **RequestAnimationFrame** - Smooth animation loops

The architecture prioritizes performance through CDN usage, minimal server-side processing, and client-side caching for theme preferences.