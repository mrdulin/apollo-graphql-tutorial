import { AuthenticationError } from 'apollo-server';
import { Role } from '../db';
import { skip } from './';

const isAuthenticated = (_, __, { req }) => (req.user ? skip : new AuthenticationError('Not authenticated'));

const isAuthorized = (roles: Role[]) => (_, __, { req }) =>
  roles.includes(req.user.role) ? skip : new AuthenticationError('Not authorized');

export { isAuthenticated, isAuthorized };
