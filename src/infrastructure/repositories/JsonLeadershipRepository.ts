/**
 * JSON Leadership Repository Implementation
 */

import { Leadership, LeadershipListItem, Division, LeadershipPosition } from '@/core/entities/Leadership';
import { ILeadershipRepository } from '@/core/repositories/ILeadershipRepository';
import { SITE_CONFIG } from '@/lib/constants';

export class JsonLeadershipRepository implements ILeadershipRepository {
  private async fetchLeadership(): Promise<Leadership[]> {
    // Use relative URL in browser, absolute URL during build
    const url = typeof window !== 'undefined'
      ? '/data/leadership.json'
      : `${process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url}/data/leadership.json`;

    const response = await fetch(url, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch leadership');
    }
    return response.json();
  }

  async getAll(): Promise<LeadershipListItem[]> {
    const leadership = await this.fetchLeadership();
    return leadership.sort((a, b) => a.order - b.order).map(this.toListItem);
  }

  async getCore(): Promise<LeadershipListItem[]> {
    const leadership = await this.fetchLeadership();
    const corePositions: LeadershipPosition[] = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];
    return leadership
      .filter((member) => corePositions.includes(member.position))
      .sort((a, b) => a.order - b.order)
      .map(this.toListItem);
  }

  async getByDivision(division: Division): Promise<LeadershipListItem[]> {
    const leadership = await this.fetchLeadership();
    return leadership
      .filter((member) => member.division === division)
      .sort((a, b) => a.order - b.order)
      .map(this.toListItem);
  }

  async getByPosition(position: LeadershipPosition): Promise<LeadershipListItem[]> {
    const leadership = await this.fetchLeadership();
    return leadership
      .filter((member) => member.position === position)
      .sort((a, b) => a.order - b.order)
      .map(this.toListItem);
  }

  async getById(id: string): Promise<Leadership | null> {
    const leadership = await this.fetchLeadership();
    return leadership.find((member) => member.id === id) || null;
  }

  async getCurrentPeriod(): Promise<LeadershipListItem[]> {
    const leadership = await this.fetchLeadership();
    const now = new Date();
    return leadership
      .filter((member) => {
        const start = new Date(member.period.start);
        const end = new Date(member.period.end);
        return now >= start && now <= end;
      })
      .sort((a, b) => a.order - b.order)
      .map(this.toListItem);
  }

  private toListItem(member: Leadership): LeadershipListItem {
    return {
      id: member.id,
      name: member.name,
      position: member.position,
      division: member.division,
      photo: member.photo,
      email: member.email,
      period: member.period,
      order: member.order,
    };
  }
}
