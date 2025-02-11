import {
  BlankComponent,
  ImageComponent,
  ProductComponent,
  RootComponent,
  TabComponent,
  TextComponent,
} from "../index.ts";

export type Component =
  | BlankComponent
  | TabComponent
  | ProductComponent
  | ImageComponent
  | TextComponent;

export function isImageComponent(
  component: Component,
): component is ImageComponent {
  return component.type === "image";
}

export function isTextComponent(
  component: Component,
): component is TextComponent {
  return component.type === "text";
}

export function isProductComponent(
  component: Component,
): component is ProductComponent {
  return component.type === "product";
}

export function isTabComponent(
  component: Component,
): component is TabComponent {
  return component.type === "tab";
}

export function isBlankComponent(
  component: Component,
): component is BlankComponent {
  return component.type === "blank";
}

/**
 * `ComponentCollectionService`을 관리하는 서비스 인터페이스
 */
export interface IComponentCollectionService {
  /**
   * 새로운 컴포넌트를 추가합니다.
   * @param component - 추가할 컴포넌트 객체
   */
  addComponent(component: Component): void;

  /**
   * 특정 ID를 가진 컴포넌트를 업데이트합니다.
   * @param id - 업데이트할 컴포넌트의 ID
   * @param updates - 업데이트할 내용
   */
  updateComponent(id: string, updates: Partial<RootComponent>): void;

  /**
   * 특정 ID를 가진 컴포넌트를 삭제합니다.
   * @param id - 삭제할 컴포넌트의 ID
   */
  deleteComponent(id: string): void;

  /**
   * 두 개의 order를 받아서 그들의 위치를 바꿉니다.
   * @param order1 - 첫 번째 컴포넌트의 order
   * @param order2 - 두 번째 컴포넌트의 order
   */
  swapPositionByOrder: (order1: number, order2: number) => void;

  /**
   * 두 개의 컴포넌트 ID를 받아서 그들의 위치를 바꿉니다.
   * @param id1 - 첫 번째 컴포넌트의 ID
   * @param id2 - 두 번째 컴포넌트의 ID
   */
  swapPositionById: (id1: string, id2: string) => void;

  /**
   * 현재 컴포넌트 목록을 반환합니다.
   */
  getComponents(): readonly Component[];

  /**
   * 특정 ID의 컴포넌트를 반환합니다.
   * @param id - 가져올 컴포넌트의 ID
   * @returns 해당 ID의 컴포넌트 또는 undefined
   */
  getComponentById(id: string): Component | undefined;

  /**
   * 특정 `TabComponent` 내에서 두 개의 `tabOrder`를 서로 교환하는 메서드
   * @param tabComponentId - `TabComponent` ID
   * @param order1 - 첫 번째 탭의 `tabOrder`
   * @param order2 - 두 번째 탭의 `tabOrder`
   */
  updateTabOrder(tabComponentId: string, order1: number, order2: number): void;
}

export type StateUpdater = (
  updateFn: (components: Component[]) => Component[],
) => void;

export class ComponentCollectionService implements IComponentCollectionService {
  private components: Component[];
  private subscribers: ((components: Component[]) => void)[] = [];
  private readonly setState?: StateUpdater;

  constructor(
    initialComponents: readonly Component[],
    setState?: StateUpdater,
  ) {
    this.components = [...initialComponents];
    this.setState = setState;
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.components));
  }

  addComponent(component: Component): void {
    const maxOrder = Math.max(
      0,
      ...this.components.map((comp) => comp.componentOrder),
    );

    this.components = [
      ...this.components,
      { ...component, componentOrder: maxOrder + 1 },
    ];
  }

  updateComponent<T extends Component>(id: string, updates: Partial<T>): void {
    this.components = this.components.map((component) =>
      component.id === id ? this.mergeComponent(component, updates) : component,
    );
  }

  deleteComponent(id: string): void {
    this.components = this.components
      .filter((component) => component.id !== id)
      .map((component, index) => ({
        ...component,
        componentOrder: index + 1,
      }));
  }

  getComponents(): readonly Component[] {
    return this.components;
  }

  swapPositionById(id1: string, id2: string): void {
    const index1 = this.components.findIndex(
      (component) => component.id === id1,
    );
    const index2 = this.components.findIndex(
      (component) => component.id === id2,
    );

    if (index1 === -1 && index2 === -1) return;

    const newComponents = [...this.components];
    [newComponents[index1], newComponents[index2]] = [
      newComponents[index2],
      newComponents[index1],
    ];
    this.components = newComponents;
  }

  swapPositionByOrder(order1: number, order2: number): void {
    const component1 = this.components.find(
      (component) => component.componentOrder === order1,
    );
    const component2 = this.components.find(
      (component) => component.componentOrder === order2,
    );

    if (!component1 || !component2) return;

    const tempOrder = component1.componentOrder;
    component1.componentOrder = component2.componentOrder;
    component2.componentOrder = tempOrder;

    this.components = [...this.components].sort(
      (a, b) => a.componentOrder - b.componentOrder,
    );
  }

  getComponentById(id: string): Component | undefined {
    return this.components.find((component) => component.id === id);
  }

  updateTabOrder(tabComponentId: string, order1: number, order2: number): void {
    this.components = this.components.map((component) => {
      if (!isTabComponent(component) || component.id !== tabComponentId) {
        return component;
      }

      const tabs = [...component.tab];

      const index1 = tabs.findIndex((tab) => tab.tabOrder === order1);
      const index2 = tabs.findIndex((tab) => tab.tabOrder === order2);

      if (index1 === -1 || index2 === -1) return component;

      // `tabOrder` 값 교환
      [tabs[index1].tabOrder, tabs[index2].tabOrder] = [
        tabs[index2].tabOrder,
        tabs[index1].tabOrder,
      ];

      return {
        ...component,
        tab: tabs.sort((a, b) => a.tabOrder - b.tabOrder), // 순서 정렬
      };
    });
  }

  private mergeComponent<T extends Component>(
    component: T,
    updates: Partial<T>,
  ): T {
    if (!updates || typeof updates !== "object") return component;

    return {
      ...component,
      ...updates,
      ...(isImageComponent(component) && {
        image: {
          ...component.image,
          ...((updates as Partial<ImageComponent>).image || {}),
        },
      }),
      ...(isTextComponent(component) && {
        text: {
          ...component.text,
          ...((updates as Partial<TextComponent>).text || {}),
        },
      }),
      ...(isProductComponent(component) && {
        product: {
          ...component.product,
          ...((updates as Partial<ProductComponent>).product || {}),
        },
      }),
      ...(isTabComponent(component) && {
        tab: (updates as Partial<TabComponent>).tab || component.tab,
      }),
      ...(isBlankComponent(component) && {
        blank: {
          ...component.blank,
          ...((updates as Partial<BlankComponent>).blank || {}),
        },
      }),
    };
  }
}
