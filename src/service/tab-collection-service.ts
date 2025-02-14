import { ITabCollectionService, TabComponent } from "@_types";
import { createDefaultTab } from "../utils/factory";
import { BaseCollectionService } from "./base-collection-service";

export class TabCollectionService
  extends BaseCollectionService<TabComponent["tab"][0]>
  implements ITabCollectionService
{
  addTab(overrides: Partial<TabComponent["tab"][0]> = {}): void {
    this.updateState((prevTabs) => {
      return [
        ...prevTabs,
        {
          ...createDefaultTab({
            ...overrides,
            order: Math.max(0, ...prevTabs.map((comp) => comp.order)) + 1,
          }),
        },
      ];
    });
  }

  updateTab(
    id: string,
    overrides: Partial<Omit<TabComponent["tab"][0], "id" | "order">>,
  ): void {
    this.updateState((prevTabs) => {
      return prevTabs.map((tab) =>
        tab.id === id ? { ...tab, ...overrides } : tab,
      );
    });
  }

  deleteTab(id: string): void {
    this.updateState((prevTabs) => {
      return prevTabs
        .filter((tab) => tab.id !== id)
        .map((tab, index) => ({
          ...tab,
          order: index + 1,
        }));
    });
  }
}
