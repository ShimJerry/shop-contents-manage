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
