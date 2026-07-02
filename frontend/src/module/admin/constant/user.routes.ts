export const USER_ROUTES = {
  BLOCK_USER: (userId: string) => `/admin/${userId}/block`,

  UNBLOCK_USER: (userId: string) => `/admin/${userId}/unblock`,
} as const;