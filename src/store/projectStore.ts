import { create } from 'zustand';
import type { Project } from '@/shared/types';
import { generateId, now } from '@/shared/utils/id';
import { createDefaultScene } from './sceneStore';
import { saveProject, loadProjects, deleteProject } from '@/lib/db';

interface ProjectState {
  currentProject: Project | null;
  recentProjects: Project[];

  // Actions
  initProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  setCurrentProject: (project: Project) => void;
  updateProjectInfo: (updates: Partial<Project>) => Promise<void>;
  saveCurrentProject: (scene: any) => Promise<void>;
  removeRecentProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  currentProject: null,
  recentProjects: [],

  initProjects: async () => {
    const projects = await loadProjects();
    set({ recentProjects: projects });
  },

  createProject: async (name, description = '') => {
    const project: Project = {
      id: generateId(),
      name,
      description,
      schemaVersion: '1.0.0',
      createdAt: now(),
      updatedAt: now(),
      thumbnail: '',
      activeSchemeId: '',
      schemes: [{
        id: generateId(),
        name: '默认方案',
        description: '',
        createdAt: now(),
        updatedAt: now(),
        scene: createDefaultScene(),
        presentationSteps: [],
      }],
      metadata: {
        customer: '',
        school: '',
        author: '',
        tags: [],
      },
    };

    project.activeSchemeId = project.schemes[0].id;

    await saveProject(project);
    const updatedProjects = await loadProjects();
    
    set({ currentProject: project, recentProjects: updatedProjects });
    return project;
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  updateProjectInfo: async (updates) => {
    const { currentProject } = get();
    if (currentProject) {
      const updated = { ...currentProject, ...updates, updatedAt: now() };
      await saveProject(updated);
      const updatedProjects = await loadProjects();
      set({ currentProject: updated, recentProjects: updatedProjects });
    }
  },

  saveCurrentProject: async (scene) => {
    const { currentProject } = get();
    if (currentProject) {
      const schemeIndex = currentProject.schemes.findIndex(s => s.id === currentProject.activeSchemeId);
      if (schemeIndex !== -1) {
        const newSchemes = [...currentProject.schemes];
        newSchemes[schemeIndex] = {
          ...newSchemes[schemeIndex],
          scene,
          updatedAt: now(),
        };
        const updated = { ...currentProject, schemes: newSchemes, updatedAt: now() };
        await saveProject(updated);
        const updatedProjects = await loadProjects();
        set({ currentProject: updated, recentProjects: updatedProjects });
      }
    }
  },

  removeRecentProject: async (id) => {
    await deleteProject(id);
    const updatedProjects = await loadProjects();
    set({ recentProjects: updatedProjects });
  },
}));
