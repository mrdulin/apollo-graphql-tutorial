type ID = string;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface IBaseModel {
  id: ID;
}

export { ID, Omit, IBaseModel };
