// Flash Sales Feature Exports

// Components
export { FlashSaleStatusBadge } from './components/flash-sale-status-badge';
export { FlashSaleForm } from './components/flash-sale-form';
export { FlashSaleItemPicker } from './components/flash-sale-item-picker';
export { FlashSaleTable } from './components/flash-sale-data-table';
export { getFlashSaleColumns } from './components/flash-sale-table';

// Redux actions and selectors are now imported directly from the slice:
// import { fetchFlashSales, createFlashSale, ... } from '@/lib/store/slices/flashSaleSlice';
// const { items, loading, ... } = useAppSelector((state) => state.flashSales);
