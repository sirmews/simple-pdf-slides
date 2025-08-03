import { useState, useEffect } from 'react';

interface ProfileBannerData {
  selectedImage: string | null;
  selectedBanner: string | null;
}

const STORAGE_KEY = 'profile-banner-data';

export function useProfileBanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Loading profile banner data:', saved ? 'found data' : 'no data');
      if (saved) {
        const data: ProfileBannerData = JSON.parse(saved);
        console.log('Loaded profile banner data:', { hasImage: !!data.selectedImage, selectedBanner: data.selectedBanner });
        setSelectedImage(data.selectedImage);
        setSelectedBanner(data.selectedBanner);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load profile banner data:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever state changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    
    const data: ProfileBannerData = {
      selectedImage,
      selectedBanner,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Saved profile banner data:', { hasImage: !!selectedImage, selectedBanner });
    } catch (error) {
      console.error('Failed to save profile banner data:', error);
    }
  }, [selectedImage, selectedBanner, isLoaded]);

  const updateSelectedImage = (image: string | null) => {
    setSelectedImage(image);
  };

  const updateSelectedBanner = (banner: string | null) => {
    setSelectedBanner(banner);
  };

  const clearProfileBannerData = () => {
    setSelectedImage(null);
    setSelectedBanner(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    selectedImage,
    selectedBanner,
    updateSelectedImage,
    updateSelectedBanner,
    clearProfileBannerData,
  };
}