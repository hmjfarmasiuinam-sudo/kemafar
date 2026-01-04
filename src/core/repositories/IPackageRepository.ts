/**
 * IPackageRepository
 * Interface for Package data access
 */

import { Package } from '../entities/Package';

export interface IPackageRepository {
  /**
   * Get all packages
   */
  findAll(): Promise<Package[]>;

  /**
   * Get a single package by ID
   */
  findById(id: string): Promise<Package | null>;

  /**
   * Get packages by type
   */
  findByType(type: string): Promise<Package[]>;
}
