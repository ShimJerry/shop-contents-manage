export type CommonYn = "Y" | "N";

export type DisplayPeriod = {
    startDate: Date;
    endDate: Date;
}

export type ComponentType =
    | "blank"
    | "image"
    | "product"
    | "tab"
    | "text";

export type RootComponent = {
    type: ComponentType;
    id: string;
    name: string;
    order: number;
    period: DisplayPeriod;
}

export type ItemGroup = {
    id: string;
}

export type BlankComponent = RootComponent & {
    id: string;
}

export type TabComponent = RootComponent & {
    id: string;
}

export type ProductComponent = RootComponent & {
    id: string;
}

export type ImageComponent = RootComponent & {
    id: string;
}

export type TextComponent = RootComponent & {
    id: string;
}


export type Content = {
    components: (BlankComponent | TabComponent | ProductComponent | ImageComponent | TextComponent)[];
    id: string;
    period: DisplayPeriod;
    yn: CommonYn;
    imageUrl: string;
    memo: string;
    title: string;
};



export interface ContentApi {
    /**
     * 주어진 부모 ID를 기준으로 두 개의 상품 ID를 받아서 그들의 위치를 바꿉니다.
     * @param parentId - 부모 ID (상품이 속한 그룹 ID)
     * @param productId1 - 첫 번째 상품의 ID
     * @param productId2 - 두 번째 상품의 ID
     */
    swapProductPositions: (itemGroupId: string, productId1: string, productId2: string) => void;

    /**
     * 두 개의 컴포넌트 ID를 받아서 그들의 위치를 바꿉니다.
     * @param id1 - 첫 번째 컴포넌트의 ID
     * @param id2 - 두 번째 컴포넌트의 ID
     */
    swapComponentPositions: (id1: string, id2: string) => void;
}
