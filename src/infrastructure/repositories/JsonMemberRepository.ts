/**
 * JSON Member Repository Implementation
 */

import { Member, MemberListItem, MemberStatus } from '@/core/entities/Member';
import { IMemberRepository } from '@/core/repositories/IMemberRepository';
import { SITE_CONFIG } from '@/lib/constants';

export class JsonMemberRepository implements IMemberRepository {
  private async fetchMembers(): Promise<Member[]> {
    // Use relative URL in browser, absolute URL during build
    const url = typeof window !== 'undefined'
      ? '/data/members.json'
      : `${process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url}/data/members.json`;

    const response = await fetch(url, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }
    return response.json();
  }

  async getAll(): Promise<MemberListItem[]> {
    const members = await this.fetchMembers();
    return members.map(this.toListItem);
  }

  async getByStatus(status: MemberStatus): Promise<MemberListItem[]> {
    const members = await this.fetchMembers();
    return members.filter((member) => member.status === status).map(this.toListItem);
  }

  async getByBatch(batch: string): Promise<MemberListItem[]> {
    const members = await this.fetchMembers();
    return members.filter((member) => member.batch === batch).map(this.toListItem);
  }

  async getByDivision(division: string): Promise<MemberListItem[]> {
    const members = await this.fetchMembers();
    return members.filter((member) => member.division === division).map(this.toListItem);
  }

  async getById(id: string): Promise<Member | null> {
    const members = await this.fetchMembers();
    return members.find((member) => member.id === id) || null;
  }

  async search(query: string): Promise<MemberListItem[]> {
    const members = await this.fetchMembers();
    const lowerQuery = query.toLowerCase();
    return members
      .filter(
        (member) =>
          member.name.toLowerCase().includes(lowerQuery) ||
          member.nim.toLowerCase().includes(lowerQuery) ||
          member.batch.toLowerCase().includes(lowerQuery)
      )
      .map(this.toListItem);
  }

  private toListItem(member: Member): MemberListItem {
    return {
      id: member.id,
      name: member.name,
      nim: member.nim,
      photo: member.photo,
      batch: member.batch,
      status: member.status,
      division: member.division,
      position: member.position,
    };
  }
}
