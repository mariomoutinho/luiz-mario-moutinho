import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  createBoard,
  deleteBoard,
  fetchBoardDetail,
  fetchBoards,
  fetchProfile,
  renameBoard,
  subscribeToBoard,
  updateProfile,
} from '../lib/api';
import { friendlyError } from '../lib/errors';
import { supabaseConfigured } from '../lib/supabase';

export const queryKeys = {
  boards: ['boards'] as const,
  board: (boardId: string) => ['board', boardId] as const,
  profile: (userId: string) => ['profile', userId] as const,
};

export function useBoards() {
  return useQuery({
    queryKey: queryKeys.boards,
    queryFn: fetchBoards,
    enabled: supabaseConfigured,
  });
}

export function useBoard(boardId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.board(boardId),
    queryFn: () => fetchBoardDetail(boardId),
    enabled: Boolean(boardId) && supabaseConfigured,
  });

  useEffect(() => {
    if (!boardId || !supabaseConfigured) return;
    return subscribeToBoard(boardId, () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.board(boardId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.boards });
    });
  }, [boardId, queryClient]);

  return query;
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => fetchProfile(userId),
    enabled: Boolean(userId) && supabaseConfigured,
  });
}

export function useBoardMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.boards });

  return {
    create: useMutation({
      mutationFn: ({ title, color }: { title: string; color: string }) => createBoard(title, color),
      onSuccess: invalidate,
      meta: { errorMessage: friendlyError },
    }),
    rename: useMutation({
      mutationFn: ({ boardId, title }: { boardId: string; title: string }) =>
        renameBoard(boardId, title),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: deleteBoard,
      onSuccess: invalidate,
    }),
  };
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateProfile(userId, name),
    onSuccess: (profile) => queryClient.setQueryData(queryKeys.profile(userId), profile),
  });
}
