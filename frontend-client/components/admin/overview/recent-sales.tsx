import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const salesData = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
    fallback: 'OM',
    amount: '+$1,999.00'
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
    fallback: 'JL',
    amount: '+$39.00'
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
    fallback: 'IN',
    amount: '+$299.00'
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/4.png',
    fallback: 'WK',
    amount: '+$99.00'
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
    fallback: 'SD',
    amount: '+$39.00'
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>Doanh số gần đây</CardTitle>
        <CardDescription>265 giao dịch trong tháng này</CardDescription>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='space-y-1'>
          {salesData.map((sale, index) => (
            <div 
              key={index} 
              className='flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/50'
            >
              <Avatar className='h-9 w-9 ring-2 ring-primary/10'>
                <AvatarImage src={sale.avatar} alt={sale.name} />
                <AvatarFallback className='bg-primary/10 text-primary text-xs font-medium'>
                  {sale.fallback}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{sale.name}</p>
                <p className='text-xs text-muted-foreground truncate'>{sale.email}</p>
              </div>
              <div className='font-semibold text-sm text-emerald-600'>{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
