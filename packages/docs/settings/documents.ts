import { type Paths } from '@/lib/pageroutes'

export const Documents: Paths[] = [
  {
    heading: 'Overview',
    title: 'Overview',
    href: '',
    noLink: true,
    items: [
      { title: 'Introduction & Architecture', href: '' },
      { title: 'Getting Started', href: '/getting-started' },
    ],
  },
  { spacer: true },
  {
    heading: 'Protocol Specification',
    title: 'Protocol Specification',
    href: '/spec',
    noLink: true,
    items: [
      { title: 'Framing & Stream Handling', href: '/framing' },
      { title: 'Value Types & Encodings', href: '/data-types' },
      { title: 'Packet Types Catalog', href: '/packets' },
      { title: 'Lifecycle & State Machine', href: '/lifecycle' },
      { title: 'Error Codes & Handling', href: '/errors' },
    ],
  },
  { spacer: true },
  {
    heading: 'Wire Examples',
    title: 'Wire Examples',
    href: '/examples',
    noLink: true,
    items: [
      { title: 'Wire Frames & Hex Dumps', href: '/wire-frames' },
      { title: 'End-to-End Session Trace', href: '/session-trace' },
    ],
  },
  { spacer: true },
  {
    heading: 'Implementation',
    title: 'Implementation',
    href: '/implementation',
    noLink: true,
    items: [
      { title: 'Embedded C Guide', href: '/embedded-c' },
      { title: 'Conformance Checklist', href: '/conformance' },
    ],
  },
  { spacer: true },
  {
    heading: 'Performance',
    title: 'Performance',
    href: '/benchmarks',
    noLink: true,
    items: [
      { title: 'Capacity & Benchmarks', href: '/results' },
    ],
  },
]
