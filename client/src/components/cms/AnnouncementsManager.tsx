"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Edit3, Loader2, X, Megaphone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAnnouncementStore, Announcement } from '@/store';
import { AnnouncementSkeleton } from './skeleton/AnnouncementSkeleton';

// AnnouncementsManager - Handles CRUD operations for site-wide banners.

export const AnnouncementsManager = () => {
  const { announcements, setAnnouncements } = useAnnouncementStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<Announcement | null>(null);

  // Refs used to bypass controlled component overhead for quick date presets
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        // Simulate network latency for smooth UX transition
        await new Promise(resolve => setTimeout(resolve, 500));

        // API Integration ready
        // const data = await fetch('/api/announcements').then(res => res.json());
        // setAnnouncements(data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, [setAnnouncements]);

  /**
   * Logic - compares current date against announcement window to determine visibility status
   */
  const getAnnouncementStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return { label: 'Scheduled', color: 'border-blue-500 text-blue-500' };
    if (now > endDate) return { label: 'Expired', color: 'border-zinc-700 text-zinc-500' };
    return { label: 'Active', color: 'border-(--byreix-green) text-(--byreix-green)' };
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'promo': return 'text-(--byreix-green) bg-(--byreix-green)/10 border-(--byreix-green)/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  // Directly updates input values for specific timeframes (7 or 30 days from today)
  const setQuickDate = (days: number) => {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureStr = futureDate.toISOString().split('T')[0];

    if (startRef.current && endRef.current) {
      startRef.current.value = today;
      endRef.current.value = futureStr;
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get('startDate') as string;
    const end = formData.get('endDate') as string;

    // Validation - prevent invalid date ranges
    if (new Date(end) < new Date(start)) {
      alert("End date cannot be earlier than start date!");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as 'info' | 'warning' | 'promo',
      startDate: start,
      endDate: end,
    };

    try {
      await new Promise(res => setTimeout(res, 500));
      if (currentEdit) {
        setAnnouncements(prev => prev.map(a => a.id === currentEdit.id ? { ...a, ...payload, id: a.id } : a));
      } else {
        setAnnouncements(prev => [{ id: Date.now(), ...payload }, ...prev]);
      }
      setIsModalOpen(false);
    } catch {
      alert("Failed to save announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement permanently?")) return;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Announcements</h1>
          <p className="text-(--byreix-text-secondary) text-sm">Manage global banners and notifications.</p>
        </div>
        <Button
          onClick={() => { setCurrentEdit(null); setIsModalOpen(true); }}
          className="bg-(--byreix-green) text-(--byreix-bg) gap-2 font-bold px-6 shrink-0 cursor-pointer"
        >
          New Announcement
        </Button>
      </div>
      {/* Announcement list ui container */}
      <div className="bg-(--byreix-surface) border border-(--byreix-border) rounded-2xl overflow-hidden">
        <div className="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
          {isLoading ? (
            <div className="divide-y divide-(--byreix-border)">
            {[...Array(4)].map((_, i) => (
              <AnnouncementSkeleton key={i} />
            ))}
          </div>
          ) : (
            <div className="divide-y divide-(--byreix-border)">
              {announcements.length > 0 ? (
                announcements.map((ann) => {
                  const status = getAnnouncementStatus(ann.startDate, ann.endDate);
                  return (
                    <div key={ann.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/2 transition-colors">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getTypeStyles(ann.type)}`}>
                          <Megaphone size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-bold text-sm truncate">{ann.title}</h3>
                          <p className="text-(--byreix-text-secondary) text-xs truncate max-w-md">{ann.message}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${status.color}`}>
                              {status.label}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                              <Calendar size={12} />
                              {ann.startDate} — {ann.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button onClick={() => { setCurrentEdit(ann); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white cursor-pointer" title='edit'><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(ann.id)} className="p-2 text-zinc-400 hover:text-red-500 cursor-pointer" title='delete'><Trash2 size={18} /></button>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty state fallback */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-dashed border-zinc-700">
                    <Megaphone size={24} className="text-zinc-600" />
                  </div>
                  <h3 className="text-white font-medium">No announcements found</h3>
                  <p className="text-(--byreix-text-secondary) text-xs mt-1 max-w-60">
                    Create your first announcement to start broadcasting updates to your users.
                  </p>
                  <button
                    onClick={() => { setCurrentEdit(null); setIsModalOpen(true); }}
                    className="mt-6 text-xs font-bold text-(--byreix-green) hover:underline cursor-pointer"
                  >
                    Create Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Announcement creation/edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-(--byreix-surface) border border-(--byreix-border) w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-(--byreix-border) pb-4">
              <h2 className="text-xl font-bold text-white">{currentEdit ? 'Edit' : 'Create'} Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer" title='btn'><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Title</label>
                  <input name="title" required disabled={isSubmitting} className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg p-3 text-sm text-white outline-none focus:border-(--byreix-green) transition-colors cursor-pointer" defaultValue={currentEdit?.title} placeholder="Announcement Title" />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Type</label>
                  <select name="type" className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg p-3 text-sm text-white focus:border-(--byreix-green) transition-colors outline-none cursor-pointer" defaultValue={currentEdit?.type || 'info'} title='type-select'>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="promo">Promotion</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Message</label>
                  <textarea name="message" required rows={3} className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg p-3 text-sm text-white outline-none focus:border-(--byreix-green) transition-colors resize-none " defaultValue={currentEdit?.message} placeholder="Details..." />
                </div>

                <div className="col-span-2 flex items-center justify-between mt-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <Clock size={12} /> Schedule Duration
                  </label>
                  <div className="flex gap-2 ">
                    <button type="button" onClick={() => setQuickDate(7)} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors cursor-pointer">Next 7 Days</button>
                    <button type="button" onClick={() => setQuickDate(30)} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors cursor-pointer">30 Days</button>
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Start Date</label>
                  <div className="relative group">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-(--byreix-green) transition-colors pointer-events-none" />
                    <input
                      ref={startRef}
                      name="startDate"
                      type="date"
                      required
                      onClick={(e) => e.currentTarget.showPicker()}
                      className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg p-3 pl-10 text-sm text-white outline-none focus:border-(--byreix-green) transition-colors invert cursor-pointer"
                      defaultValue={currentEdit?.startDate || new Date().toISOString().split('T')[0]}
                      title='start-date-input'
                    />
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ">End Date</label>
                  <div className="relative group">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-(--byreix-green) transition-colors pointer-events-none " />
                    <input
                      ref={endRef}
                      name="endDate"
                      type="date"
                      required
                      onClick={(e) => e.currentTarget.showPicker()}
                      className="w-full bg-(--byreix-bg) border border-(--byreix-border) rounded-lg p-3 pl-10 text-sm text-white outline-none focus:border-(--byreix-green) transition-colors invert cursor-pointer"
                      defaultValue={currentEdit?.endDate}
                      title='end-date-input'
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-(--byreix-border)">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 text-white border-zinc-800 cursor-pointer" disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-(--byreix-green) text-(--byreix-bg) font-bold cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};