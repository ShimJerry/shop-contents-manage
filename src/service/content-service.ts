import { Content } from "../index.ts";
import { BaseService } from "./base-service.ts";
import {
  ComponentCollectionService,
  IComponentCollectionService,
} from "./component-collection-service.ts";

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
   * 컴포넌트 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getComponentCollectionService(): IComponentCollectionService;
}

export class ContentService
  extends BaseService<Content>
  implements IContentService
{
  private componentCollectionService: IComponentCollectionService;

  constructor(
    getter: () => Content,
    setter: (updateFn: (data: Content) => Content) => void,
  ) {
    super(getter, setter);

    // 컴포넌트 컬렉션 서비스 초기화 (Content의 components 배열을 관리)
    this.componentCollectionService = new ComponentCollectionService(
      () => this.getData().components, // getter
      (updateFn) =>
        this.updateState((prevContent) => ({
          ...prevContent,
          components: updateFn(prevContent.components),
        })), // setter
    );
  }

  /**
   * 콘텐츠 메타데이터 업데이트
   * @param updates - `id`와 `components`를 제외한 콘텐츠 메타데이터
   */
  updateContentMeta(
    updates: Partial<Omit<Content, "id" | "components">>,
  ): void {
    this.updateState((prevContent) => ({
      ...prevContent,
      ...updates,
    }));
  }

  /**
   * 현재 콘텐츠 반환
   * @returns `Content` 객체
   */
  getContent(): Content {
    return this.getData();
  }

  /**
   * 컴포넌트 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getComponentCollectionService(): IComponentCollectionService {
    return this.componentCollectionService;
  }
}
