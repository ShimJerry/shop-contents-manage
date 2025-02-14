import { BadgeType, ListType, OrderType, ViewExtensionType } from "./enum";

/**
 * 상품 목록에서 **더보기 버튼 클릭 시** 추가 상품을 로드하는 방식을 정의하는 타입
 *
 * 이 타입은 상품 목록이 **초기 로딩 이후**에 사용자가 "더보기" 버튼을 눌렀을 때,
 * 추가 상품을 불러오는 **규칙과 동작 방식**을 정의합니다.
 *
 * 주요 기능:
 * - **상품의 초기 노출 개수 및 추가 로드 개수 설정**
 * - **더보기 버튼을 몇 번까지 클릭할 수 있는지(`maxLoadMoreClicks`) 설정**
 * - **클릭 가능 횟수 초과 후 특정 동작 수행(`extensionType`)**
 * - **상품 목록의 정렬 방식 및 표시 형식 설정**
 * - **더보기 버튼 클릭 시 외부 URL 이동 가능 (`buttonLinkUrl`)**
 *
 * @template T - 상품 객체의 타입 (각 상품 객체는 `id: string` 속성을 필수로 가져야 함)
 */
export interface ProductView<T extends { id: string }> {
  /**
   * 고유한 상품 보기 ID
   * - 해당 `ProductView` 객체를 식별하는 고유한 ID입니다.
   */
  id: string;

  /**
   * 상품 목록의 정렬 및 표시 방식
   * - `None`: 정렬 없음
   * - `Column`: 세로 정렬 (리스트형)
   * - `Row`: 가로 정렬 (가로 스크롤)
   * - `Grid_One`: 1열 그리드
   * - `Grid_Two`: 2열 그리드
   *
   * 상품이 어떻게 정렬되고 표시될지 결정하는 설정입니다.
   */
  listType: ListType;

  /**
   * 상품에 표시할 배지 유형
   * - `All`: 모든 배지 표시
   * - `Like`: 좋아요 배지
   * - `None`: 배지 없음
   * - `Ranking`: 랭킹 배지
   *
   * 상품 목록에서 각 상품에 적용할 배지 스타일을 결정합니다.
   */
  badgeType: BadgeType;

  /**
   * 상품 정렬 기준
   * - `HighDiscount`: 높은 할인율 순
   * - `HighPrice`: 높은 가격 순
   * - `LowDiscount`: 낮은 할인율 순
   * - `LowPrice`: 낮은 가격 순
   * - `None`: 정렬 없음
   * - `Recent`: 최신 상품 순
   * - `Recommend`: 추천 순
   * - `Review`: 리뷰 많은 순
   *
   * 상품이 목록에서 어떻게 정렬될지를 정의합니다.
   */
  orderType: OrderType;

  /**
   * "더보기" 버튼에 표시될 텍스트
   * - 사용자가 추가 상품을 불러오기 위해 클릭할 버튼의 텍스트
   * - 예: "더보기", "상품 더보기", "더 많은 상품 보기" 등
   */
  buttonLabel: string;

  /**
   * 최대 클릭 횟수 도달 후 표시될 버튼 텍스트
   * - `extensionType`이 적용될 때 변경되는 버튼 라벨
   * - 예: `"전체 상품 보러가기"`, `"더 많은 상품 보기"` 등
   * - `extensionType === "NONE"`일 경우에는 버튼이 숨겨질 수도 있음
   */
  extensionButtonLabel: string;

  /**
   * "더보기" 버튼 클릭 시 이동할 URL (옵션)
   * - `extensionType`이 `"LINKING"`인 경우에만 사용됩니다.
   * - **외부 페이지 이동이 필요한 경우 이 값을 설정해야 합니다.**
   * - 다른 `extensionType`에서는 필요하지 않음.
   */
  buttonLinkUrl?: string;

  /**
   * 최초 노출될 상품 개수
   * - 사용자가 페이지 로드 시 기본적으로 볼 수 있는 상품 수
   * - **초기 상태에서 보여줄 상품 개수를 정의합니다.**
   */
  initialVisibleCount: number;

  /**
   * "더보기" 버튼 클릭 시 추가로 노출될 상품 개수
   * - 한 번 클릭하면 몇 개의 상품이 추가로 보여질지를 결정합니다.
   */
  incrementCount: number;

  /**
   * "더보기" 버튼 클릭 가능한 최대 횟수
   * - 사용자가 **최대 몇 번까지 더보기 버튼을 클릭할 수 있는지** 설정합니다.
   * - `currentClickCount`가 `maxLoadMoreClicks`에 도달하면, `extensionType`에 따라 동작이 실행됨.
   *
   * 예시:
   * - `maxLoadMoreClicks = 3` → 더보기 버튼을 3번 클릭하면 더 이상 로드되지 않음.
   */
  maxLoadMoreClicks: number;

  /**
   * "더보기" 버튼 클릭 가능 횟수를 초과했을 때 실행할 동작 유형
   * - `ViewExtensionType.None`: 더보기 종료 후 아무 동작 없음
   * - `ViewExtensionType.Linking`: 더보기 종료 후 지정된 URL(`buttonLinkUrl`)로 이동
   * - `ViewExtensionType.Page`: 더보기 종료 후 내부 페이지로 이동
   *
   * 사용자가 설정된 최대 클릭 횟수(`maxLoadMoreClicks`)에 도달했을 때의 동작을 정의합니다.
   */
  extensionType: ViewExtensionType;

  /**
   * 정렬된 상품 목록
   * - `id` 속성을 포함하는 객체 배열이어야 함
   * - `orderType`에 따라 정렬될 수 있음
   * - **초기 상태에서 `initialVisibleCount`만큼 먼저 보여지고, 추가 클릭 시 `incrementCount`만큼 더 로드됨**
   */
  sortItem: T[];
}
