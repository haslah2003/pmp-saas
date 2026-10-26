import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'counselor'

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const userRoles = (req.user as { roles?: Role[] } | null | undefined)?.roles
  return Array.isArray(userRoles) && userRoles.some((role) => roles.includes(role))
}

export const anyone: Access = () => true
export const nobody: Access = () => false
export const authenticated: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')

/** Content managers: admins and editors manage the website content. */
export const isContentManager: Access = ({ req }) => hasRole(req, 'admin', 'editor')

/** CRM staff: admins and counselors handle applications and inquiries. */
export const isCRMStaff: Access = ({ req }) => hasRole(req, 'admin', 'counselor')

/** Anyone can read published documents; signed-in staff can read everything. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { published: { equals: true } }
}

/** For collections with drafts: the public only sees published versions. */
export const publishedStatusOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const adminOrSelf: Access = ({ req }) => {
  if (hasRole(req, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
