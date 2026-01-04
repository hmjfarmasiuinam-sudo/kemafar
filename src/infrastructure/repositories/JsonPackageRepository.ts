/**
 * JsonPackageRepository
 * JSON-based implementation of IPackageRepository
 */

import { IPackageRepository } from '@/core/repositories/IPackageRepository';
import { Package } from '@/core/entities/Package';
import packagesData from '@/../public/data/packages.json';

export class JsonPackageRepository implements IPackageRepository {
  private packages: Package[] = packagesData.packages as Package[];

  async findAll(): Promise<Package[]> {
    return [...this.packages];
  }

  async findById(id: string): Promise<Package | null> {
    const pkg = this.packages.find((p) => p.id === id);
    return pkg || null;
  }

  async findByType(type: string): Promise<Package[]> {
    return this.packages.filter((p) => p.type === type);
  }
}

// Singleton instance
export const jsonPackageRepository = new JsonPackageRepository();
