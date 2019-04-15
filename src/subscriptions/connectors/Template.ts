import * as _ from 'lodash';
import * as faker from 'faker';

import { BaseConnector } from './Base';
import { IMemoryDB, ITemplate } from '../datasources/memoryDB';
import { ICommonResponse } from '../models/CommonResponse';
import { IBaseModel, Omit } from '../models/Base';
import { PubSub, TriggerNameType } from '../pubsub';

interface IAddTemplateInput {
  name: string;
  shareLocationIds: string[];
}

interface IEditTemplateInput extends IBaseModel, Partial<IAddTemplateInput> {}

class TemplateConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  private pubsub: PubSub;
  constructor(datasource: Datasource, pubsub: PubSub) {
    super(datasource);
    this.pubsub = pubsub;
  }

  public findAll(): ITemplate[] {
    return this.datasource.templates;
  }

  public findById(id: string): ITemplate | undefined {
    return this.datasource.templates.find((template: ITemplate): boolean => template.id === id);
  }

  public edit(templateInput: IEditTemplateInput): ICommonResponse {
    const template: ITemplate | undefined = this.findById(templateInput.id);
    if (template) {
      const templateWithoutId: Omit<IEditTemplateInput, 'id'> = _.omit(templateInput, 'id');
      Object.assign(template, templateWithoutId);
      return { success: true, message: 'Edit template successfully.' };
    } else {
      return { success: false, message: 'No template found.' };
    }
  }

  public add(templateInput: IAddTemplateInput): ICommonResponse {
    const template = Object.assign({}, templateInput, { id: faker.random.uuid() });
    this.datasource.templates.push(template);
    return { success: true, message: 'Add template successfully.', payload: template };
  }

  public publish(payload: any) {
    this.pubsub.publish(TriggerNameType.TEMPLATE_ADDED, payload);
  }
}

export { TemplateConnector };
