# App Templates

Complete, production-ready applications that compose primitives (components, features, scaffolds) into full-stack solutions.

## Architecture

Apps follow a manifest-driven approach where a single JSON file declares:
- Base template (spa, ssr, etc.)
- Scaffolds to include (auth, payments, etc.)
- Features to generate (analytics, users, settings)
- Components to include (data-table, charts, stat-cards)
- Routes and navigation structure
- Mock data specifications

## Available Apps

### Dashboard
Admin dashboard with user management, analytics, and settings.

```bash
npm run init:app dashboard my-admin-panel
```

**Includes:**
- Authentication (login/signup)
- User management (CRUD)
- Analytics page with charts
- Settings page
- Protected routes

**Components:**
- StatCard - Display metrics with trends
- DataTable - Sortable/filterable tables
- Chart - Simple visualizations

---

# The Most Common SPA App Use Cases

## 1. Dashboards & Admin Panels

- Data visualization (charts, graphs, tables)
- User/role management
- Analytics and KPIs
- CRUD operations on entities (users, products, tasks)

## 2. Project Management & Productivity Tools

- Kanban boards (like Trello, Jira)
- Task lists and to-do apps
- Calendar and scheduling
- Real-time collaboration features

## 3. E-commerce Applications

- Product listings with filters/search
- Shopping cart & checkout flows
- Payment integrations
- User profiles and order history

## 4. Social Platforms & Communities

- User profiles & feeds
- Likes, comments, follows
- Messaging and notifications
- Content creation (posts, media uploads)

## 5. SaaS Applications

- Subscription management
- Multi-tenant user handling
- Integrations with external APIs
- Usage analytics & billing dashboards

## 6. Content Management Systems (CMS) & Blogs

- Rich text editing
- Media library management
- Role-based publishing
- SEO optimization features

## 7. Learning Management Systems (LMS) & Education

- Courses, lessons, quizzes
- Progress tracking
- Video and interactive content
- Certificates and achievements

## 8. Financial & Fintech Apps

- Transaction history
- Expense tracking
- Charts for income/spending
- Account linking and security

## 9. Health & Fitness Apps

- Workout tracking
- Nutrition logging
- Wearable integrations
- Progress dashboards

## 10. Communication Tools

- Real-time chat & video calls
- Email-like experiences
- Notifications
- File sharing and collaboration

## 11. Marketplaces & Listings

- Product/service listings
- Search, filters, sorting
- Booking/reservations
- Reviews and ratings

## 12. Developer Tools & Platforms

- API explorers
- Code editors in-browser
- CI/CD dashboards
- Monitoring tools

## 13. Customer Support & Helpdesks

- Ticketing systems
- Knowledge bases
- Chatbots
- Customer communication channels

## 14. Entertainment & Media

- Streaming platforms
- Interactive games
- Media libraries
- Personalized recommendations
