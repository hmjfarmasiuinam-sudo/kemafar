/**
 * JsonBookingRepository
 * In-memory implementation of IBookingRepository
 * For production, swap with DatabaseBookingRepository
 */

import { IBookingRepository } from '@/core/repositories/IBookingRepository';
import { Booking } from '@/core/entities/Booking';

export class JsonBookingRepository implements IBookingRepository {
  private bookings: Booking[] = [];

  async save(booking: Booking): Promise<Booking> {
    // In a real database, this would persist to storage
    // For now, store in memory (lost on server restart)
    this.bookings.push(booking);

    // In production, also save to JSON file or database
    // await fs.writeFile('bookings.json', JSON.stringify(this.bookings));

    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = this.bookings.find((b) => b.id === id);
    return booking || null;
  }

  async findAll(): Promise<Booking[]> {
    return [...this.bookings];
  }
}

// Singleton instance
export const jsonBookingRepository = new JsonBookingRepository();
