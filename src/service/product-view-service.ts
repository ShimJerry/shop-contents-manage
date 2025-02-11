import { ProductView } from "../index.ts";
import { IComponentCollectionService } from "./component-collection-service.ts";

/**
 * `ProductView`를 관리하는 서비스 인터페이스
 */
export interface IProductViewService<
  T extends { id: string } = { id: string },
> {
  /**
   * 특정 ID를 가진 `ProductView`를 조회합니다.
   * @param params - 조회를 위한 파라미터 객체
   *   - `componentId`: `TabComponent` 또는 `ProductComponent`의 ID
   *   - `tabId`: `TabComponent` 내 특정 탭을 식별하는 ID (옵션)
   */
  getProductView(params: {
    componentId: string;
    tabId?: string;
  }): ProductView<T> | undefined;

  /**
   * 특정 `ProductView`를 업데이트합니다.
   * @param params - 업데이트를 위한 파라미터 객체
   *   - `componentId`: `TabComponent` 또는 `ProductComponent`의 ID
   *   - `updates`: 업데이트할 `ProductView` 속성들
   *   - `tabId`: `TabComponent` 내 특정 탭을 식별하는 ID (옵션)
   */
  updateProductView(params: {
    componentId: string;
    updates: Partial<ProductView<T>>;
    tabId?: string;
  }): void;

  /**
   * 특정 `ProductView`의 상품 목록을 업데이트합니다.
   * @param params - 상품 목록 업데이트를 위한 파라미터 객체
   *   - `componentId`: `TabComponent` 또는 `ProductComponent`의 ID
   *   - `items`: 새로운 상품 목록
   *   - `tabId`: `TabComponent` 내 특정 탭을 식별하는 ID (옵션)
   */
  updateProductViewItems(params: {
    componentId: string;
    items: T[];
    tabId?: string;
  }): void;
}

/**
 * `ProductView`를 관리하는 서비스 구현체
 */
export class ProductViewService<T extends { id: string }>
  implements IProductViewService<T>
{
  private componentCollection: IComponentCollectionService;

  constructor(componentCollection: IComponentCollectionService) {
    this.componentCollection = componentCollection;
  }

  /**
   * 특정 `ProductComponent` 또는 `TabComponent`의 `ProductView`를 조회
   */
  getProductView({
    componentId,
    tabId,
  }: {
    componentId: string;
    tabId?: string;
  }): ProductView<T> | undefined {}

  /**
   * 특정 `ProductComponent` 또는 `TabComponent`의 `ProductView` 업데이트
   */
  updateProductView({
    componentId,
    updates,
    tabId,
  }: {
    componentId: string;
    updates: Partial<ProductView<T>>;
    tabId?: string;
  }): void {}

  /**
   * 특정 `ProductView`의 상품 목록을 업데이트
   */
  updateProductViewItems({
    componentId,
    items,
    tabId,
  }: {
    componentId: string;
    items: T[];
    tabId?: string;
  }): void {}
}
