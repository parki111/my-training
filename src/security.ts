import { User } from '../prisma/client';

/**
 * The list of all access permissions, granting access to pages and resources.
 */
export const PERMISSIONS = [] as const;

/**
 * The list of all access roles.
 *
 * Roles are collections of permissions.
 * @see ROLE_PERMISSION_MAP
 */
export const ROLES = ['admin', 'user'] as const;

/**
 * Maps each user role to an array of permissions granted to that role.
 */
export const ROLE_PERMISSION_MAP: Record<Role, Permission[]> = {
  admin: [],
  user: [],
};

/**
 * The role given to newly provisioned users.
 */
export const DEFAULT_ROLE: Role | null = null;

/**
 * A map specifying to which route the user should
 * be directed to upon login, based upon their role.
 * priority will be given to the higher role when a user has multiple roles
 */
export const DEFAULT_HOME_PAGES: Partial<Record<Role, string>> = {
  admin: '/admin',
  user: '/',
};

/**
 * Allows developers to implement custom logic to be run when the user
 * logs in, including sending the client to a specific route. This can
 * also be helpful for provisioning new users: creating initial data
 * and/or sending them to a sign-up page. You will know that the user
 * is signing in for the first time if the `user` object has a
 * `lastLogin` value of `null`.
 *
 * If no custom login logic is required, this function should
 * do nothing and return null.
 *
 * @param user The data of the user logging in.
 * @returns A string representing the frontend route to navigate to, or
 * null if no navigation is needed.
 */
// eslint-disable-next-line
export async function customOnLogin(user: User): Promise<string | null> {
  return null;
}

/**
 * An access permission, granting access to pages and resources.
 */
export type Permission = (typeof PERMISSIONS)[number];
/**
 * A site access role.
 *
 * Roles are collections of permissions.
 * @see ROLE_PERMISSION_MAP
 */
export type Role = (typeof ROLES)[number];
