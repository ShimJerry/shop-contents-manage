import {
  BlankComponent,
  Component,
  ComponentMap,
  IComponentCollectionService,
  ImageComponent,
  ProductComponent,
  TabComponent,
  TextComponent,
} from "@_types";
import { ComponentFactory } from "../utils/factory";
import {
  isBlankComponent,
  isImageComponent,
  isProductComponent,
  isTabComponent,
  isTextComponent,
} from "../utils/type-guards";
import { BaseCollectionService } from "./base-collection-service";
import { ComponentService } from "./component-service";

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

  updateComponent<T extends Component>(
    id: string,
    updates: Partial<Omit<T, "id" | "order">>,
  ): void {
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

  getComponent(id: string): ComponentService | undefined {
    return this.componentServices.get(id);
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
