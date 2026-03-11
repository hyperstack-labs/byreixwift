import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Announcement {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'promo';
    startDate: string;
    endDate: string;
}

interface AnnouncementState {
    announcements: Announcement[];
    isLoading: boolean; // for the skeleton
    setLoading: (loading: boolean) => void; // for the skeleton
    setAnnouncements: (announcements: Announcement[] | ((prev: Announcement[]) => Announcement[])) => void;
    // We can expose a getter or selector for activeAnnouncement, but Zustand state usually stores data.
    // We can export a selector for activeAnnouncement in the same file.
}

export const useAnnouncementStore = create<AnnouncementState>()(
    persist(
        (set) => ({
            announcements: [],
            isLoading: false, // Default to false
            setLoading: (loading) => set({ isLoading: loading }),
            setAnnouncements: (announcementsOrUpdater) =>
                set((state) => {
                    const newAnnouncements = typeof announcementsOrUpdater === 'function'
                        ? announcementsOrUpdater(state.announcements)
                        : announcementsOrUpdater;
                    return { announcements: newAnnouncements };
                }),
        }),
        {
            name: 'byreix_announcements', // name of the item in the storage (must be unique)
            // So that it only persist announcements, and not the loading state
            partialize: (state) => ({ announcements: state.announcements }),
        }
    )
);

// Selector for active announcement
export const useActiveAnnouncement = () => {
    const announcements = useAnnouncementStore((state) => state.announcements);
    const now = new Date();
    return announcements.find(ann => {
        const start = new Date(ann.startDate);
        const end = new Date(ann.endDate);
        return now >= start && now <= end;
    }) || null;
};
