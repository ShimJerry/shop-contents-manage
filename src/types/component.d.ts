import { CommonYn, ComponentType, DisplayPeriod } from "./common";
import { TabMovingType } from "./enum";

/** 🔹 공통 Root Component */
export interface RootComponent {
  type: ComponentType;
  id: string;
  componentName: string;
  order: number;
  componentPeriod: DisplayPeriod;
}

/** 🔹 Blank Component */
export interface BlankComponent extends RootComponent {
  blank: {
    id: string;
  };
}

/** 🔹 Tab Component */
export interface TabComponent<T extends { id: string } = { id: string }>
  extends RootComponent {
  /**
   * 🔹 Sticky 여부
   * - 'Y': 고정, 'N': 비고정
   */
  stickyYn: CommonYn;

  /**
   * 🔹 탭 이동 방식
   * - `ANCHOR`, `PAGING`
   */
  tabMoving: TabMovingType;

  /**
   * 🔹 탭 리스트
   */
  tab: Array<{
    id: string;
    tabName: string;
    order: number;
    displayYn: CommonYn;
    productView: ProductView<T>;
  }>;
}

/** 🔹 Product Component */
export interface ProductComponent<T extends { id: string } = { id: string }>
  extends RootComponent {
  product: {
    id: string;
    productView: ProductView<T>;
  };
}

/** 🔹 Image Component */
export interface ImageComponent extends RootComponent {
  image: {
    id: string;
  };
}

/** 🔹 Text Component */
export interface TextComponent extends RootComponent {
  text: {
    id: string;
  };
}

export type ComponentMap = {
  image: ImageComponent;
  text: TextComponent;
  product: ProductComponent;
  tab: TabComponent;
  blank: BlankComponent;
};

export type Component =
  | BlankComponent
  | TabComponent
  | ProductComponent
  | ImageComponent
  | TextComponent;
