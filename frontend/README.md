# GiantyLive CMS Frontend

Content Management System cho GiantyLive được xây dựng với Next.js 15 App Router.

## Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   └── ui/                # Shadcn UI components
│       └── button.tsx     # Button component
├── hooks/                  # Custom React hooks
│   └── use-local-storage.ts
├── lib/                    # Utility libraries
│   └── utils.ts           # Common utilities
├── types/                  # TypeScript type definitions
│   └── index.ts
└── utils/                  # Utility functions
    └── api.ts             # API utilities
```

## Công nghệ sử dụng

- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở [http://localhost:3000](http://localhost:3000) trong browser.

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra code style
- `npm run type-check` - Kiểm tra TypeScript

## Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
```

## Cấu trúc Components

### UI Components
- Sử dụng Shadcn UI pattern
- Tất cả components trong `src/components/ui/`
- Export named components

### Layout
- Root layout trong `src/app/layout.tsx`
- Sử dụng Inter font
- Responsive design với Tailwind

### Styling
- Tailwind CSS với custom CSS variables
- Dark mode support
- Mobile-first approach

## Best Practices

- Sử dụng Server Components khi có thể
- Minimize `use client` directives
- TypeScript cho tất cả code
- Functional components với hooks
- Responsive design
- Performance optimization 