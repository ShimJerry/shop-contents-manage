import { Content } from "./index.ts";
import {
  ComponentCollection,
  IComponentCollection,
} from "./component-collection.ts";

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
  getComponentCollection(): IComponentCollection;
}

export class ContentService implements IContentService {
  private content: Content;
  private componentCollection: IComponentCollection;

  constructor(initialData: Content) {
    this.content = { ...initialData };
    this.componentCollection = new ComponentCollection(initialData.components);
  }

  updateContentMeta(
    updates: Partial<Omit<Content, "id" | "components">>,
  ): void {
    this.content = { ...this.content, ...updates };
  }

  getComponentCollection(): IComponentCollection {
    return this.componentCollection;
  }

  getContent(): Content {
    return this.content;
  }
}
