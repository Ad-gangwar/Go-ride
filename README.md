# GoRide - Taxi & Rideshare Platform

GoRide is a modern, responsive web application for booking and sharing taxi rides. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS, it offers an intuitive platform for users to book rides quickly and conveniently. The application features dark/light mode, responsive design, and optimized performance.

## Table of Contents

- [GoRide - Taxi \& Rideshare Platform](#goride---taxi--rideshare-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
    - [Key Files \& Directories](#key-files--directories)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Technical Details](#technical-details)
  - [Recent Improvements](#recent-improvements)
  - [Deployment](#deployment)
  - [Preview](#preview)

## Features

- **Modern UI**: Clean, professional design with intuitive user experience
- **Responsive Layout**: Fully responsive across all devices (mobile, tablet, desktop)
- **Dark/Light Mode**: Theme toggle with persistent user preference
- **User Authentication**: Login/register system with secure client-side session management
- **Interactive Maps**: Dynamic map interface for selecting pickup and destination points
- **Ride History**: Track previous rides with detailed information and rating system
- **Car Selection**: Multiple vehicle options with pricing information
- **Profile Management**: User profile customization

## Project Structure

The project follows a modular structure, with separate directories for components, pages, contexts, and utilities.

```
📁 app
├── 📁 booking
│   └── page.tsx
├── 📁 login
│   └── page.tsx
├── 📁 profile
│   └── page.tsx
├── 📁 register
│   └── page.tsx
├── 📁 ride-history
│   └── page.tsx
├── error-boundary.tsx
├── globals.css
├── layout.tsx
└── page.tsx
📁 components
├── 📁 Booking
│   ├── autocomplete-address.tsx
│   ├── booking.tsx
│   ├── cars.tsx
│   ├── payment-cards.tsx
│   └── ride-type-selector.tsx
├── 📁 Map
│   └── google-map.tsx
├── footer.tsx
├── nav-bar.tsx
└── theme-toggle.tsx
📁 context
├── auth-context.tsx
├── directions-data-context.tsx
├── google-maps-context.tsx
├── selected-car-amount-context.tsx
└── theme-context.tsx
📁 public
├── Images (1.png, 2.png, etc.)
├── favicon.ico
└── taxi-go.gif
middleware.ts
next.config.js
package.json
tailwind.config.js
tsconfig.json
```

### Key Files & Directories

- **app**: Contains all the page components and layouts using Next.js App Router
- **components**: Reusable UI components organized by feature
- **context**: React context providers for state management
- **public**: Static assets including images
- **middleware.ts**: Handles authentication and routing protection
- **tailwind.config.js**: Styling configuration with custom themes

## Getting Started

### Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** for package management

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/goride.git
   cd goride
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Usage

1. **Homepage**: View marketing information and quick access to booking
2. **Ride Booking**: Navigate to the booking page to select pickup and drop-off locations
3. **Car Selection**: Choose from different car types with respective pricing
4. **User Authentication**: Register or log in to access protected features
5. **Ride History**: View past rides, with options to filter and sort
6. **Profile Management**: Update user information and preferences

## Technical Details

- **Next.js App Router**: Modern routing and layout system
- **TypeScript**: Type-safe code for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Context API**: State management across components
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Client-side Authentication**: Secure user authentication with token storage
- **Mock API Integration**: Simulates backend services for development

## Recent Improvements

- **Enhanced UI**: Updated design with consistent spacing and visual hierarchy
- **Font Size Optimization**: Standardized font sizes for better readability across devices
- **Layout Consistency**: Fixed container widths and layout issues in production
- **Responsive Tables**: Improved handling of data tables on smaller screens
- **Dark Mode Refinements**: Better color contrast and component styling in dark mode
- **Performance Optimizations**: Reduced component size and improved load times
- **UI Accessibility**: Improved color contrast and focus states

## Deployment

The app is configured for easy deployment on Vercel:

1. Push your repository to GitHub
2. Connect your Vercel account to your GitHub repository
3. Deploy with one click through the Vercel dashboard

Alternatively, build the app for production:

```bash
npm run build
npm start
```

## Preview

![GoRide Preview](./public/taxi-go.gif)

---

Created by Aditya Gangwar
