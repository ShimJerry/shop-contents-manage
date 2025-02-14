import { Content, IComponentCollectionService, IContentService } from "@_types";
import { BaseService } from "./base-service";
import { ComponentCollectionService } from "./component-collection-service";

export class ContentService
  extends BaseService<Content>
  implements IContentService
{
  private readonly componentCollectionService: IComponentCollectionService;

  constructor(
    getter: () => Content,
    setter: (updateFn: (data: Content) => Content) => void,
  ) {
    super(getter, setter);
    this.componentCollectionService = new ComponentCollectionService(
      () => this.getData().components,
      (updateFn) =>
        this.updateState((prevContent) => ({
          ...prevContent,
          components: updateFn(prevContent.components),
        })),
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
   * 컴포넌트 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getComponentCollection(): IComponentCollectionService {
    return this.componentCollectionService;
  }
}
