import type { Access } from 'payload'

/** Zugriff nur für eingeloggte Admins und Redakteure */
export const isAdmin: Access = ({ req }) => {
  return Boolean(req.user)
}

/** Öffentlich lesbar, aber nur Admins dürfen schreiben */
export const publicReadAdminWrite = {
  read: (): true => true,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
