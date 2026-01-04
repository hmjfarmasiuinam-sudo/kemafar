/**
 * IBookingRepository
 * Interface for Booking data persistence
 */

import { Booking } from '../entities/Booking';

export interface IBookingRepository {
  /**
   * Save a new booking
   */
  save(booking: Booking): Promise<Booking>;

  /**
   * Find booking by ID
   */
  findById(id: string): Promise<Booking | null>;

  /**
   * Get all bookings (for admin, future use)
   */
  findAll(): Promise<Booking[]>;
}
