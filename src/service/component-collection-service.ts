import {
  BlankComponent,
  ImageComponent,
  ProductComponent,
  RootComponent,
  TabComponent,
  TextComponent,
} from "../index.ts";
import { BaseService } from "./base-service.ts";

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
}

export type Setter = (
  updateFn: (components: Component[]) => Component[],
) => void;

export type Getter = () => Component[];

export class ComponentCollectionService
  extends BaseService<Component[]>
  implements IComponentCollectionService
{
  constructor(getter: Getter, setter: Setter) {
    super(getter, setter);
  }

  addComponent(component: Component): void {
    this.updateState((prevComponents) => {
      return [
        ...prevComponents,
        {
          ...component,
          componentOrder:
            Math.max(0, ...prevComponents.map((comp) => comp.componentOrder)) +
            1,
        },
      ];
    });
  }

  updateComponent<T extends Component>(id: string, updates: Partial<T>): void {
    this.updateState((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? this.mergeComponent(component, updates)
          : component,
      ),
    );
  }

  deleteComponent(id: string): void {
    this.updateState((prevComponents) => {
      return prevComponents
        .filter((component) => component.id !== id)
        .map((component, index) => ({
          ...component,
          componentOrder: index + 1,
        }));
    });
  }

  getComponents(): readonly Component[] {
    return this.getData();
  }

  swapPositionById(id1: string, id2: string): void {
    this.updateState((prevComponents) => {
      const index1 = prevComponents.findIndex((c) => c.id === id1);
      const index2 = prevComponents.findIndex((c) => c.id === id2);

      if (index1 === -1 || index2 === -1) return prevComponents; // 한 개라도 못 찾으면 원래 배열 유지

      return prevComponents.map((component, index) => {
        if (index === index1) {
          return {
            ...prevComponents[index2],
            componentOrder: prevComponents[index1].componentOrder,
          };
        }
        if (index === index2) {
          return {
            ...prevComponents[index1],
            componentOrder: prevComponents[index2].componentOrder,
          };
        }
        return component;
      });
    });
  }

  swapPositionByOrder(order1: number, order2: number): void {
    this.updateState((prevComponents) => {
      const component1 = prevComponents.find(
        (c) => c.componentOrder === order1,
      );
      const component2 = prevComponents.find(
        (c) => c.componentOrder === order2,
      );

      if (!component1 || !component2) return prevComponents; // 한 개라도 못 찾으면 원래 배열 유지

      return prevComponents
        .map((component) => {
          if (component.id === component1.id) {
            return { ...component, componentOrder: order2 };
          }
          if (component.id === component2.id) {
            return { ...component, componentOrder: order1 };
          }
          return component;
        })
        .sort((a, b) => a.componentOrder - b.componentOrder); // 순서 정렬
    });
  }

  getComponentById(id: string): Component | undefined {
    return this.getData().find((component) => component.id === id);
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
