import {
  BadgeType,
  BlankComponent,
  ComponentMap,
  Content,
  ImageComponent,
  ListType,
  OrderType,
  ProductComponent,
  ProductView,
  RootComponent,
  TabComponent,
  TabMovingType,
  TextComponent,
  ViewExtensionType,
} from "@_types";
import { v4 as uuidv4 } from "uuid";

/**
 * `Content` 객체를 생성하는 함수
 */
export function createDefaultContent(
  overrides: Partial<Content> = {},
): Content {
  return {
    id: uuidv4(),
    title: "",
    imageUrl: "",
    period: {
      startDate: new Date(),
      endDate: new Date(),
    },
    yn: "Y",
    memo: "",
    components: [],
    ...overrides, // 전달된 값이 있으면 덮어쓰기
  };
}

/**
 * `RootComponent` 기본값을 생성하는 함수
 */
export function createDefaultRootComponent(
  overrides: Partial<Omit<RootComponent, "type">> = {},
): Omit<RootComponent, "type"> {
  return {
    id: uuidv4(),
    componentName: "Root Component",
    order: 1,
    componentPeriod: {
      startDate: new Date(),
      endDate: new Date(),
    },
    ...overrides,
  };
}

/**
 * `ImageComponent` 기본값을 생성하는 함수
 */
export function createDefaultImageComponent(
  overrides: Partial<ImageComponent> = {},
): ImageComponent {
  return {
    ...createDefaultRootComponent(),
    type: "image",
    image: {
      id: uuidv4(),
    },
    ...overrides,
  };
}

/**
 * `ProductComponent` 기본값을 생성하는 함수
 */
export function createDefaultProductComponent<
  T extends { id: string } = { id: string },
>(overrides: Partial<ProductComponent<T>> = {}): ProductComponent<T> {
  return {
    ...createDefaultRootComponent(),
    type: "product",
    product: {
      id: uuidv4(),
      productView: createDefaultProductView<T>(),
    },
    ...overrides,
  };
}

/**
 * `TextComponent` 기본값을 생성하는 함수
 */
export function createDefaultTextComponent(
  overrides: Partial<TextComponent> = {},
): TextComponent {
  return {
    ...createDefaultRootComponent(),
    type: "text",
    text: {
      id: uuidv4(),
    },
    ...overrides,
  };
}

/**
 * `BlankComponent` 기본값을 생성하는 함수
 */
export function createDefaultBlankComponent(
  overrides: Partial<BlankComponent> = {},
): BlankComponent {
  return {
    ...createDefaultRootComponent(),
    type: "blank",
    blank: {
      id: uuidv4(),
    },
    ...overrides,
  };
}

/**
 * `ProductView` 기본값을 생성하는 함수
 */
export function createDefaultProductView<
  T extends { id: string } = { id: string },
>(overrides: Partial<ProductView<T>> = {}): ProductView<T> {
  return {
    id: uuidv4(),
    listType: ListType.Grid_One,
    badgeType: BadgeType.None,
    orderType: OrderType.Recommend,
    buttonLabel: "더보기",
    extensionButtonLabel: "전체 상품 보러가기",
    initialVisibleCount: 10,
    incrementCount: 10,
    maxLoadMoreClicks: 5,
    extensionType: ViewExtensionType.None,
    sortItem: [],
    ...overrides,
  };
}

/**
 * 기본 탭 객체를 생성하는 함수
 */
export function createDefaultTab<T extends { id: string } = { id: string }>(
  overrides: Partial<TabComponent<T>["tab"][0]> = {},
): TabComponent<T>["tab"][0] {
  return {
    id: uuidv4(),
    tabName: "",
    order: 0,
    displayYn: "Y",
    productView: createDefaultProductView<T>(),
    ...overrides,
  };
}

/**
 * `TabComponent` 기본값을 생성하는 함수
 */
export function createDefaultTabComponent<
  T extends { id: string } = { id: string },
>(overrides: Partial<TabComponent<T>> = {}): TabComponent<T> {
  return {
    ...createDefaultRootComponent(),
    tabMoving: TabMovingType.Anchor,
    stickyYn: "N",
    type: "tab",
    tab: [],
    ...overrides,
  };
}

// ✅ Component 타입과 생성 함수를 매핑하는 Factory 객체
export const ComponentFactory: {
  [K in keyof ComponentMap]: (
    overrides?: Partial<Omit<ComponentMap[K], "type">>,
  ) => ComponentMap[K];
} = {
  image: createDefaultImageComponent,
  text: createDefaultTextComponent,
  product: createDefaultProductComponent,
  tab: createDefaultTabComponent,
  blank: createDefaultBlankComponent,
};
