import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/hooks/useAuth';
import { saveMealSelection } from '@/src/services/profile';

export function useSaveMealSelection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slotKey, recipeId }: { slotKey: string; recipeId: string }) => {
      if (!user) throw new Error('Not signed in');
      await saveMealSelection(user.id, slotKey, recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionProfile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['todayPlan', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['intake', user?.id] });
    },
  });
}
