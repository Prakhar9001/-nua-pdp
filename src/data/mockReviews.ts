import type { Review } from '../types';

export const mockReviews: Review[] = [
  {
    id: 'r1',
    author: 'Ananya S.',
    rating: 5,
    date: '12 May 2025',
    body: 'Genuinely surprised by how soft and comfortable this is — I wore it all day without a second thought. The Rose Pink colour looks exactly like the photos. Already recommended it to three friends.',
    verified: true,
  },
  {
    id: 'r2',
    author: 'Meghna R.',
    rating: 4,
    date: '28 Apr 2025',
    body: "The Lavender Mist is so pretty in person, much more delicate than I expected. Sizing runs true — I got Regular and it fits perfectly. Would have given 5 stars but the XL was out of stock when I ordered.",
    verified: true,
  },
  {
    id: 'r3',
    author: 'Priya K.',
    rating: 5,
    date: '3 Mar 2025',
    body: "I was a bit skeptical ordering online but the quality really delivers. The Midnight Teal has become my everyday go-to. Nua's packaging is thoughtful too — felt like a little gift to myself.",
    verified: true,
  },
];
