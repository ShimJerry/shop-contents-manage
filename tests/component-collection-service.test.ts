import { beforeEach, describe, expect, it } from "vitest";
import { ImageComponent } from "../src";
import { createDefaultImageComponent } from "../src/default-values";
import {
  Component,
  ComponentCollectionService,
  IComponentCollectionService,
} from "../src/service/component-collection-service";

describe("ComponentCollection", () => {
  let components: Component[];
  let componentCollection: IComponentCollectionService;
  let component1: ImageComponent;
  let component2: ImageComponent;

  beforeEach(() => {
    components = [];

    // 기본 ImageComponent 생성
    component1 = createDefaultImageComponent({
      id: "comp-1",
      componentOrder: 1,
    });

    component2 = createDefaultImageComponent({
      id: "comp-2",
      componentOrder: 1,
    });

    componentCollection = new ComponentCollectionService(
      () => components,
      (updateFn) => {
        components = updateFn(components);
      },
    );

    componentCollection.addComponent(component1);
  });

  it("addComponent로 컴포넌트를 추가하면 getComponents에서 조회할 수 있어야 한다.", () => {
    expect(componentCollection.getComponents().length).toBe(1);
    expect(componentCollection.getComponents()[0].id).toEqual("comp-1");
  });

  it("getComponentById로 컴포넌트를 가져올 수 있어야 한다.", () => {
    const firstComponent = componentCollection.getComponents()[0];
    expect(componentCollection.getComponentById(firstComponent.id)).toEqual(
      component1,
    );
    expect(componentCollection.getComponentById("comp-2")).toBeUndefined();
  });

  it("updateComponent로 컴포넌트를 수정이 가능하고 불변성이 유지 되어야 한다.", () => {
    const id = component1.id;

    const beforeUpdateComponent = componentCollection.getComponentById(id);

    componentCollection.updateComponent(id, {
      componentName: "test-name",
    });

    const updatedComponent = componentCollection.getComponentById(id);

    expect(updatedComponent).toBeDefined();
    expect(updatedComponent?.componentName).toBe("test-name");

    // 불변성 유지 검증 (이전 객체와 참조값이 다르면 불변성이 유지된 것)
    expect(updatedComponent).not.toBe(beforeUpdateComponent);

    // 원본 객체가 변경되지 않았는지 확인
    expect(beforeUpdateComponent?.componentName).not.toBe("test-name");

    // `updateComponent()`가 새로운 객체를 반환했는지 검증
    expect(componentCollection.getComponents()).not.toContain(
      beforeUpdateComponent,
    );
  });

  it("deleteComponent로 컴포넌트 삭제가 가능하고, 목록에서 제외되어야 한다.", () => {
    const id = component1.id;

    expect(componentCollection.getComponents().length).toBe(1);

    componentCollection.deleteComponent(id);

    expect(componentCollection.getComponents().length).toBe(0);
  });

  it("swapPositionById로 컴포넌트의 위치를 바꿀 수 있어야 한다.", () => {
    componentCollection.addComponent(component2);

    // 스왑 전 순서 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-1");
    expect(componentCollection.getComponents()[1].id).toBe("comp-2");

    // 스왑 실행
    componentCollection.swapPositionById("comp-1", "comp-2");

    // 스왑 후 순서 변경 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-2");
    expect(componentCollection.getComponents()[1].id).toBe("comp-1");
  });

  it("swapPositionByOrder로 컴포넌트의 위치를 바꿀 수 있어야 한다.", () => {
    componentCollection.addComponent(component2);

    // 스왑 전 순서 확인 (재조회)
    let components = componentCollection.getComponents();
    expect(components[0].componentOrder).toBe(1);
    expect(components[1].componentOrder).toBe(2);

    componentCollection.swapPositionByOrder(1, 2);

    components = componentCollection.getComponents();
    expect(components[0].id).toBe("comp-2");
    expect(components[1].id).toBe("comp-1");

    // 불변성 유지 검증 (새로운 객체인지 확인)
    expect(components[0]).not.toBe(component2);
    expect(components[1]).not.toBe(component1);
  });
});
