import { TabComponent } from "@_types";

export interface ITabCollectionService {
  /**
   * Collection의 마지막 order로 tab을 생성하여 줍니다.
   */
  addTab(overrides: Partial<TabComponent["tab"][0]>): void;

  /**
   * 특정 `TabComponent`에서 `tabId`를 가진 탭을 수정합니다.
   * @param id - 수정할 탭의 ID
   */
  updateTab(
    id: string,
    overrides: Partial<Omit<TabComponent["tab"][0], "id" | "order">>,
  ): void;

  /**
   * 특정 `TabComponent`에서 `tabId`를 가진 탭을 삭제합니다.
   * @param id - 삭제할 탭의 ID
   */
  deleteTab(id: string): void;
}
