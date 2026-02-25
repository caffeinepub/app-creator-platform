import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionView, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessions();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetSession(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SessionView>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
    retry: (failureCount, error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('not found') || msg.includes('Access denied')) return false;
      return failureCount < 2;
    },
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, projectType }: { name: string; projectType: string }) => {
      if (!actor) throw new Error('Actor not available');
      const session = await actor.createSession(name, projectType);
      if (!session) throw new Error('Failed to create session: server returned null');
      if (!session.id) throw new Error('Failed to create session: missing session ID');
      return session as SessionView;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      role,
      content,
    }: {
      sessionId: string;
      role: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(sessionId, role, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
    },
  });
}

export function useUpdateFiles() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      filename,
      content,
    }: {
      sessionId: string;
      filename: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFiles(sessionId, filename, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
    },
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useInitializeSystem() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.initialize();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Ignore "already initialized" error — it means we're good
        if (msg.includes('already initialized')) return;
        throw err;
      }
    },
  });
}
