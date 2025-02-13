import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseService } from "../src/service/base-service";

// 테스트에 사용할 더미 데이터 타입
interface TestData {
  value: number;
}

describe("BaseService", () => {
  let data: TestData;
  let getter: () => TestData;
  let setter: (updateFn: (data: TestData) => TestData) => void;
  let service: BaseService<TestData>;

  beforeEach(() => {
    // 초기 상태 설정
    data = { value: 0 };

    // Getter는 현재 data를 반환
    getter = () => data;

    // Setter는 data를 업데이트
    setter = (updateFn) => {
      data = updateFn(data);
    };

    // BaseService 인스턴스 생성
    service = new BaseService<TestData>(getter, setter);
  });

  it("초기 데이터를 올바르게 가져와야 한다", () => {
    expect(service["getData"]()).toEqual({ value: 0 });
  });

  it("updateState를 호출하면 상태가 업데이트되어야 한다", () => {
    service["updateState"]((prev) => ({ value: prev.value + 1 }));
    expect(service["getData"]()).toEqual({ value: 1 });

    service["updateState"]((prev) => ({ value: prev.value + 2 }));
    expect(service["getData"]()).toEqual({ value: 3 });
  });

  it("subscribe를 통해 상태 변경을 감지할 수 있어야 한다", () => {
    const callback = vi.fn(); // Mock 함수 생성

    const unsubscribe = service.subscribe(callback);

    // 상태 변경
    service["updateState"]((prev) => ({ value: prev.value + 5 }));

    // 구독자에게 올바른 값이 전달되었는지 확인
    expect(callback).toHaveBeenCalledWith({ value: 5 });

    // 한 번만 호출되었는지 확인
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe(); // 구독 해제
  });

  it("unsubscribe를 호출하면 이후 상태 변경을 감지하지 않아야 한다", () => {
    const callback = vi.fn();

    const unsubscribe = service.subscribe(callback);

    // 상태 변경 1
    service["updateState"]((prev) => ({ value: prev.value + 3 }));
    expect(callback).toHaveBeenCalledWith({ value: 3 });

    // 구독 해제
    unsubscribe();

    // 상태 변경 2 (이후 콜백이 호출되면 안 됨)
    service["updateState"]((prev) => ({ value: prev.value + 2 }));

    // 두 번째 상태 변경 이후 호출되지 않아야 함
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("BaseService (배열 상태 테스트)", () => {
  let arrayData: TestData[];
  let arrayGetter: () => TestData[];
  let arraySetter: (updateFn: (data: TestData[]) => TestData[]) => void;
  let arrayService: BaseService<TestData[]>;

  beforeEach(() => {
    // 초기 배열 데이터 설정
    arrayData = [{ value: 1 }, { value: 2 }, { value: 3 }];

    // Getter는 현재 배열을 반환
    arrayGetter = () => arrayData;

    // Setter는 배열을 업데이트
    arraySetter = (updateFn) => {
      arrayData = updateFn(arrayData);
    };

    // BaseService 인스턴스 생성
    arrayService = new BaseService<TestData[]>(arrayGetter, arraySetter);
  });

  it("초기 배열 데이터를 올바르게 가져와야 한다", () => {
    expect(arrayService["getData"]()).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]);
  });

  it("배열에 새로운 요소를 추가할 수 있어야 한다", () => {
    arrayService["updateState"]((prev) => [...prev, { value: 4 }]);

    expect(arrayService["getData"]().length).toBe(4);
    expect(arrayService["getData"]()).toContainEqual({ value: 4 });
  });

  it("배열의 요소를 삭제할 수 있어야 한다", () => {
    arrayService["updateState"]((prev) => prev.slice(0, -1)); // 마지막 요소 삭제

    expect(arrayService["getData"]().length).toBe(2);
    expect(arrayService["getData"]()).not.toContainEqual({ value: 3 });
  });

  it("배열의 특정 요소를 업데이트할 수 있어야 한다", () => {
    arrayService["updateState"]((prev) =>
      prev.map((item) => (item.value === 2 ? { ...item, value: 10 } : item)),
    );

    expect(arrayService["getData"]()).toContainEqual({ value: 10 });
    expect(arrayService["getData"]()).not.toContainEqual({ value: 2 });
  });

  it("subscribe를 통해 상태 변경을 감지할 수 있어야 한다", () => {
    const callback = vi.fn();

    const unsubscribe = arrayService.subscribe(callback);

    // 새로운 요소 추가
    arrayService["updateState"]((prev) => [...prev, { value: 5 }]);

    expect(callback).toHaveBeenCalledWith([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 5 },
    ]);
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it("unsubscribe를 호출하면 이후 상태 변경을 감지하지 않아야 한다", () => {
    const callback = vi.fn();
    const unsubscribe = arrayService.subscribe(callback);

    // 첫 번째 변경
    arrayService["updateState"]((prev) => [...prev, { value: 6 }]);
    expect(callback).toHaveBeenCalledWith([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 6 },
    ]);

    // 구독 해제
    unsubscribe();

    // 두 번째 변경 (이후 콜백이 호출되면 안 됨)
    arrayService["updateState"]((prev) => [...prev, { value: 7 }]);

    // 두 번째 변경 이후에는 `callback`이 호출되지 않아야 함
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("배열 상태 변경 시 요소 순서가 유지되어야 한다", () => {
    arrayService["updateState"]((prev) => prev.reverse());

    expect(arrayService["getData"]()).toEqual([
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ]);
  });
});
