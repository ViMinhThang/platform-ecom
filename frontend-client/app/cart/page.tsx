"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCart, updateItemInCart, removeItemFromCart } from "@/lib/store/slices/cartSlice";

export default function CartPage() {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state) => state.cart);

    const token = session?.accessToken;

    useEffect(() => {
        if (status === "loading") return;
        if (token) {
            dispatch(fetchCart(token as string));
        }
    }, [token, status, dispatch]);

    const handleUpdateQuantity = async (productId: number, variantId: number | undefined, change: number) => {
        if (!token) return;
        try {
            await dispatch(updateItemInCart({ productId, quantityChange: change, variantId, token: token as string })).unwrap();
            toast.success("Cart updated");
        } catch (error) {
            console.error("Failed to update cart:", error);
            toast.error("Failed to update cart");
        }
    };

    const handleRemove = async (productId: number, variantId: number | undefined) => {
        if (!token) return;
        try {
            await dispatch(removeItemFromCart({ productId, variantId, token: token as string })).unwrap();
            toast.success("Item removed");
            // Optionally refetch to ensure total price is correct if we didn't update it in reducer
            dispatch(fetchCart(token as string));
        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error("Failed to remove item");
        }
    };

    if (status === "loading" || (loading && !cart)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view your cart</h1>
            </div>
        );
    }

    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground">Start shopping to add items to your cart.</p>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {cart.products.map((item, index) => (
                        <CartItem
                            key={`${item.id}-${item.variantId || 'base'}-${index}`}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>

                <div>
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}
