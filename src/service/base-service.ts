export type Setter<T> = (updateFn: (data: T) => T) => void;
export type Getter<T> = () => T;

/**
 * `BaseService`를 위한 공통 인터페이스
 */
export interface IBaseService<T> {
  /**
   * 구독을 통해 데이터 변경을 감지합니다.
   * @param listener - 데이터 변경 시 호출될 콜백 함수
   * @returns 구독 해제 함수
   */
  subscribe(listener: (data: T) => void): () => void;

  /**
   * 현재 참조 중인 데이터를 가져옵니다.
   */
  getData: () => T;
}

export class BaseService<T> implements IBaseService<T> {
  private subscribers: ((data: T) => void)[] = [];
  private readonly getter: Getter<T>;
  private readonly setter: Setter<T>;

  constructor(getter: Getter<T>, setter: Setter<T>) {
    this.getter = getter;
    this.setter = setter;
  }

  private notifySubscribers(updatedData: T) {
    this.subscribers.forEach((listener) => listener(updatedData));
  }

  subscribe(listener: (data: T) => void) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter((l) => l !== listener);
    };
  }

  protected updateState(updateFn: (data: T) => T) {
    this.setter((prev) => {
      const next = updateFn(prev);
      this.notifySubscribers(next);
      return next;
    });
  }

  getData(): T {
    return this.getter();
  }
}

/**
 * 배열 기반 컬렉션 서비스를 위한 공통 인터페이스
 */
export interface ICollectionService<T> extends IBaseService<T[]> {
  /**
   * 두 개 요소의 ID를 받아서 그들의 위치를 바꿉니다.
   * @param id1 - 첫 번째 요소의 ID
   * @param id2 - 두 번째 요소의 ID
   */
  swapPositionById(id1: string, id2: string): void;

  /**
   * 두 개의 order를 받아서 요소의 위치를 바꿉니다.
   * @param order1 - 첫 번째 요소의 order
   * @param order2 - 두 번째 요소의 order
   */
  swapPositionByOrder(order1: number, order2: number): void;

  /**
   * 특정 ID의 요소를 반환합니다.
   * @param id - 가져올 요소의 ID
   * @returns 해당 ID의 요소 또는 undefined
   */
  findById(id: string): T | undefined;
}

export abstract class BaseCollectionService<
    T extends { id: string; order: number },
  >
  extends BaseService<T[]>
  implements ICollectionService<T>
{
  swapPositionById(id1: string, id2: string): void {
    this.updateState((prev) => {
      const index1 = prev.findIndex((item) => item.id === id1);
      const index2 = prev.findIndex((item) => item.id === id2);
      if (index1 === -1 || index2 === -1) return prev;

      const newArray = [...prev];
      [newArray[index1], newArray[index2]] = [
        newArray[index2],
        newArray[index1],
      ];
      [newArray[index1].order, newArray[index2].order] = [
        newArray[index2].order,
        newArray[index1].order,
      ];
      return newArray;
    });
  }

  swapPositionByOrder(order1: number, order2: number): void {
    this.updateState((prev) => {
      const item1 = prev.find((c) => c.order === order1);
      const item2 = prev.find((c) => c.order === order2);
      if (!item1 || !item2) return prev;

      return prev
        .map((item) => {
          if (item.id === item1.id) return { ...item, order: order2 };
          if (item.id === item2.id) return { ...item, order: order1 };
          return item;
        })
        .sort((a, b) => a.order - b.order);
    });
  }

  findById(id: string): T | undefined {
    return this.getData().find((item) => item.id === id);
  }
}
