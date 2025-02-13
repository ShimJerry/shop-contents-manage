import { ComponentFactory, ComponentMap } from "../default-values.ts";
import {
  BlankComponent,
  ImageComponent,
  ProductComponent,
  RootComponent,
  TabComponent,
  TextComponent,
} from "../index.ts";
import { BaseCollectionService } from "./base-service.ts";
import { ComponentService } from "./component-service.ts";

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
export interface IComponentCollectionService
  extends BaseCollectionService<Component> {
  /**
   * 새로운 컴포넌트 추가 (타입에 따라 기본값 자동 생성)
   * @param type - 추가할 컴포넌트의 타입 (`image`, `text`, `product`, `tab`, `blank`)
   * @param overrides - 기본값을 덮어쓸 추가 옵션
   */
  addComponent<T extends keyof ComponentMap>(
    type: T,
    overrides?: Partial<Omit<ComponentMap[T], "type">>,
  ): void;

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
   * 현재 컴포넌트 목록을 반환합니다.
   */
  getComponents(): readonly Component[];
}

export class ComponentCollectionService
  extends BaseCollectionService<Component>
  implements IComponentCollectionService
{
  private componentServices: Map<string, ComponentService> = new Map();

  constructor(
    getter: () => Component[],
    setter: (updateFn: (components: Component[]) => Component[]) => void,
  ) {
    super(getter, setter);
  }

  addComponent<T extends keyof ComponentMap>(
    type: T,
    overrides?: Partial<Omit<ComponentMap[T], "type">>,
  ): void {
    this.updateState((prevComponents) => {
      // 현재 가장 높은 order 값 찾기
      const maxOrder = Math.max(0, ...prevComponents.map((comp) => comp.order));

      const newComponent: ComponentMap[T] = {
        ...ComponentFactory[type](overrides),
        order: maxOrder + 1,
      };

      newComponent.order = maxOrder + 1;

      const componentService = new ComponentService(
        () => this.findById(newComponent.id) ?? newComponent,
        (updateFn) =>
          this.updateState((prev) =>
            prev.map((comp) =>
              comp.id === newComponent.id ? updateFn(comp) : comp,
            ),
          ),
      );

      this.componentServices.set(newComponent.id, componentService);

      return [...prevComponents, newComponent];
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
      this.componentServices.delete(id);
      return prevComponents
        .filter((component) => component.id !== id)
        .map((component, index) => ({
          ...component,
          order: index + 1,
        }));
    });
  }

  getComponents(): readonly Component[] {
    return this.getData();
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
