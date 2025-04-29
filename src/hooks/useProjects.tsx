
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Project = {
  id: string;
  name: string;
  type: 'form' | 'drafting';
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
};

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Create project function
  const createProject = async (name: string, type: 'form' | 'drafting') => {
    try {
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          user_id: user.id,
          type,
        })
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => [...prev, data as Project]);
      toast({
        title: 'Project created',
        description: 'Your project has been created successfully.',
      });
      return data as Project;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create your project.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update project status
  const updateProjectStatus = async (id: string, status: 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setProjects((prev) => 
        prev.map((project) => 
          project.id === id ? { ...project, status, updated_at: new Date().toISOString() } : project
        )
      );
      
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your project.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data as Project[]);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch your projects.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  // Get project statistics
  const getProjectStats = () => {
    const formCount = projects.filter(p => p.type === 'form' && p.status === 'in_progress').length;
    const draftCount = projects.filter(p => p.type === 'drafting' && p.status === 'in_progress').length;
    const completedCount = projects.filter(p => p.status === 'completed').length;
    
    return {
      formCount,
      draftCount,
      completedCount
    };
  };

  // Get recent projects (most recently updated)
  const getRecentProjects = (limit = 3) => {
    return [...projects]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  };

  return {
    projects,
    loading,
    createProject,
    updateProjectStatus,
    getProjectStats,
    getRecentProjects,
  };
}
