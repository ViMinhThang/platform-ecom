import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
};
export const navItems: NavItem[] = [
  {
    title: 'Về trang chủ',
    url: '/',
    icon: 'home',
    isActive: false,
    items: []
  },
  {
    title: 'Tổng quan',
    url: '/admin/dashboard/overview',
    icon: 'dashboard',
    isActive: true,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Người dùng',
    url: '/admin/dashboard/user',
    icon: 'user',
    isActive: false,
    shortcut: ['u', 'u'],
    items: []
  },
  {
    title: 'Sản phẩm',
    url: '/admin/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Danh mục',
    url: '/admin/dashboard/category',
    icon: 'category',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Chiến dịch KM',
    url: '/admin/dashboard/sale-campaigns',
    icon: 'flashSale',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Mã giảm giá',
    url: '/admin/dashboard/vouchers',
    icon: 'voucher',
    shortcut: ['v', 'v'],
    isActive: false,
    items: []
  },
  {
    title: 'Đơn hàng',
    url: '/admin/dashboard/orders',
    icon: 'media',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Kho hàng',
    url: '/admin/dashboard/inventory',
    icon: 'package',
    shortcut: ['i', 'i'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Đánh giá',
    url: '/admin/dashboard/reviews',
    icon: 'star',
    shortcut: ['r', 'r'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Tài khoản',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Hồ sơ',
        url: '/admin/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Đăng nhập',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
