"use client";

import { Control, useController } from "react-hook-form";
import { UserFormValues } from "@/types/user/user.form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";
import { Address } from "@/types/user";

interface UserAddressesFieldProps {
    control: Control<UserFormValues>;
    loading: boolean;
    userId: number | null | undefined;
}

/**
 * User Addresses Management Field
 * Displays and manages user addresses
 */
export const UserAddressesField: React.FC<UserAddressesFieldProps> = ({
    control,
    loading,
    userId,
}) => {
    const {
        field: { value: addresses },
    } = useController({
        control,
        name: "addresses",
        defaultValue: []
    });

    if (!addresses || addresses.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground py-8">
                        <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Chưa có địa chỉ</p>
                        <p className="text-sm">Người dùng chưa thêm địa chỉ nào</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <CardDescription>
                Quản lý {addresses.length} {addresses.length === 1 ? 'địa chỉ' : 'địa chỉ'}
            </CardDescription>

            {addresses.map((address: Address, index: number) => (
                <Card key={address.addressId || index} className={address.isDefault ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Home size={16} className="text-muted-foreground" />
                                <CardTitle className="text-base">
                                    {address.buildingName}
                                </CardTitle>
                            </div>
                            {address.isDefault && (
                                <Badge variant="default" className="text-xs">
                                    Mặc định
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-sm">
                            <p className="text-muted-foreground">{address.street}</p>
                            <p className="font-medium">
                                {address.wardName && `${address.wardName}, `}
                                {address.districtName && `${address.districtName}, `}
                                {address.city}
                            </p>
                            <p className="text-muted-foreground">
                                {address.state}, {address.country} - {address.pincode}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
