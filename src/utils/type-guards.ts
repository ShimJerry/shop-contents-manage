import {
  BlankComponent,
  Component,
  ImageComponent,
  ProductComponent,
  TabComponent,
  TextComponent,
} from "@_types";

export function isImageComponent(
  component: Component,
): component is ImageComponent {
  return component.type === "image";
}

export function isTextComponent(
  component: Component,
): component is TextComponent {
  return component.type === "text";
}

export function isProductComponent(
  component: Component,
): component is ProductComponent {
  return component.type === "product";
}

export function isTabComponent(
  component: Component,
): component is TabComponent {
  return component.type === "tab";
}

export function isBlankComponent(
  component: Component,
): component is BlankComponent {
  return component.type === "blank";
}
