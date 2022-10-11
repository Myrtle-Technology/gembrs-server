export class CustomFieldAttributes {
  min?: number;
  max?: number;
  hidden?: boolean;
  [key: string]: any;

  constructor(data?: Partial<CustomFieldAttributes>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
