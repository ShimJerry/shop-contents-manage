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

export enum TabMovingType {
  Anchor = "ANCHOR",
  Paging = "PAGING",
}
