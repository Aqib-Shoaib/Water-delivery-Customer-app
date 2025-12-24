// Mock data for demo mode when backend is not available

export const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Pure Spring Water',
    description: 'Fresh mountain spring water with natural minerals',
    sizeLiters: 19,
    price: 2.99,
    active: true,
    images: ['https://picsum.photos/seed/water1/200/200.jpg'],
    category: 'bottled'
  },
  {
    _id: '2',
    name: 'Mineral Water',
    description: 'Premium mineral water with electrolytes',
    sizeLiters: 1,
    price: 0.99,
    active: true,
    images: ['https://picsum.photos/seed/water2/200/200.jpg'],
    category: 'bottled'
  },
  {
    _id: '3',
    name: 'Alkaline Water',
    description: 'pH-balanced alkaline water for better hydration',
    sizeLiters: 0.5,
    price: 1.49,
    active: true,
    images: ['https://picsum.photos/seed/water3/200/200.jpg'],
    category: 'bottled'
  },
  {
    _id: '4',
    name: 'Water Dispenser',
    description: 'Hot and cold water dispenser for home/office',
    sizeLiters: 0,
    price: 149.99,
    active: true,
    images: ['https://picsum.photos/seed/dispenser/200/200.jpg'],
    category: 'equipment'
  },
  {
    _id: '5',
    name: 'Glass Water Bottles',
    description: 'Set of 6 reusable glass bottles',
    sizeLiters: 0.75,
    price: 24.99,
    active: true,
    images: ['https://picsum.photos/seed/glass/200/200.jpg'],
    category: 'bottles'
  },
  {
    _id: '6',
    name: 'Water Filter',
    description: 'Advanced water filtration system',
    sizeLiters: 0,
    price: 89.99,
    active: true,
    images: ['https://picsum.photos/seed/filter/200/200.jpg'],
    category: 'equipment'
  }
];

export const MOCK_ORDERS = [
  {
    _id: 'order1',
    customer: '1',
    items: [
      { product: { _id: '1', name: 'Pure Spring Water' }, quantity: 2, unitPrice: 2.99 },
      { product: { _id: '2', name: 'Mineral Water' }, quantity: 5, unitPrice: 0.99 }
    ],
    totalAmount: 10.93,
    status: 'delivered',
    address: '123 Main St, Karachi',
    notes: 'Leave at door',
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:30:00.000Z',
    deliveredAt: '2024-01-15T14:20:00.000Z'
  },
  {
    _id: 'order2',
    customer: '1',
    items: [
      { product: { _id: '4', name: 'Water Dispenser' }, quantity: 1, unitPrice: 149.99 }
    ],
    totalAmount: 149.99,
    status: 'en_route',
    address: '123 Main St, Karachi',
    notes: 'Call before arriving',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T09:15:00.000Z',
    eta: '2024-01-20T16:00:00.000Z'
  },
  {
    _id: 'order3',
    customer: '1',
    items: [
      { product: { _id: '3', name: 'Alkaline Water' }, quantity: 3, unitPrice: 1.49 }
    ],
    totalAmount: 4.47,
    status: 'placed',
    address: '123 Main St, Karachi',
    notes: '',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2024-01-22T11:45:00.000Z'
  }
];

export const MOCK_SUPPORT_TICKETS = [
  {
    _id: 'ticket1',
    title: 'Delivery Delay',
    description: 'My order is 2 hours late',
    status: 'open',
    createdAt: '2024-01-22T12:00:00.000Z'
  },
  {
    _id: 'ticket2',
    title: 'Water Quality Issue',
    description: 'The water taste seems off',
    status: 'resolved',
    createdAt: '2024-01-20T15:30:00.000Z'
  }
];
