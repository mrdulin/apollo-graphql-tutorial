import { Role } from '../../db';
import { AuthenticationError } from 'apollo-server';

function AuthDecoratorFactory(options?: { roles: Role[] }) {
  return function authDecorator(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const orignalFunction = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const context = args[2];
      const { user } = context.req;
      if (!user) {
        throw new AuthenticationError('no permission');
      }

      if (options && options.roles) {
        console.log(`[authDecorator] roles = ${options.roles}, user = ${JSON.stringify(user)}`);
        if (!options.roles.includes(user.role)) {
          throw new AuthenticationError('no permission');
        }
      }
      return orignalFunction.apply(this, args);
    };
    return descriptor;
  };
}

export { AuthDecoratorFactory as auth };
