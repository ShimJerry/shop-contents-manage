import {
  Component,
  Getter,
  IComponentService,
  ITabCollectionService,
  Setter,
  TabComponent,
} from "@_types";
import { isTabComponent } from "../utils/type-guards";
import { BaseService } from "./base-service";
import { TabCollectionService } from "./tab-collection-service";

export class ComponentService
  extends BaseService<Component>
  implements IComponentService
{
  private readonly tabCollectionService?: ITabCollectionService;

  constructor(getter: Getter<Component>, setter: Setter<Component>) {
    super(getter, setter);

    if (isTabComponent(getter())) {
      const tabComponent = getter() as TabComponent;
      this.tabCollectionService = new TabCollectionService(
        () => {
          return tabComponent.tab;
        },
        (updateFn) => {
          tabComponent.tab = updateFn(tabComponent.tab);
        },
      );
    }
  }

  /**
   * 컴포넌트 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getTabCollection(): ITabCollectionService | undefined {
    return this.tabCollectionService;
  }
}
