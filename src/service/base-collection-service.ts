import { ICollectionService } from "@_types";
import { BaseService } from "./base-service";

export class BaseCollectionService<T extends { id: string; order: number }>
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
