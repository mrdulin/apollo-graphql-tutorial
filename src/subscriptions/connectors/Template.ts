import * as _ from 'lodash';

import { BaseConnector } from './Base';
import { IMemoryDB, ITemplate } from '../datasources/memoryDB';
import { ICommonResponse } from '../models/CommonResponse';

interface ITemplateInput {
  id: string;
  name?: string;
  shareLocationIds?: string[];
}

class TemplateConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  constructor(datasource: Datasource) {
    super(datasource);
  }

  public findAll(): ITemplate[] {
    return this.datasource.templates;
  }

  public findById(id: string): ITemplate | undefined {
    return this.datasource.templates.find(template => template.id === id);
  }

  public edit(templateInput: ITemplateInput): ICommonResponse {
    const template: ITemplate | undefined = this.findById(templateInput.id);
    if (template) {
      const templateWithoutId = _.omit(templateInput, 'id');
      Object.assign(template, templateWithoutId);
      return { success: true, message: 'Edit template successfully.' };
    } else {
      return { success: false, message: 'No template found.' };
    }
  }
}

export { TemplateConnector };
