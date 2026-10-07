export const business = {
  name: 'TATTOOSPACE',
  city: 'Mannheim',
  address: ['Jungbuschstraße 8 · 1st floor', '68159 Mannheim · Germany'],
  email: 'info@tattoo-space.de',
  whatsappDisplay: '+49 151 75319624',
  phoneDisplay: '+49 176 61262422',
  bookingUrl: 'https://tattoo-space.de/wp-booking-calendar/',
  whatsappUrl: 'https://wa.me/4915175319624',
  mapsUrl:
    'https://www.google.com/maps/place/Space+Tattoo+Mannheim/@49.4808683,8.4719724,13.32z/data=!4m6!3m5!1s0x4797cf65b92a3137:0xcdf50896ea500cff!8m2!3d49.4769061!4d8.4849573!16s%2Fg%2F11rp34mzc6',
  instagramUrl: 'https://www.instagram.com/tattoospace_mannheim/',
  openingHours: 'Mon–Sat · 11:00–20:00',
} as const

export type RateGroup = 'sessions' | 'days' | 'stays'

export const rates = {
  sessions: [
    { duration: '3H', price: '€90' },
    { duration: '6H', price: '€150', featured: true },
    { duration: '9H', price: '€200' },
  ],
  days: [
    { duration: '3 DAYS', durationDe: '3 TAGE', price: '€500', featured: true },
    { duration: '6 DAYS', durationDe: '6 TAGE', price: '€900' },
  ],
  stays: [
    { duration: '2 WEEKS', durationDe: '2 WOCHEN', price: '€1,600' },
    { duration: '1 MONTH', durationDe: '1 MONAT', price: '€2,500', featured: true },
  ],
} satisfies Record<RateGroup, Array<{ duration: string; durationDe?: string; price: string; featured?: boolean }>>

export const equipment = {
  hygiene: ['Skin, hand & surface disinfectant', 'Nitrile gloves S–XL', 'Second Skin & Dry Lock pads', 'Sharps waste bin'],
  workspace: ['Tattoo bed, armrest & pillows', 'Workstation with drawers', 'Work light & head lamp', 'Privacy folding screen'],
  consumables: ['Stencil paper & two A4 printers', 'Ink cups S–XL', 'Green soap & squeeze bottle', 'Workstation covers & paper rolls'],
  comfort: ['Client seating', 'Coffee, drinks & snacks', 'Free WiFi & adjustable music', 'Kitchen, bar, shower & WC'],
  creative: ['Drawing & light tables', 'Apple Mac computer', 'Black-and-white laser printer', 'Professional photo corner'],
} as const

export const reviews = [
  {
    quote: 'Great place, great staff. I made a huge tattoo with Ari over a number of sessions. Always good vibes and many treats.',
    author: 'Buryat Sky',
  },
  {
    quote: 'A very pleasant atmosphere. The concept of creating a space for guest tattoo artists is fantastic.',
    author: 'Chris U.',
  },
  {
    quote: 'Super great studio with really cool tattoo artists and fair prices. I’d love to come back.',
    author: 'Camilla Müller',
  },
] as const

export const images = {
  studio: 'https://tattooizm.ink/images/studio-interior.jpg',
  artist: 'https://tattooizm.ink/images/about.webp',
  tattoo: 'https://tattooizm.ink/images/portfolio/001.webp',
  panorama: 'https://tattoo-space.de/wp-content/uploads/2026/04/67b5c0bfd7b5c081d3cffc8d_360.webp',
} as const
