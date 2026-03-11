"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { BannerAdForm, BannerAdFormData } from '../ads/BannerAdForm';
import { BannerAdSize } from '../ads/BannerAd';
import { BannerAdsTableSkeleton } from './skeleton/BannerAdsTableSkeleton';

// Interface def
interface Ad {
  id: number;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  impressions: number;
  clicks: number;
  thumbnail: string;
  // New fields to match the form
  size?: BannerAdSize;
  placements?: string[];
  startDate?: string;
  endDate?: string;
  mediaType?: 'image' | 'video';
}

// Mock data for ads
const initialAds: Ad[] = [
  { id: 1, name: 'Sidra Chain', url: 'https://Sidra.com/news', status: 'active', impressions: 1240, clicks: 88, thumbnail: '/mockThumbnail.png', size: BannerAdSize.LEADERBOARD, placements: ['homepage_top'], startDate: '2024-01-01', endDate: '2024-12-31', mediaType: 'image' },
  { id: 2, name: 'O Block Street', url: 'https://Kingvon.com/ArmAndDangerous', status: 'active', impressions: 420, clicks: 69, thumbnail: '/ads.mp4', size: BannerAdSize.MEDIUM_RECTANGLE, placements: ['sidebar_right'], startDate: '2024-02-01', endDate: '2024-03-01', mediaType: 'video' },
];

