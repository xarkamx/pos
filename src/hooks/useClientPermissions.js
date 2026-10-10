import { useAuth } from './useAuth';

export function useClientPermissions() {
  const { access } = useAuth();
  return { canEditClients: access?.roles?.includes('admin') === true };
}
