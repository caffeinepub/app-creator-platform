import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionView, UserProfile } from '../backend';

// Custom error class to distinguish 401/session errors from generic errors
export class SessionExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

function parseError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  // Detect 401 / user not found errors
  if (
    msg.includes('401') ||
    msg.toLowerCase().includes('user not found') ||
    msg.toLowerCase().includes('api error 401')
  ) {
    return new SessionExpiredError('Your session has expired. Please log out and log back in.');
  }
  return err instanceof Error ? err : new Error(msg);
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes('not ready') ||
          msg.toLowerCase().includes('system is not ready')
        ) {
          return null;
        }
        if (msg.toLowerCase().includes('unauthorized')) {
          return null;
        }
        throw parseError(err);
      }
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
      if (!actor) throw new Error('Actor not available. Please refresh the page and try again.');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: () => {
      // Do NOT invalidate on error — keep the modal open so the user sees the error
    },
  });
}

export function useGetSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSessions();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes('not ready') ||
          msg.toLowerCase().includes('system is not ready')
        ) {
          return [];
        }
        throw parseError(err);
      }
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
      try {
        return await actor.getSession(sessionId);
      } catch (err) {
        throw parseError(err);
      }
    },
    enabled: !!actor && !actorFetching && !!sessionId,
    retry: (failureCount, error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (
        msg.includes('not found') ||
        msg.includes('Access denied') ||
        msg.toLowerCase().includes('not ready') ||
        msg.toLowerCase().includes('unauthorized') ||
        error instanceof SessionExpiredError
      ) {
        return false;
      }
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
      try {
        return await actor.addMessage(sessionId, role, content);
      } catch (err) {
        throw parseError(err);
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
        return await actor.updateFiles(sessionId, filename, content);
      } catch (err) {
        throw parseError(err);
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
      return actor.deleteSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
