export type IGenericMetadata = {
  name: string;
  value: string | number;
  description: string;
};

export type IGenericChoices = {
  name: string;
  value?: string | number;
  key?: string | number;
};

export type IGenericObject = {
  [key: string]: IGenericMetadata;
};

export type IGenericKeyString = {
  [key: string]: string;
};

export type IInquirerAnswers = { [key: string]: unknown };

export type chainFn = (
  prevAnswers: IInquirerAnswers
) => Promise<IInquirerAnswers> | string;

export type IFormatterFunction = (
  key: string,
  fullObject: IGenericObject
) => string | IGenericChoices;
