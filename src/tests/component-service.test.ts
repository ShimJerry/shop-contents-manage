import { Component, TabComponent } from "@_types";
import { beforeEach, describe, expect, it } from "vitest";
import { ComponentCollectionService } from "../service/component-collection-service.ts";
import { createDefaultTab } from "../utils/factory";

describe("Component Service", () => {
  let componentCollection: ComponentCollectionService;

  beforeEach(() => {
    let components: Component[] = [];
    componentCollection = new ComponentCollectionService(
      () => components,
      (updateFn) => {
        components = updateFn(components);
      },
    );
  });

  it("addComponent 통해 Component 생성 시에 componentService 생성되어 가져올 수 있다.", () => {
    componentCollection.addComponent("tab", {
      tab: [
        createDefaultTab({ id: "tab-1" }),
        createDefaultTab({ id: "tab-2" }),
        createDefaultTab({ id: "tab-3" }),
      ],
    });

    const component = componentCollection.getData()[0];
    expect(componentCollection.getComponent(component.id)).toBeDefined();
  });

  it("componentCollection 추가된 컴포넌트의 탭길이가 componentService 가져온 데이터와 같다. ", () => {
    componentCollection.addComponent("tab", {
      tab: [
        createDefaultTab({ id: "tab-1" }),
        createDefaultTab({ id: "tab-2" }),
        createDefaultTab({ id: "tab-3" }),
      ],
    });

    const componentService = componentCollection.getComponent(
      componentCollection.getData()[0].id,
    );

    const data = componentService?.getData() as TabComponent;
    expect(data.tab.length).toBe(3);
  });
});
