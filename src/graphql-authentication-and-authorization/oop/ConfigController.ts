import { auth } from './decorator';
import { Role } from '../db';

class ConfigController {
  @auth({ roles: [Role.admin, Role.editor, Role.viewer] })
  public static config() {
    return { url: 'https://github.com/mrdulin' };
  }
  private constructor() {}
}

export { ConfigController };
