export type CommonYn = "Y" | "N";

export type DisplayPeriod = {
  startDate: Date;
  endDate: Date;
};

export type ComponentType = "blank" | "image" | "product" | "tab" | "text";

export type RootComponent = {
  type: ComponentType;
  id: string;
  componentName: string;
  componentOrder: number;
  componentPeriod: DisplayPeriod;
};

export enum ViewExtensionType {
  None = "NONE", // 더보기 종료 후 아무 동작 없음
  Linking = "LINKING", // 더보기 종료 후 외부 링크 이동
  Page = "PAGE", // 더보기 종료 후 내부 페이지 이동
}

export enum ListType {
  None = "NONE",
  Column = "COLUMN",
  Row = "ROW",
  Grid_One = "GRID_ONE",
  Grid_Two = "GRID_TWO",
}

export enum OrderType {
  HighDiscount = "HIGH_DISCOUNT",
  HighPrice = "HIGH_PRICE",
  LowDiscount = "LOW_DISCOUNT",
  LowPrice = "LOW_PRICE",
  None = "NONE",
  Recent = "RECENT",
  Recommend = "RECOMMEND",
  Review = "REVIEW",
}

export enum BadgeType {
  All = "ALL",
  Like = "LIKE",
  None = "NONE",
  Ranking = "RANKING",
}

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

export type BlankComponent = RootComponent & {
  blank: {
    id: string;
  };
};

export enum TabMovingType {
  Anchor = "ANCHOR",
  Paging = "PAGING",
}

/**
 * 탭을 포함하는 컴포넌트 타입
 * - 여러 개의 탭을 가질 수 있으며, 각 탭은 특정 상품 목록(`ProductView`)을 포함합니다.
 */
export type TabComponent<T extends { id: string } = { id: string }> =
  RootComponent & {
    /**
     * 탭 목록 배열
     * - 하나 이상의 탭을 포함하며, 각 탭은 상품 목록을 관리합니다.
     */
    tab: {
      /**
       * 탭의 고유 ID
       * - 해당 `TabComponent` 내에서 특정 탭을 식별하는 고유한 ID입니다.
       */
      id: string;

      /**
       * 탭의 이름
       * - 사용자에게 표시될 탭의 이름입니다.
       * - 예: "베스트", "신상품", "인기상품" 등
       */
      tabName: string;

      /**
       * 탭의 정렬 순서
       * - 숫자가 작을수록 먼저 표시됩니다.
       * - 같은 `TabComponent` 내에서 탭의 위치를 정의하는 값입니다.
       */
      tabOrder: number;

      /**
       * 탭 이동 방식
       * - `ANCHOR`: 특정 영역으로 스크롤 이동
       * - `PAGING`: 보여지는 영역을 다음페이지 상품들로 교체
       * - 탭을 클릭했을 때의 동작 방식이 결정됩니다.
       */
      tabMoving: TabMovingType;

      /**
       * 탭의 표시 여부
       * - 'Y': 탭이 활성화되어 보이는 상태
       * - 'N': 탭이 비활성화되어 숨겨진 상태
       */
      displayYn: CommonYn;

      /**
       * 탭의 고정 여부 (Sticky 기능)
       * - 'Y': 사용자가 스크롤을 내릴 때 상단에 고정됨
       * - 'N': 일반적인 동작, 스크롤 시 함께 이동
       */
      stickyYn: CommonYn;

      /**
       * 해당 탭에서 보여줄 상품 목록 설정
       * - 개별 탭에서 노출할 상품을 정의하는 `ProductView`
       */
      productView: ProductView<T>;
    }[];
  };

export type ProductComponent<T extends { id: string } = { id: string }> =
  RootComponent & {
    product: {
      id: string;
      /**
       * 해당 컴포넌트에서 보여줄 상품 목록 설정 `ProductView`
       */
      productView: ProductView<T>;
    };
  };

export type ImageComponent = RootComponent & {
  image: {
    id: string;
  };
};

export type TextComponent = RootComponent & {
  text: {
    id: string;
  };
};

export interface Content {
  /**
   * 고유 콘텐츠 ID
   * - 콘텐츠를 식별하는 고유한 ID입니다.
   */
  readonly id: string;

  /**
   * 콘텐츠의 제목
   * - 콘텐츠의 제목을 나타냅니다.
   */
  readonly title: string;

  /**
   * 콘텐츠의 이미지 URL
   * - 콘텐츠와 관련된 이미지를 나타내는 URL입니다.
   */
  readonly imageUrl: string;

  /**
   * 콘텐츠의 표시 기간
   * - 콘텐츠가 표시되는 기간을 나타냅니다.
   */
  readonly period: DisplayPeriod;

  /**
   * 콘텐츠의 표시 여부
   * - 'Y' 또는 'N' 값으로 콘텐츠가 활성화되어 있는지 나타냅니다.
   */
  readonly yn: CommonYn;

  /**
   * 콘텐츠의 메모
   * - 콘텐츠에 대한 설명이나 추가 정보를 담을 수 있는 메모입니다.
   */
  readonly memo: string;

  /**
   * 콘텐츠를 구성하는 컴포넌트들
   * - `BlankComponent`, `TabComponent`, `ProductComponent`, `ImageComponent`, `TextComponent` 등 다양한 타입의 컴포넌트를 포함하는 배열입니다.
   * - 배열 자체를 수정할 수 없도록 `readonly` 키워드를 추가합니다.
   */
  readonly components: readonly (
    | BlankComponent
    | TabComponent
    | ProductComponent
    | ImageComponent
    | TextComponent
  )[];
}
