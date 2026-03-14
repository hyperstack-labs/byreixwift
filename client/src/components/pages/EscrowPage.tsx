"use client";

import { useState } from "react";
import { Card, Button, Input, Label, Textarea, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function EscrowPage() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [formData, setFormData] = useState({
        counterparty: "",
        amount: "",
        token: "SDA",
        description: "",
        releaseCondition: "",
    });

    const escrows = [
        {
            id: "ESC-001",
            counterparty: "0x742d...9aB8",
            amount: "5,000 SDA",
            usdValue: "$10,000",
            status: "active",
            description: "Website Development Payment",
            createdAt: "2 days ago",
            role: "seller",
        },
        {
            id: "ESC-002",
            counterparty: "0x9f3a...7cD2",
            amount: "2.5 ETH",
            usdValue: "$6,250",
            status: "pending",
            description: "NFT Purchase",
            createdAt: "5 hours ago",
            role: "buyer",
        },
        {
            id: "ESC-003",
            counterparty: "0x5e8b...4fA1",
            amount: "1,000 USDT",
            usdValue: "$1,000",
            status: "completed",
            description: "Freelance Work",
            createdAt: "1 week ago",
            role: "seller",
        },
    ];

    const handleCreateEscrow = () => {
        if (!formData.counterparty || !formData.amount || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }
        toast.success("Escrow created");
        setShowCreateDialog(false);
        setFormData({
            counterparty: "",
            amount: "",
            token: "SDA",
            description: "",
            releaseCondition: "",
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header - simpler */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold">Escrow</h1>
                        <p className="text-sm text-[#A0A0A0] mt-1">
                            3 contracts — $17,250 secured
                        </p>
                    </div>
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-[#26D578] hover:bg-[#26D578]/90 text-black">
                                <Plus className="w-4 h-4 mr-1" />
                                New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#121212] border-[#1E1E1E]">
                            <DialogHeader>
                                <DialogTitle>New Escrow</DialogTitle>
                                <DialogDescription>
                                    Funds are held until both parties agree to release.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="counterparty" className="text-sm">Counterparty</Label>
                                    <Input
                                        id="counterparty"
                                        placeholder="0x..."
                                        value={formData.counterparty}
                                        onChange={(e) =>
                                            setFormData({ ...formData, counterparty: e.target.value })
                                        }
                                        className="mt-1 bg-[#0A0A0A] border-[#1E1E1E]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="amount" className="text-sm">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) =>
                                                setFormData({ ...formData, amount: e.target.value })
                                            }
                                            className="mt-1 bg-[#0A0A0A] border-[#1E1E1E]"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="token" className="text-sm">Token</Label>
                                        <Input
                                            id="token"
                                            value={formData.token}
                                            readOnly
                                            className="mt-1 bg-[#0A0A0A] border-[#1E1E1E]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-sm">Transaction Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="mt-1 bg-[#0A0A0A] border-[#1E1E1E] min-h-[80px]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateDialog(false)}
                                    className="flex-1 border-[#1E1E1E]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateEscrow}
                                    className="flex-1 bg-[#26D578] hover:bg-[#26D578]/90 text-black"
                                >
                                    Create
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Escrow List - cleaner table-like layout */}
                <div className="space-y-2">
                    {escrows.map((escrow) => (
                        <Card
                            key={escrow.id}
                            className="p-4 bg-[#121212] border-[#1E1E1E] hover:border-[#2E2E2E] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Status dot */}
                                    <div
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${escrow.status === "active"
                                            ? "bg-[#D4AF37]"
                                            : escrow.status === "pending"
                                                ? "bg-yellow-500"
                                                : "bg-[#26D578]"
                                            }`}
                                    />

                                    {/* Main info */}
                                    <div className="min-w-0">
                                        <p className="font-medium truncate">{escrow.description}</p>
                                        <p className="text-sm text-[#A0A0A0]">
                                            {escrow.counterparty} · {escrow.createdAt}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 flex-shrink-0">
                                    {/* Amount */}
                                    <div className="text-right hidden sm:block">
                                        <p className="font-medium">{escrow.amount}</p>
                                        <p className="text-sm text-[#A0A0A0]">{escrow.usdValue}</p>
                                    </div>

                                    {/* Role badge */}
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${escrow.role === "seller"
                                            ? "bg-[#1E1E1E] text-[#26D578]"
                                            : "bg-[#1E1E1E] text-blue-400"
                                            }`}
                                    >
                                        {escrow.role}
                                    </span>

                                    {/* Action */}
                                    {escrow.status !== "completed" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-[#1E1E1E] hover:bg-[#1E1E1E]"
                                        >
                                            {escrow.status === "active" ? "Release" : "Approve"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty state hint - no more "How It Works" */}
                {escrows.length === 0 && (
                    <div className="text-center py-12 text-[#A0A0A0]">
                        <p>No escrow contracts available</p>
                        <p className="text-sm mt-1">Create an escrow contract to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
