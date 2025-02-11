import { TabComponent } from "../index.ts";

export interface ITabService {
  /**
   * 특정 `TabComponent`에서 `tabId`를 가진 탭을 삭제합니다.
   * @param tabComponentId - `TabComponent`의 ID
   * @param tabId - 삭제할 탭의 ID
   */
  addTab(tabComponentId: string, obj: Partial<TabComponent["tab"][0]>): void;

  /**
   * 특정 `TabComponent`에서 `tabId`를 가진 탭을 삭제합니다.
   * @param tabComponentId - `TabComponent`의 ID
   * @param tabId - 삭제할 탭의 ID
   */
  deleteTab(tabComponentId: string, tabId: string): void;

  /**
   * 두 개의 `tabOrder` 값을 교환하여 탭 순서를 변경합니다.
   * @param tabComponentId - `TabComponent`의 ID
   * @param tabOrder1 - 변경할 첫 번째 탭의 `tabOrder`
   * @param tabOrder2 - 변경할 두 번째 탭의 `tabOrder`
   */
  swapTabOrder(
    tabComponentId: string,
    tabOrder1: number,
    tabOrder2: number,
  ): void;
}
