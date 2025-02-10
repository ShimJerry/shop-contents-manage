import {
  Component,
  ComponentCollectionService,
  IComponentCollectionService,
} from "./component-collection-service.ts";
import { Content, RootComponent } from "./index.ts";

/**
 * `Content`를 관리하는 서비스 인터페이스
 */
export interface IContentService {
  /**
   * 콘텐츠의 메타데이터를 업데이트합니다.
   * 컴포넌트 리스트(components) 외의 데이터를 수정할 때 사용됩니다.
   * @param updates - 업데이트할 필드
   */
  updateContentMeta(updates: Partial<Omit<Content, "id" | "components">>): void;

  /**
   * 현재 Content 객체를 반환합니다.
   * @returns 현재 콘텐츠 정보
   */
  getContent(): Content;

  /**
   * ComponentManager를 반환하여 컴포넌트 관리를 수행할 수 있도록 합니다.
   * @returns ComponentManager 인터페이스
   */
  getComponentCollection(): IComponentCollectionService;

  /**
   * `ComponentCollectionService`를 통해 컴포넌트를 추가합니다.
   * @param component - 추가할 컴포넌트 객체
   */
  addComponent(component: Component): void;

  /**
   * `ComponentCollectionService`를 통해 특정 ID의 컴포넌트를 업데이트합니다.
   * @param id - 업데이트할 컴포넌트의 ID
   * @param updates - 업데이트할 내용
   */
  updateComponent(id: string, updates: Partial<RootComponent>): void;

  /**
   * `ComponentCollectionService`를 통해 특정 ID의 컴포넌트를 삭제합니다.
   * @param id - 삭제할 컴포넌트의 ID
   */
  deleteComponent(id: string): void;

  /**
   * `ComponentCollectionService`를 통해 두 개의 컴포넌트 위치를 변경합니다.
   * @param id1 - 첫 번째 컴포넌트의 ID
   * @param id2 - 두 번째 컴포넌트의 ID
   */
  swapComponentPositions(id1: string, id2: string): void;

  /**
   * `ComponentCollectionService`를 통해 현재 등록된 모든 컴포넌트를 조회합니다.
   */
  getComponents(): readonly Component[];

  /**
   * `ComponentCollectionService`를 통해 특정 ID의 컴포넌트를 조회합니다.
   * @param id - 가져올 컴포넌트의 ID
   * @returns 해당 ID의 컴포넌트 또는 undefined
   */
  getComponentById(id: string): Component | undefined;
}

export class ContentService implements IContentService {
  private content: Content;
  private readonly componentCollection: IComponentCollectionService;

  constructor(initialData: Content) {
    this.content = { ...initialData };
    this.componentCollection = new ComponentCollectionService(
      initialData.components,
    );
  }

  updateContentMeta(
    updates: Partial<Omit<Content, "id" | "components">>,
  ): void {
    this.content = { ...this.content, ...updates };
  }

  getComponentCollection(): IComponentCollectionService {
    return this.componentCollection;
  }

  getContent(): Content {
    return this.content;
  }

  addComponent(component: Component): void {
    this.componentCollection.addComponent(component);
  }

  updateComponent(id: string, updates: Partial<RootComponent>): void {
    this.componentCollection.updateComponent(id, updates);
  }

  deleteComponent(id: string): void {
    this.componentCollection.deleteComponent(id);
  }

  swapComponentPositions(id1: string, id2: string): void {
    this.componentCollection.swapComponentPositions(id1, id2);
  }

  getComponents(): readonly Component[] {
    return this.componentCollection.getComponents();
  }

  getComponentById(id: string): Component | undefined {
    return this.componentCollection.getComponentById(id);
  }
}
