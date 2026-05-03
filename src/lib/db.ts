import Dexie, { type Table } from 'dexie';
import type { Project } from '@/shared/types';

export class ClassRoomDB extends Dexie {
  projects!: Table<Project, string>;

  constructor() {
    super('ClassRoomStudioDB');
    this.version(1).stores({
      projects: 'id, name, updatedAt, createdAt'
    });
  }
}

export const db = new ClassRoomDB();

export async function saveProject(project: Project) {
  const toSave = { ...project, updatedAt: new Date().toISOString() };
  await db.projects.put(toSave);
}

export async function loadProjects() {
  return await db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function getProject(id: string) {
  return await db.projects.get(id);
}

export async function deleteProject(id: string) {
  await db.projects.delete(id);
}
