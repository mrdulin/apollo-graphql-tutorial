import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server';
import { defaultFieldResolver } from 'graphql';

class AuthDirective extends SchemaDirectiveVisitor {
  public visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }

  public visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  public ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) {
      return;
    }
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const roles = field._requiredAuthRole || objectType._requiredAuthRole;
        if (!roles) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        const { user } = context.req;
        console.log(`roles = ${roles.join(':')}, user = ${JSON.stringify(user)}`);
        if (!user || !roles.includes(user.role)) {
          throw new AuthenticationError('no permission');
        }

        return resolve.apply(this, args);
      };
    });
  }
}

export { AuthDirective };
