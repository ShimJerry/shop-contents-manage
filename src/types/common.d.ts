export type CommonYn = "Y" | "N";
export type DisplayPeriod = {
  startDate: Date;
  endDate: Date;
};
export type ComponentType = "blank" | "image" | "product" | "tab" | "text";
export type Setter<T> = (updateFn: (data: T) => T) => void;
export type Getter<T> = () => T;
