# Lighthouse Christian Assembly Website

A modern, responsive church website built with Next.js, React, TypeScript, Tailwind CSS, and Prisma.

## Features

- 📖 **Sermon Management** - Upload, display, and manage sermons with YouTube integration
- 📅 **Event Management** - Create and manage church events and activities
- 🏕️ **Camp Registration** - Online registration form for youth summer camp
- ⚙️ **Admin Dashboard** - Secure admin panel for managing content
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS with custom theming
- 📊 **Data Export** - Export camp registrations as CSV

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS 3, PostCSS
- **Database**: Prisma ORM with SQLite
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Hooks

## Project Structure

```
lca/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── about/page.tsx          # About page
│   ├── sermons/                # Sermon pages
│   ├── events/                 # Event pages
│   ├── camp/page.tsx           # Camp registration
│   ├── contact/page.tsx        # Contact page
│   ├── admin/                  # Admin panel
│   └── api/                    # API endpoints
├── components/
│   └── Navbar.tsx              # Navigation component
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── prisma.ts               # Prisma client
│   └── validators.ts           # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
└── public/
    └── uploads/                # Uploaded images
```

## Installation

## Prerequisites

- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone and setup**
```bash
cd lca
npm install
```

2. **Environment Setup**
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your configuration
```

3. **Database Setup**
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

4. **Start Development Server**
```bash
npm run dev
```

Visit http://localhost:3000 to see your site!

## Usage

### Public Pages

- **Home** (`/`) - Welcome page with latest sermons and upcoming events
- **About** (`/about`) - Church information and leadership
- **Sermons** (`/sermons`) - Browse all sermons with YouTube integration
- **Events** (`/events`) - View upcoming church events
- **Camp** (`/camp`) - Register for youth summer camp
- **Contact** (`/contact`) - Contact form and location information

### Admin Panel

1. Go to `/admin` and enter the admin password (default: `admin`)
2. Access the dashboard at `/admin/dashboard`
3. **Manage Sermons**: Create, view, and delete sermons
4. **Manage Events**: Create, view, and delete events
5. **View Registrations**: See all camp registrations and export as CSV

## API Endpoints

### Public Endpoints

- `GET /api/sermons` - List all sermons
- `GET /api/sermons/[id]` - Get specific sermon
- `GET /api/events` - List all events
- `GET /api/events/[id]` - Get specific event
- `GET /api/camp-registrations/export` - Export registrations as CSV
- `POST /api/camp-registrations` - Submit camp registration

### Admin Endpoints

- `POST /api/sermons` - Create sermon
- `PUT /api/sermons/[id]` - Update sermon
- `DELETE /api/sermons/[id]` - Delete sermon
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `PUT /api/camp-registrations/[id]` - Update registration status
- `POST /api/admin-login` - Admin authentication
- `POST /api/admin-logout` - Logout
- `GET /api/admin-check` - Verify admin session

## Database Schema

The application uses Prisma ORM with SQLite. Key models:

### Sermon
- `id`: Auto-incremented ID
- `title`: Sermon title
- `preacher`: Preacher name
- `date`: Sermon date/time
- `description`: Full description
- `youtubeUrl`: YouTube video URL
- `coverImageUrl`: Cover image URL
- `createdAt`, `updatedAt`: Timestamps

### Event
- `id`: Auto-incremented ID
- `title`: Event title
- `date`: Event date/time
- `location`: Event location
- `description`: Event description
- `posterImageUrl`: Poster image URL
- `createdAt`, `updatedAt`: Timestamps

### CampRegistration
- `id`: Auto-incremented ID
- `fullName`: Registrant name
- `facebookUrl`: Facebook profile URL
- `contactNumber`: Phone number
- `emergencyContactNumber`: Emergency contact
- `invitedBy`: Who invited them (optional)
- `amountPaid`: Registration fee amount
- `screenshotSentEmail`: Payment confirmation
- `status`: Registration status (Pending/Confirmed/Cancelled)
- `createdAt`, `updatedAt`: Timestamps

## Configuration

Edit these files to customize:

- **Colors/Theme**: `tailwind.config.ts`
- **Database**: `prisma/schema.prisma`
- **Metadata**: `app/layout.tsx`
- **Admin Password**: Set `ADMIN_PASSWORD` in `.env.local`

## Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run linting
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Prisma Studio GUI
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables (Production)

- `DATABASE_URL` - Your production database URL
- `ADMIN_PASSWORD` - Strong admin password
- `ADMIN_SECRET` - Random secret key (use `openssl rand -base64 32`)
- `NODE_ENV` - Set to "production"

## Features in Detail

### Sermon Management

- Upload sermons with title, preacher, date, and description
- Embed YouTube videos directly
- Add cover images for visual appeal
- Automatically sorted by date (newest first)
- Full sermon pages with embedded video players

### Event Management

- Create events with date, time, and location
- Add event posters
- View upcoming and past events
- Detailed event pages

### Camp Registration

- Online registration form with validation
- Track payment status
- Export all registrations to CSV for reporting
- Email notifications (ready for integration)

### Admin Security

- Session-based authentication
- Secure password verification
- 24-hour session expiration
- CSRF protection with secure cookies

## Troubleshooting

### Database Issues

```bash
# Reset database
rm dev.db
npm run db:migrate
npm run db:seed
```

### Port Already in Use

```bash
# Change port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear build cache
rm -rf .next
npm run build
```

## Contributing

To add new features:

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - Feel free to use this project for your church.

## Support

For issues, questions, or suggestions:
- Email: support@lca.church
- Phone: (123) 456-7890

---

**Built with ❤️ for Lighthouse Christian Assembly**
