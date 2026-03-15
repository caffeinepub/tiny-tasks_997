import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Task } from "../backend";

export function useGetTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDisplayName() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ["displayName"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getDisplayName();
      return result && result.length > 0 ? result[0] : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetDisplayName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setDisplayName(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displayName"] });
    },
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      dueDate: bigint | null;
      priority: string;
      notes: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTask(
        params.title,
        params.dueDate,
        params.priority,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      dueDate: bigint | null;
      priority: string;
      notes: string | null;
      completed: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTask(
        params.id,
        params.title,
        params.dueDate,
        params.priority,
        params.notes,
        params.completed,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