export const BannerAdsManager = () => {
  // States
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAds(initialAds);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle status logic
  const handleToggleStatus = (id: number): void => {
    setAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === id
          ? { ...ad, status: ad.status === 'active' ? 'inactive' : 'active' }
          : ad
      )
    );
  };

  // Delete actions logic preparation
  const handleDelete = (id: number): void => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this ad?")) {
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
    }
  };

  // Edit / Create Logic
  const openCreateModal = () => {
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const startEditing = (ad: Ad): void => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: BannerAdFormData & { thumbnail?: string }) => {
    if (editingAd) {
      // Update existing
      setAds(prev => prev.map(ad => ad.id === editingAd.id ? { ...ad, ...data } : ad));
    } else {
      // Create new
      const newAd: Ad = {
        id: Date.now(), // simple mock ID
        ...data,
        impressions: 0,
        clicks: 0,
        thumbnail: data.thumbnail || '/mockThumbnail.png',
      };
      setAds(prev => [newAd, ...prev]);
    }
    setIsModalOpen(false);
    setEditingAd(null);
  };

  // Search filter logic
  const filteredAds = ads.filter((ad) =>
    ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Banner Ads Management</h1>
          <p className="text-(--byreix-text-secondary) text-sm">Monitor and manage your platform advertisements.</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-(--byreix-green) hover:opacity-90 text-(--byreix-bg) gap-2 font-bold px-6 w-full md:w-auto cursor-pointer"
          title='create new ad btn'
        >
          <Plus size={18} />
          Create New Ad
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-4 p-4 bg-(--byreix-surface) border border-(--byreix-border) rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--byreix-text-secondary)" size={18} />
          <input
            title='search ads'
            type="text"
            placeholder="Search by ad name or URL..."
            className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-(--byreix-green) outline-none transition-all text-white"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-(--byreix-surface) border border-(--byreix-border) rounded-2xl overflow-hidden min-h-100 flex flex-col relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-(--byreix-text-secondary)">
            <BannerAdsTableSkeleton />        
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-(--byreix-border) scrollbar-track-transparent divide-y divide-(--byreix-border)">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="p-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded bg-(--byreix-bg) border border-(--byreix-border) shrink-0 relative overflow-hidden flex items-center justify-center">
                      {ad.mediaType === 'video' ? (
                        <div className="text-white bg-black/50 p-1 rounded-full"><span className="text-[8px]">VIDEO</span></div>
                      ) : (
                        <Image src={ad.thumbnail} alt="Preview" fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{ad.name}</p>
                      <a href={ad.url} className="text-[10px] text-(--byreix-green) truncate block">{ad.url}</a>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEditing(ad)} className="text-(--byreix-text-secondary) hover:text-white cursor-pointer" title='edit btn'><Edit3 size={16} /></button>
                      <button type="button" onClick={() => handleDelete(ad.id)} className="text-(--byreix-text-secondary) hover:text-red-500 cursor-pointer" title='delete btn'><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-(--byreix-bg) p-3 rounded-lg border border-(--byreix-border)">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          title='toggle status'
                          type="checkbox"
                          className="sr-only peer"
                          checked={ad.status === 'active'}
                          onChange={() => handleToggleStatus(ad.id)}
                        />
                        <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:bg-(--byreix-green) after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                      <span className={`text-[10px] font-bold uppercase ${ad.status === 'active' ? 'text-(--byreix-green)' : 'text-(--byreix-text-secondary)'}`}>
                        {ad.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-white">
                      {ad.impressions} IMP / {ad.clicks} CLK
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-[#1A1A1A] border-b border-(--byreix-border) sticky top-0 z-10">
                    <tr>
                      <th className="w-[12%] px-6 py-5 text-[10px] uppercase tracking-widest text-(--byreix-text-secondary) font-bold">Thumbnail</th>
                      <th className="w-[43%] px-6 py-5 text-[10px] uppercase tracking-widest text-(--byreix-text-secondary) font-bold">Ad Details</th>
                      <th className="w-[15%] px-6 py-5 text-[10px] uppercase tracking-widest text-(--byreix-text-secondary) font-bold">Status</th>
                      <th className="w-[15%] px-6 py-5 text-[10px] uppercase tracking-widest text-(--byreix-text-secondary) font-bold text-center">Stats (I/C)</th>
                      <th className="w-[15%] px-6 py-5 text-[10px] uppercase tracking-widest text-(--byreix-text-secondary) font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-(--byreix-border) scrollbar-track-transparent">
                <table className="w-full text-left border-collapse table-fixed">
                  <tbody className="divide-y divide-(--byreix-border)">
                    {filteredAds.map((ad) => (
                      <tr key={ad.id} className="hover:bg-white/2 transition-colors group">
                        <td className="w-[12%] px-6 py-4">
                          <div className="w-11 h-11 rounded bg-(--byreix-bg) border border-(--byreix-border) flex items-center justify-center overflow-hidden">
                            {ad.mediaType === 'video' ? (
                              <div className="text-[8px] font-bold text-white bg-black/60 px-1 py-0.5 rounded">VIDEO</div>
                            ) : (
                              <Image src={ad.thumbnail} alt="Preview" width={44} height={44} className="object-cover rounded" />
                            )}
                          </div>
                        </td>
                        <td className="w-[43%] px-6 py-4">
                          <div className="flex flex-col min-w-0 pr-8">
                            <span className="text-sm font-bold text-white truncate">{ad.name}</span>
                            <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-(--byreix-green) hover:underline flex items-center gap-1 w-fit">
                              {ad.url} <ExternalLink size={10} />
                            </a>
                          </div>
                        </td>
                        <td className="w-[15%] px-6 py-4">
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                title='toggle status'
                                type="checkbox"
                                className="sr-only peer"
                                checked={ad.status === 'active'}
                                onChange={() => handleToggleStatus(ad.id)}
                              />
                              <div className="w-8 h-4 bg-white/10 rounded-full peer peer-checked:bg-(--byreix-green) after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                            </label>
                            <span className={`text-[10px] font-bold uppercase ${ad.status === 'active' ? 'text-(--byreix-green)' : 'text-(--byreix-text-secondary)'}`}>
                              {ad.status}
                            </span>
                          </div>
                        </td>
                        <td className="w-[15%] px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-4 text-xs font-mono">
                            <div className="flex flex-col items-center">
                              <span className="text-white font-bold">{ad.impressions}</span>
                              <span className="text-[8px] text-(--byreix-text-secondary) uppercase">Imp</span>
                            </div>
                            <div className="h-5 w-px bg-(--byreix-border)" />
                            <div className="flex flex-col items-center">
                              <span className="text-white font-bold">{ad.clicks}</span>
                              <span className="text-[8px] text-(--byreix-text-secondary) uppercase">Clk</span>
                            </div>
                          </div>
                        </td>
                        <td className="w-[15%] px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <button type="button" onClick={() => startEditing(ad)} className="text-(--byreix-text-secondary) hover:text-white transition-colors cursor-pointer" title="Edit Ad"><Edit3 size={17} /></button>
                            <button
                              type="button"
                              onClick={() => handleDelete(ad.id)}
                              className="text-(--byreix-text-secondary) hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Ad"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredAds.length === 0 && (
              <div className="flex-1 flex items-center justify-center px-6 py-16 text-center text-(--byreix-text-secondary) text-sm italic border-t border-(--byreix-border)">
                No advertisements found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-(--byreix-surface) border-(--byreix-border) p-0 overflow-hidden gap-0">
          <DialogHeader className="p-6 border-b border-(--byreix-border)">
            <DialogTitle className="text-xl font-bold text-white">
              {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingAd ? 'Update the details of your banner ad below.' : 'Fill in the details to create a new banner ad campaign.'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <BannerAdForm
              initialData={editingAd || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};