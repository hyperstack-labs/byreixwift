"use client";

import React, { useState } from 'react';
import { useForm, useWatch as useFormWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { BannerAdSize } from '../ads/BannerAd';
import Image from 'next/image';

// --- Schema Definition ---
const bannerAdSchema = z.object({
    name: z.string().min(1, "Ad name is required"),
    url: z.string().url("Please enter a valid URL"),
    size: z.nativeEnum(BannerAdSize, { message: "Please select a size" }),
    placements: z.array(z.string()).min(1, "Select at least one placement"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(['active', 'inactive']),
    mediaType: z.enum(['image', 'video']),
    image: z.any().optional(), // We'll handle image validation manually or via file input
});

export type BannerAdFormData = z.infer<typeof bannerAdSchema>;

interface BannerAdFormProps {
    initialData?: Partial<BannerAdFormData> & { id?: number; thumbnail?: string };
    onSubmit: (data: BannerAdFormData & { thumbnail?: string }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const PLACEMENT_OPTIONS = [
    { id: 'homepage_top', label: 'Homepage Top' },
    { id: 'sidebar_right', label: 'Sidebar Right' },
    { id: 'article_inline', label: 'Article Inline' },
    { id: 'footer', label: 'Footer' },
];

export const BannerAdForm: React.FC<BannerAdFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.thumbnail || null);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<BannerAdFormData>({
        resolver: zodResolver(bannerAdSchema),
        defaultValues: {
            name: initialData?.name || '',
            url: initialData?.url || '',
            size: initialData?.size || BannerAdSize.LEADERBOARD,
            placements: initialData?.placements || [],
            startDate: initialData?.startDate || '',
            endDate: initialData?.endDate || '',
            status: initialData?.status || 'active',
            mediaType: initialData?.mediaType || 'image',
        },
    });

    const selectedPlacements = useFormWatch({ control, name: 'placements' });
    const status = useFormWatch({ control, name: 'status' });
    const mediaType = useFormWatch({ control, name: 'mediaType' });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a fake local URL for preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            // In a real app, you'd upload here or keep the file object to upload on submit
            // setValue('image', file); 
        }
    };

    const togglePlacement = (id: string) => {
        const current = selectedPlacements || [];
        if (current.includes(id)) {
            setValue('placements', current.filter((p: string) => p !== id));
        } else {
            setValue('placements', [...current, id]);
        }
    };

    // Custom submit handler to include the preview URL (as a mock for the uploaded image URL)
    const onFormSubmit = (data: BannerAdFormData) => {
        onSubmit({
            ...data,
            thumbnail: previewUrl || '/mockThumbnail.png' // Fallback for demo
        });
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

            {/* Top Settings: Type & Name */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Ad Type</label>
                    <select
                        {...register('mediaType')}
                        className={`w-full bg-(--byreix-bg) border ${errors.mediaType ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none appearance-none cursor-pointer`}
                        onChange={(e) => {
                            setValue('mediaType', e.target.value as 'image' | 'video');
                            setPreviewUrl(null); // Reset preview on type change
                        }}
                    >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Ad Name</label>
                    <input
                        {...register('name')}
                        className={`w-full bg-(--byreix-bg) border ${errors.name ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none`}
                        placeholder="e.g. Summer Campaign"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Target URL</label>
                <input
                    {...register('url')}
                    className={`w-full bg-(--byreix-bg) border ${errors.url ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none`}
                    placeholder="https://example.com"
                />
                {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url.message}</p>}
            </div>

            {/* Creative Upload */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">
                    {mediaType === 'video' ? 'Video Creative (MP4, WebM)' : 'Image Creative'}
                </label>
                <div className={`border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-(--byreix-border)'} rounded-xl p-4 flex flex-col items-center justify-center bg-(--byreix-bg)/50 hover:bg-(--byreix-bg) transition-colors relative overflow-hidden group min-h-[200px]`}>

                    {previewUrl ? (
                        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-black/20">
                            {mediaType === 'video' ? (
                                <video
                                    src={previewUrl}
                                    controls
                                    className="max-h-[200px] w-auto max-w-full rounded"
                                />
                            ) : (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                                    Change {mediaType === 'video' ? 'Video' : 'Image'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={mediaType === 'video' ? "video/*" : "image/*"}
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full py-8">
                            <div className="w-12 h-12 rounded-full bg-(--byreix-surface) flex items-center justify-center text-(--byreix-text-secondary)">
                                <Upload size={20} />
                            </div>
                            <p className="text-sm text-(--byreix-text-secondary)">Upload a file or drag and drop it here</p>
                            <p className="text-xs text-(--byreix-text-secondary)/60">
                                {mediaType === 'video'
                                    ? 'MP4, WebM or OGG (max. 15s recommended)'
                                    : 'SVG, PNG, JPG or GIF (max. 800x400px)'}
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                accept={mediaType === 'video' ? "video/*" : "image/*"}
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Size Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Size Format</label>
                    <select
                        {...register('size')}
                        className={`w-full bg-(--byreix-bg) border ${errors.size ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none appearance-none`}
                    >
                        {Object.values(BannerAdSize).map((size) => (
                            <option key={size} value={size}>
                                {size.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                    {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size.message}</p>}
                </div>

                {/* Status Toggle */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Status</label>
                    <div className="flex items-center gap-3 p-3 bg-(--byreix-bg) border border-(--byreix-border) rounded-lg">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                {...register('status')}
                                onChange={(e) => setValue('status', e.target.checked ? 'active' : 'inactive')}
                                checked={status === 'active'}
                            />
                            <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-(--byreix-green) after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                        </label>
                        <span className={`text-sm font-bold uppercase ${status === 'active' ? 'text-(--byreix-green)' : 'text-(--byreix-text-secondary)'}`}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Start Date</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-(--byreix-text-secondary)" size={16} />
                        <input
                            type="date"
                            {...register('startDate')}
                            className={`w-full bg-(--byreix-bg) border ${errors.startDate ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 pl-10 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                    </div>
                    {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">End Date</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-(--byreix-text-secondary)" size={16} />
                        <input
                            type="date"
                            {...register('endDate')}
                            className={`w-full bg-(--byreix-bg) border ${errors.startDate ? 'border-red-500' : 'border-(--byreix-border)'} rounded-lg p-3 pl-10 text-sm text-white focus:ring-1 focus:ring-(--byreix-green) outline-none [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                    </div>
                    {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
                </div>
            </div>

            {/* Placements (Multi-select) */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-(--byreix-text-secondary) uppercase">Placements</label>
                <div className="grid grid-cols-2 gap-2">
                    {PLACEMENT_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => togglePlacement(option.id)}
                            className={`cursor-pointer border rounded-lg p-3 text-sm font-medium transition-all ${selectedPlacements?.includes(option.id)
                                ? 'bg-(--byreix-green)/10 border-(--byreix-green) text-(--byreix-green)'
                                : 'bg-(--byreix-bg) border-(--byreix-border) text-(--byreix-text-secondary) hover:border-white/30'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPlacements?.includes(option.id) ? 'bg-(--byreix-green) border-(--byreix-green)' : 'border-(--byreix-text-secondary)'
                                    }`}>
                                    {selectedPlacements?.includes(option.id) && <div className="w-2 h-2 rounded bg-black" />}
                                </div>
                                {option.label}
                            </div>
                        </div>
                    ))}
                </div>
                {errors.placements && <p className="text-xs text-red-500 mt-1">{errors.placements.message}</p>}
            </div>

            <div className="pt-4 flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 border-(--byreix-border) text-white hover:bg-white/5"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-(--byreix-green) text-(--byreix-bg) font-bold hover:opacity-90 disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (initialData?.id ? 'Save Changes' : 'Create Ad')}
                </Button>
            </div>
        </form>
    );
};
