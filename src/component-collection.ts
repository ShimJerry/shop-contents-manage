import {BlankComponent, ImageComponent, ProductComponent, RootComponent, TabComponent, TextComponent} from "./index.ts";

export interface IComponentCollection {
    /**
     * 새로운 컴포넌트를 추가합니다.
     * @param component - 추가할 컴포넌트 객체
     */
    addComponent(component: BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent): void;

    /**
     * 특정 ID를 가진 컴포넌트를 업데이트합니다.
     * @param id - 업데이트할 컴포넌트의 ID
     * @param updates - 업데이트할 내용
     */
    updateComponent(id: string, updates: Partial<RootComponent>): void;

    /**
     * 특정 ID를 가진 컴포넌트를 삭제합니다.
     * @param id - 삭제할 컴포넌트의 ID
     */
    deleteComponent(id: string): void;

    /**
     * 두 개의 컴포넌트 ID를 받아서 그들의 위치를 바꿉니다.
     * @param id1 - 첫 번째 컴포넌트의 ID
     * @param id2 - 두 번째 컴포넌트의 ID
     */
    swapComponentPositions: (id1: string, id2: string) => void;

    /**
     * 현재 컴포넌트 목록을 반환합니다.
     */
    getComponents(): readonly (BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent)[];
}


export class ComponentCollection implements IComponentCollection {
    private components: readonly (BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent)[];

    constructor(
        initialComponents: readonly (BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent)[],
    ) {
        this.components = [...initialComponents]
    }

    addComponent(component: BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent): void {
    }

    updateComponent(id: string, updates: Partial<RootComponent>): void {
    }

    deleteComponent(id: string): void {
    }

    getComponents(): readonly (BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent)[] {
        return this.components;
    }

    swapComponentPositions(id1: string, id2: string): void {
    }
}
