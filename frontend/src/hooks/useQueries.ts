import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionView, UserProfile } from '../backend';

// ─── Error helpers ────────────────────────────────────────────────────────────

export class SessionExpiredError extends Error {
  constructor(message = 'Session expired. Please log in again.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

function parseError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
    throw new SessionExpiredError();
  }
  throw err instanceof Error ? err : new Error(message);
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (err) {
        parseError(err);
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 60_000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.saveCallerUserProfile(profile);
      } catch (err) {
        parseError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export function useGetSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: userProfile } = useGetCallerUserProfile();

  return useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSessions();
      } catch (err) {
        parseError(err);
      }
    },
    enabled: !!actor && !actorFetching && !!userProfile,
    staleTime: 30_000,
  });
}

export function useGetSession(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SessionView>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getSession(sessionId);
      } catch (err) {
        parseError(err);
      }
    },
    enabled: !!actor && !actorFetching && !!sessionId,
    staleTime: 10_000,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      projectType,
    }: {
      name: string;
      projectType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const result = await actor.createSession(name, projectType);
        if (!result) throw new Error('Failed to create session');
        return result;
      } catch (err) {
        parseError(err);
      }
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
      try {
        await actor.addMessage(sessionId, role, content);
      } catch (err) {
        parseError(err);
      }
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
      try {
        await actor.updateFiles(sessionId, filename, content);
      } catch (err) {
        parseError(err);
      }
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
      try {
        await actor.deleteSession(sessionId);
      } catch (err) {
        parseError(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
