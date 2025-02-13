import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFactory, ComponentMap } from "../src/default-values";
import {
  Component,
  ComponentCollectionService,
  IComponentCollectionService,
} from "../src/service/component-collection-service";

describe("ComponentCollectionService", () => {
  let components: Component[];
  let componentCollection: IComponentCollectionService;

  beforeEach(() => {
    components = [];

    componentCollection = new ComponentCollectionService(
      () => components,
      (updateFn) => {
        components = updateFn(components);
      },
    );

    componentCollection.addComponent("image", {
      id: "comp-1",
      order: 1,
    });
  });

  it("addComponent를 사용하여 컴포넌트를 추가하면 getComponents에서 조회할 수 있어야 한다.", () => {
    expect(componentCollection.getComponents().length).toBe(1);
    expect(componentCollection.getComponents()[0].id).toBe("comp-1");
  });

  it("findById로 특정 컴포넌트를 가져올 수 있어야 한다.", () => {
    const component = componentCollection.findById("comp-1");
    expect(component).toBeDefined();
    expect(component?.id).toBe("comp-1");
    expect(componentCollection.findById("comp-2")).toBeUndefined();
  });

  it("updateComponent를 사용하여 컴포넌트를 수정할 수 있어야 하고, 불변성이 유지되어야 한다.", () => {
    const id = "comp-1";
    const beforeUpdateComponent = componentCollection.findById(id);

    componentCollection.updateComponent(id, { componentName: "Updated Name" });

    const updatedComponent = componentCollection.findById(id);

    expect(updatedComponent).toBeDefined();
    expect(updatedComponent?.componentName).toBe("Updated Name");

    // 불변성 유지 검증 (이전 객체와 참조값이 다르면 불변성이 유지된 것)
    expect(updatedComponent).not.toBe(beforeUpdateComponent);

    // 원본 객체가 변경되지 않았는지 확인
    expect(beforeUpdateComponent?.componentName).not.toBe("Updated Name");

    // `updateComponent()`가 새로운 객체를 반환했는지 검증
    expect(componentCollection.getComponents()).not.toContain(
      beforeUpdateComponent,
    );
  });

  it("deleteComponent로 컴포넌트를 삭제할 수 있고, 목록에서 제외되어야 한다.", () => {
    expect(componentCollection.getComponents().length).toBe(1);

    componentCollection.deleteComponent("comp-1");

    expect(componentCollection.getComponents().length).toBe(0);
  });

  it("swapPositionById로 두 개의 컴포넌트 위치를 바꿀 수 있어야 한다.", () => {
    componentCollection.addComponent("image", {
      id: "comp-2",
      order: 2,
    });

    // 스왑 전 순서 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-1");
    expect(componentCollection.getComponents()[1].id).toBe("comp-2");

    // 스왑 실행
    componentCollection.swapPositionById("comp-1", "comp-2");

    // 스왑 후 순서 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-2");
    expect(componentCollection.getComponents()[1].id).toBe("comp-1");
  });

  it("swapPositionByOrder로 두 개의 컴포넌트 위치를 바꿀 수 있어야 한다.", () => {
    componentCollection.addComponent("image", {
      id: "comp-2",
      order: 2,
    });

    let components = componentCollection.getComponents();
    expect(components[0].order).toBe(1);
    expect(components[1].order).toBe(2);

    componentCollection.swapPositionByOrder(1, 2);

    components = componentCollection.getComponents();
    expect(components[0].id).toBe("comp-2");
    expect(components[1].id).toBe("comp-1");

    // 불변성 유지 검증 (새로운 객체인지 확인)
    expect(components[0]).not.toBe(components[1]);
  });

  it("유효하지 않은 ID로 swapPositionById를 호출하면 변경되지 않아야 한다.", () => {
    componentCollection.addComponent("image", {
      id: "comp-2",
      order: 2,
    });

    const beforeSwap = componentCollection.getComponents();

    componentCollection.swapPositionById("invalid-id", "comp-2");

    expect(componentCollection.getComponents()).toEqual(beforeSwap);
  });

  it("유효하지 않은 order로 swapPositionByOrder를 호출하면 변경되지 않아야 한다.", () => {
    componentCollection.addComponent("image", {
      id: "comp-2",
      order: 2,
    });

    const beforeSwap = componentCollection.getComponents();

    componentCollection.swapPositionByOrder(99, 2);

    expect(componentCollection.getComponents()).toEqual(beforeSwap);
  });

  it("유효하지 않은 ID로 deleteComponent를 호출하면 기존 목록이 유지되어야 한다.", () => {
    const beforeDelete = componentCollection.getComponents();

    componentCollection.deleteComponent("invalid-id");

    expect(componentCollection.getComponents()).toEqual(beforeDelete);
  });

  it("addComponent를 호출할 때, 올바른 타입과 매칭되는 기본 컴포넌트가 생성되어야 한다.", () => {
    Object.keys(ComponentFactory).forEach((type) => {
      componentCollection.addComponent(type as keyof ComponentMap);
      const addedComponent = componentCollection.getComponents().slice(-1)[0];
      expect(addedComponent?.type).toBe(type);
    });
  });

  it("addComponent에서 같은 ID를 가진 컴포넌트를 추가하면 덮어쓰기되지 않고 새롭게 추가되어야 한다.", () => {
    componentCollection.addComponent("image", { id: "comp-1" });

    expect(componentCollection.getComponents().length).toBe(2);
  });
});
