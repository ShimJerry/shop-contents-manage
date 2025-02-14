import { Component, ComponentMap, ComponentService } from "@_types";

/**
 * `ComponentCollectionService`을 관리하는 서비스 인터페이스
 */
export interface IComponentCollectionService {
  /**
   * 새로운 컴포넌트 추가 (타입에 따라 기본값 자동 생성)
   * @param type - 추가할 컴포넌트의 타입 (`image`, `text`, `product`, `tab`, `blank`)
   * @param overrides - 기본값을 덮어쓸 추가 옵션
   */
  addComponent<T extends keyof ComponentMap>(
    type: T,
    overrides?: Partial<Omit<ComponentMap[T], "type">>,
  ): void;

  /**
   * 특정 ID를 가진 컴포넌트를 업데이트합니다.
   * @param id - 업데이트할 컴포넌트의 ID
   * @param updates - 업데이트할 내용
   */
  updateComponent<T extends Component>(
    id: string,
    updates: Partial<Omit<T, "id" | "order">>,
  ): void;

  /**
   * 특정 ID를 가진 컴포넌트를 삭제합니다.
   * @param id - 삭제할 컴포넌트의 ID
   */
  deleteComponent(id: string): void;

  /**
   * 컴포넌트 ID가 키인 컴포넌트서비스를 가져온다.
   * @param id - 컴포넌트 id
   */
  getComponent(id: string): ComponentService | undefined;
}
