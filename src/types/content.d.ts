import { CommonYn, DisplayPeriod } from "./common";
import {
  BlankComponent,
  ImageComponent,
  ProductComponent,
  TabComponent,
  TextComponent,
} from "./component";

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
   */
  readonly components: (
    | BlankComponent
    | TabComponent
    | ProductComponent
    | ImageComponent
    | TextComponent
  )[];
}
