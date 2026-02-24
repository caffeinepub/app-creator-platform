import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionView } from '../backend';

export function useGetSessions() {
    const { actor, isFetching } = useActor();
    return useQuery<SessionView[]>({
        queryKey: ['sessions'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getSessions();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetSession(sessionId: string) {
    const { actor, isFetching } = useActor();
    return useQuery<SessionView>({
        queryKey: ['session', sessionId],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not ready');
            return actor.getSession(sessionId);
        },
        enabled: !!actor && !isFetching && !!sessionId,
    });
}

export function useCreateSession() {
    const { actor, isFetching } = useActor();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ name, projectType }: { name: string; projectType: string }) => {
            if (!actor || isFetching) throw new Error('Actor not ready. Please wait a moment and try again.');
            const sessionId = await actor.createSession(name, projectType);
            return sessionId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useDeleteSession() {
    const { actor } = useActor();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: string) => {
            if (!actor) throw new Error('Actor not ready');
            return actor.deleteSession(sessionId);
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
            if (!actor) throw new Error('Actor not ready');
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
            if (!actor) throw new Error('Actor not ready');
            return actor.updateFiles(sessionId, filename, content);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
        },
    });
}
