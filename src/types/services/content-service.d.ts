import { Content, IBaseService, IComponentCollectionService } from "@_types";

/**
 * `Content`를 관리하는 서비스 인터페이스
 */
export interface IContentService extends IBaseService<Content> {
  /**
   * 콘텐츠의 메타데이터를 업데이트합니다.
   * 컴포넌트 리스트(components) 외의 데이터를 수정할 때 사용됩니다.
   * @param updates - 업데이트할 필드
   */
  updateContentMeta(updates: Partial<Omit<Content, "id" | "components">>): void;

  /**
   * 컴포넌트 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getComponentCollection(): IComponentCollectionService;
}
