import { z } from "zod";

// Language types
export type Language = "ko" | "en" | "zh" | "ja";

// Festival basic information
export const festivalInfoSchema = z.object({
  name: z.record(z.string()),
  dates: z.record(z.string()),
  location: z.record(z.string()),
  price: z.record(z.string()),
});

export type FestivalInfo = z.infer<typeof festivalInfoSchema>;

// Announcement
export const announcementSchema = z.object({
  id: z.string(),
  title: z.record(z.string()),
  content: z.record(z.string()),
  date: z.string(),
});

export type Announcement = z.infer<typeof announcementSchema>;

// Gallery item
export const galleryItemSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  caption: z.record(z.string()).optional(),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;

// Restaurant menu item
export const menuItemSchema = z.object({
  name: z.record(z.string()),
  price: z.string(),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

// Restaurant
export const restaurantSchema = z.object({
  id: z.string(),
  name: z.record(z.string()),
  menu: z.array(menuItemSchema),
});

export type Restaurant = z.infer<typeof restaurantSchema>;

// Food zone
export const foodZoneSchema = z.object({
  id: z.string(),
  name: z.record(z.string()),
  restaurants: z.array(restaurantSchema),
});

export type FoodZone = z.infer<typeof foodZoneSchema>;

// Program
export const programSchema = z.object({
  id: z.string(),
  title: z.record(z.string()),
  date: z.string(),
  time: z.string(),
  location: z.record(z.string()),
  description: z.record(z.string()).optional(),
});

export type Program = z.infer<typeof programSchema>;

// Goods item
export const goodsItemSchema = z.object({
  id: z.string(),
  name: z.record(z.string()),
  price: z.string(),
  imageUrl: z.string(),
  description: z.record(z.string()).optional(),
});

export type GoodsItem = z.infer<typeof goodsItemSchema>;

// Location information
export const locationInfoSchema = z.object({
  address: z.record(z.string()),
  mapUrl: z.string().optional(),
  parking: z.record(z.string()).optional(),
  publicTransport: z.record(z.string()).optional(),
});

export type LocationInfo = z.infer<typeof locationInfoSchema>;
