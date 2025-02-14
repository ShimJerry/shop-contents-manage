import { ITabCollectionService } from "./tab-collection-service";

export interface IComponentService {
  /**
   * 탭 컬렉션 서비스 반환
   * @returns `ComponentCollectionService` 인스턴스
   */
  getTabCollection(tabId: string): ITabCollectionService | undefined;
}
