import {
  BlankComponent,
  ImageComponent,
  ProductComponent,
  RootComponent,
  TabComponent,
  TextComponent,
} from "./index.ts";

export type Component =
  | BlankComponent
  | TabComponent
  | ProductComponent
  | ImageComponent
  | TextComponent;

export interface IComponentCollection {
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
   * 두 개의 컴포넌트 ID를 받아서 그들의 위치를 바꿉니다.
   * @param id1 - 첫 번째 컴포넌트의 ID
   * @param id2 - 두 번째 컴포넌트의 ID
   */
  swapComponentPositions: (id1: string, id2: string) => void;

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

export class ComponentCollection implements IComponentCollection {
  private components: readonly Component[];

  constructor(initialComponents: readonly Component[]) {
    this.components = [...initialComponents];
  }

  addComponent(component: Component): void {
    this.components = [...this.components, component];
  }

  updateComponent(id: string, updates: Partial<RootComponent>): void {
    this.components = this.components.map((component) =>
      component.id === id ? { ...component, ...updates } : component,
    );
  }

  deleteComponent(id: string): void {
    this.components = this.components.filter(
      (component) => component.id !== id,
    );
  }

  getComponents(): readonly Component[] {
    return this.components;
  }

  swapComponentPositions(id1: string, id2: string): void {
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

  getComponentById(id: string): Component | undefined {
    return this.components.find((component) => component.id === id);
  }
}
