import type { User } from '@supabase/supabase-js';

export const authState = $state({
    user: null as User | null,
    loading: true
});
