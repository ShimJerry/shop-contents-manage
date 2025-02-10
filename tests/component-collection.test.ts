import { beforeEach, describe, expect, it } from "vitest";
import { ImageComponent } from "../src";
import {
  ComponentCollectionService,
  IComponentCollectionService,
} from "../src/component-collection-service";

describe("ComponentCollection", () => {
  let componentCollection: IComponentCollectionService;
  let imageComponent: ImageComponent;

  beforeEach(() => {
    componentCollection = new ComponentCollectionService([]);

    imageComponent = {
      id: "comp-1",
      type: "image",
      componentName: "image-comp",
      componentOrder: 1,
      image: {
        id: "image-comp-1",
      },
      componentPeriod: {
        startDate: new Date(),
        endDate: new Date(),
      },
    };
    componentCollection.addComponent(imageComponent);
  });

  it("초기 컴포넌트는 빈배열이어야 한다.", () => {
    const emptyCollection = new ComponentCollectionService([]);
    expect(emptyCollection.getComponents()).toBeInstanceOf(Array);
    expect(emptyCollection.getComponents().length).toBe(0);
  });

  it("addComponent로 컴포넌트를 추가하면 getComponents에서 조회할 수 있어야 한다.", () => {
    expect(componentCollection.getComponents().length).toBe(1);
    expect(componentCollection.getComponents()[0]).toEqual(imageComponent);
  });

  it("getComponentById로 컴포넌트를 가져올 수 있어야 한다.", () => {
    expect(componentCollection.getComponentById("comp-1")).toEqual(
      imageComponent,
    );
    expect(componentCollection.getComponentById("comp-2")).toBeUndefined();
  });

  it("updateComponent로 컴포넌트를 수정이 가능하고 불변성이 유지 되어야 한다.", () => {
    const id = imageComponent.id;

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
    const id = imageComponent.id;

    expect(componentCollection.getComponents().length).toBe(1);

    componentCollection.deleteComponent(id);

    expect(componentCollection.getComponents().length).toBe(0);
  });

  it("swapComponentPositions로 컴포넌트의 위치를 바꿀 수 있어야 한다.", () => {
    const component2: ImageComponent = {
      id: "comp-2",
      type: "image",
      componentName: "image-comp-2",
      componentOrder: 2,
      image: {
        id: "image-comp-2",
      },
      componentPeriod: {
        startDate: new Date(),
        endDate: new Date(),
      },
    };

    componentCollection.addComponent(component2);

    // 스왑 전 순서 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-1");
    expect(componentCollection.getComponents()[1].id).toBe("comp-2");

    // 스왑 실행
    componentCollection.swapComponentPositions("comp-1", "comp-2");

    // 스왑 후 순서 변경 확인
    expect(componentCollection.getComponents()[0].id).toBe("comp-2");
    expect(componentCollection.getComponents()[1].id).toBe("comp-1");
  });
});
