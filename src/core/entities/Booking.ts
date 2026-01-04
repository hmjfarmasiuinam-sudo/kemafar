/**
 * Booking Entity
 * Domain model untuk booking/reservasi kunjungan
 */

export type PackageType = 'educational' | 'family' | 'custom';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  visitDate: Date;
  numberOfVisitors: number;
  packageType: PackageType;
  message?: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  visitDate: Date;
  numberOfVisitors: number;
  packageType: PackageType;
  message?: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

// Factory function
export function createBooking(input: BookingInput): Booking {
  return {
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    visitDate: input.visitDate,
    numberOfVisitors: input.numberOfVisitors,
    packageType: input.packageType,
    message: input.message,
    createdAt: new Date(),
    status: 'pending',
  };
}
