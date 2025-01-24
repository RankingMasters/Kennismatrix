import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          *,
          paths:paths(count)
        `)
        .order('order');
      
      if (sectionsError) throw sectionsError;

      return sections.map(section => ({
        ...section,
        paths_count: section.paths?.[0]?.count || 0
      }));
    },
  });
}

export function useUpdateSectionOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, order }: { id: string, order: number }) => {
      const { error } = await supabase
        .from('sections')
        .update({ order })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('sections')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('sections')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function usePaths(sectionId: string | undefined) {
  return useQuery({
    queryKey: ['paths', sectionId],
    queryFn: async () => {
      if (!sectionId) return [];
      const { data, error } = await supabase
        .from('paths')
        .select('*')
        .eq('section_id', sectionId)
        .order('order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!sectionId,
  });
}

export function useCreatePath() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('paths')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paths', variables.section_id] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useUpdatePath() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('paths')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paths'] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useDeletePath() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('paths')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paths'] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useLevels(pathId: string | undefined) {
  return useQuery({
    queryKey: ['levels', pathId],
    queryFn: async () => {
      if (!pathId) return [];
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .eq('path_id', pathId)
        .order('rank');
      
      if (error) throw error;
      return data;
    },
    enabled: !!pathId,
  });
}

export function useCreateLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pathId, data }: { pathId: string, data: any }) => {
      const { error } = await supabase
        .from('levels')
        .insert([{ ...data, path_id: pathId }]);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['levels', variables.pathId] });
    },
  });
}

export function useUpdateLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('levels')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
}

export function useDeleteLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('levels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
}

export function useTopUsers() {
  return useQuery({
    queryKey: ['top-users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_progress_counts')
        .select('*')
        .order('completed_levels', { ascending: false });
      
      if (error) throw error;
      return users;
    },
  });
}

export function useUserProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-progress', userId],
    queryFn: async () => {
      if (!userId) return [];

      // First get all paths with their total levels count and section info
      const { data: paths, error: pathsError } = await supabase
        .from('paths')
        .select(`
          id,
          title,
          section_id,
          sections:sections (
            id,
            title,
            icon,
            color
          ),
          levels(count)
        `);

      if (pathsError) throw pathsError;

      // Then get user's progress
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          levels:levels(
            *,
            paths:paths(
              id,
              title,
              section_id
            )
          )
        `)
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // Create a map of path IDs to their total levels and section info
      const pathInfo = paths.reduce((acc: Record<string, any>, path) => {
        acc[path.id] = {
          totalLevels: path.levels[0]?.count || 0,
          section: path.sections
        };
        return acc;
      }, {});

      // Group progress by section and path
      const sectionProgress = progress.reduce((acc: any, curr) => {
        const path = curr.levels.paths;
        const pathId = path.id;
        const section = pathInfo[pathId]?.section;
        
        if (!section) return acc;

        if (!acc[section.id]) {
          acc[section.id] = {
            id: section.id,
            title: section.title,
            icon: section.icon,
            color: section.color,
            paths: {}
          };
        }

        if (!acc[section.id].paths[pathId]) {
          acc[section.id].paths[pathId] = {
            id: pathId,
            title: path.title,
            progress: 0,
            currentLevel: curr.levels.title,
            completedLevels: []
          };
        }

        acc[section.id].paths[pathId].completedLevels.push(curr.levels);
        const totalLevels = pathInfo[pathId]?.totalLevels || 0;
        acc[section.id].paths[pathId].progress = totalLevels > 0 
          ? Math.round((acc[section.id].paths[pathId].completedLevels.length / totalLevels) * 100)
          : 0;

        return acc;
      }, {});

      // Convert the nested objects to arrays
      return Object.values(sectionProgress).map((section: any) => ({
        ...section,
        paths: Object.values(section.paths)
      }));
    },
    enabled: !!userId,
  });
}

export function useActivityLog() {
  return useQuery({
    queryKey: ['activity-log'],
    queryFn: async () => {
      const { data: activities, error } = await supabase
        .from('activity_log_with_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return activities.map(activity => ({
        ...activity,
        profile: {
          id: activity.profile_id,
          full_name: activity.full_name,
          avatar_url: activity.avatar_url
        }
      }));
    },
  });
}