import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, it } from "vitest";
import {
  createDefaultProductComponent,
  createDefaultProductView,
  createDefaultTab,
  createDefaultTabComponent,
} from "../src/default-values";
import {
  ComponentCollectionService,
  IComponentCollectionService,
} from "../src/service/component-collection-service";
import {
  IProductViewService,
  ProductViewService,
} from "../src/service/product-view-service";

describe("ProductViewService", () => {
  let componentCollectionService: IComponentCollectionService;
  let productViewService: IProductViewService;

  beforeEach(() => {
    componentCollectionService = new ComponentCollectionService([
      createDefaultTabComponent({
        tab: [
          createDefaultTab({
            productView: createDefaultProductView({
              sortItem: [{ id: "t-item1" }, { id: "t-item2" }],
            }),
          }),
        ],
      }),
      createDefaultProductComponent({
        componentOrder: 1,
        product: {
          id: uuidv4(),
          productView: createDefaultProductView({
            sortItem: [{ id: "p-item1" }, { id: "p-item2" }],
          }),
        },
      }),
    ]);
    productViewService = new ProductViewService(componentCollectionService);
  });

  it("getProductView로 component의 productView를 가져올 수 있어야 한다.", () => {});

  it("updateProductView로 component의 productView를 수정할 수 있어야한다.");
});
