
/**
 * Represents a listing from gde-kako.rs.
 */
export interface Listing {
  /**
   * The ID of the listing.
   */
  id: string;
  /**
   * The title of the listing.
   */
  title: string;
  /**
   * The description of the listing.
   */
  description: string;
  /**
   * The URL of the listing.
   */
  url: string;
  /**
   * The image URL of the listing.
   */
  imageUrl: string;
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { createClient } from 'redis';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Redis configuration
const redisClient = createClient({
  url: process.env.NEXT_PUBLIC_REDIS_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

connectRedis().catch(console.error);

/**
 * Asynchronously retrieves listings from Firebase, using Redis for caching.
 *
 * @param queryText The search query.
 * @returns A promise that resolves to an array of Listing objects.
 */
export async function searchListings(queryText: string): Promise<Listing[]> {
  const cacheKey = `listings:${queryText}`;

  try {
    // Connect to Redis if not already connected
    await connectRedis();

    // Try to get the data from Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Data retrieved from Redis cache");
      return JSON.parse(cachedData) as Listing[];
    }

    console.log("Data not in cache, fetching from Firebase");

    // Data not in cache, fetch from Firebase
    const listings = await fetchListingsFromFirebase(queryText);

    // Store the data in Redis cache
    await redisClient.set(cacheKey, JSON.stringify(listings), {
      EX: 3600, // Cache for 1 hour
    });

    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

/**
 * Fetches listings from Firebase based on the search query.
 * @param queryText The search query.
 * @returns A promise that resolves to an array of Listing objects.
 */
async function fetchListingsFromFirebase(queryText: string): Promise<Listing[]> {
  try {
    const listingsCollection = collection(db, "listings");
    const q = query(listingsCollection, where("title", ">=", queryText), where("title", "<=", queryText + "\uf8ff"));
    const querySnapshot = await getDocs(q);

    const listings: Listing[] = [];
    querySnapshot.forEach((doc) => {
      listings.push({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        url: doc.data().url,
        imageUrl: doc.data().imageUrl,
      });
    });
    return listings;
  } catch (error) {
    console.error("Error fetching listings from Firebase:", error);
    return [];
  }
}
