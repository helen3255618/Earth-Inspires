export interface Snapshot {
  id: number;
  thumbnailDataURL: string; // In a real app with a key, this might be the Static API URL
  timestamp: string;
  zoom: number;
  lat: number;
  lng: number;
  note?: string;
}

export interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  onDelete: (id: number) => void;
  theme: 'dark' | 'light';
}
