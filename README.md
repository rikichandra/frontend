# Admin Dashboard Frontend

Sebuah aplikasi admin dashboard modern yang dibangun dengan Next.js untuk mengelola produk, kategori, transaksi, dan admin. Aplikasi ini menyediakan interface yang user-friendly untuk sistem manajemen dengan fitur autentikasi yang lengkap.

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.4 dengan App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Tabler Icons + Lucide React
- **Charts:** Recharts
- **Notifications:** Sonner
- **Form Validation:** Zod
- **Data Tables:** TanStack Table

## 📁 Struktur Project

```
frontend-test/
├── app/                          # App Router pages
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx           # Auth layout
│   │   ├── login/               # Login page
│   │   └── register/            # Register page
│   ├── dashboard/               # Dashboard pages
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── admins/             # Admin management
│   │   ├── categories/         # Category management
│   │   ├── products/           # Product management
│   │   ├── settings/           # Settings page
│   │   └── transactions/       # Transaction management
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (redirect)
├── components/                   # React components
│   ├── ui/                     # UI primitives (shadcn/ui)
│   ├── forms/                  # Form components
│   ├── layout/                 # Layout components
│   ├── tables/                 # Table components
│   ├── AuthProvider.tsx        # Auth context provider
│   ├── AuthGuard.tsx          # Route protection
│   └── app-sidebar.tsx        # Main sidebar
├── hooks/                       # Custom React hooks
├── lib/                        # Utility libraries
├── services/                   # API service layers
├── store/                      # Zustand stores
├── types/                      # TypeScript type definitions
└── public/                     # Static assets
```

## 🔐 Fitur Autentikasi

### Login & Register
- Halaman login dan register dengan validasi form
- JWT token management dengan refresh token
- Persistent authentication state
- Route protection dengan middleware
- Automatic token refresh

### Route Protection
- **Public Routes:** `/login`, `/register`
- **Protected Routes:** `/dashboard/*`
- **Auth Guard:** Komponen untuk melindungi routes
- **Middleware:** Server-side route protection

## 📊 Fitur Dashboard

### 1. Dashboard Overview
- **Cards Section:** Statistik ringkasan
- **Interactive Charts:** Visualisasi data dengan Recharts
- **Data Tables:** Tabel data interaktif

### 2. Product Management
- CRUD operations untuk produk
- Form validation dengan Zod
- Search dan filtering
- Pagination
- Data table dengan sorting

### 3. Category Management
- Manajemen kategori produk
- Hierarchical categories support
- Bulk operations
- Export/Import functionality

### 4. Transaction Management
- View dan manage transaksi
- Transaction status tracking
- Date range filtering
- Export reports

### 5. Admin Management
- User management untuk admin
- Role-based permissions
- Admin status management
- Activity tracking

### 6. Settings
- Profile management
- System settings
- Theme preferences

## 🎨 UI/UX Features

### Design System
- **Consistent Design:** Menggunakan shadcn/ui components
- **Responsive:** Mobile-first approach
- **Dark/Light Mode:** Theme switching support
- **Accessible:** ARIA compliant components

### Navigation
- **Collapsible Sidebar:** Space-efficient navigation
- **Breadcrumbs:** Clear navigation hierarchy
- **Search:** Global search functionality

### Data Presentation
- **Data Tables:** Sortable, filterable, paginated tables
- **Charts:** Interactive charts dan graphs
- **Cards:** Information cards dengan actions
- **Modals:** Dialog untuk forms dan confirmations

## 🛠 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm/bun

### Installation

1. **Clone repository:**
```bash
git clone <repository-url>
cd frontend-test
```

2. **Install dependencies:**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env.local
```

4. **Run development server:**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

5. **Open browser:**
```
http://localhost:3000
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server dengan Turbopack
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Run ESLint

# Build optimizations
npm run build --turbopack  # Build dengan Turbopack (faster)
```

## 🔧 Configuration

### Next.js Configuration
- **Turbopack:** Enabled untuk faster builds
- **TypeScript:** Strict mode enabled
- **App Router:** Next.js 13+ app directory

### ESLint Configuration
- **Next.js Rules:** Menggunakan `eslint-config-next`
- **TypeScript Rules:** Type checking enabled

### Tailwind Configuration
- **Version 4:** Latest Tailwind CSS
- **Custom Components:** Extended dengan shadcn/ui
- **Responsive Design:** Mobile-first utilities

## 🌐 API Integration

### Service Layer
```typescript
// Example API service
export const productService = {
  getProducts: (filters?: ProductFilters) => Promise<PaginatedResponse<Product>>,
  createProduct: (data: CreateProductInput) => Promise<ApiResponse<Product>>,
  updateProduct: (id: string, data: UpdateProductInput) => Promise<ApiResponse<Product>>,
  deleteProduct: (id: string) => Promise<ApiResponse<null>>
};
```

### API Endpoints
- **Auth:** `/auth/login`, `/auth/register`, `/auth/refresh`
- **Products:** `/produks`
- **Categories:** `/kategori-produks`
- **Transactions:** `/transaksis`
- **Admins:** `/admins`
- **Profile:** `/user/profile`

## 📱 State Management

### Zustand Stores
```typescript
// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

### Persistent State
- **Local Storage:** Auth state persistence
- **Session Management:** Automatic cleanup
- **Hydration:** SSR-safe state rehydration

## 🎯 Best Practices

### Code Organization
- **Feature-based Structure:** Components organized by feature
- **Separation of Concerns:** Clear separation antara UI, logic, dan data
- **Type Safety:** Comprehensive TypeScript usage
- **Reusable Components:** Modular dan reusable UI components

### Performance
- **Code Splitting:** Automatic dengan Next.js
- **Image Optimization:** Next.js Image component
- **Bundle Analysis:** Tree shaking dan optimization
- **Caching:** HTTP caching dengan proper headers

### Security
- **JWT Tokens:** Secure token management
- **Route Protection:** Client dan server-side protection
- **Input Validation:** Zod schema validation
- **XSS Protection:** Sanitized inputs

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke Git repository
2. Connect ke Vercel
3. Deploy otomatis dengan setiap push

### Manual Deployment
```bash
npm run build
npm run start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://app.example.com
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Untuk pertanyaan atau dukungan:
- Email: [your-email@example.com]
- Issues: [GitHub Issues](link-to-issues)
- Documentation: [Wiki/Docs](link-to-docs)
