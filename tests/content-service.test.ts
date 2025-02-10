import { beforeEach, describe, expect, it } from "vitest";
import { Content } from "../src";
import { ComponentCollectionService } from "../src/component-collection-service";
import { ContentService, IContentService } from "../src/content-service";

describe("ContentService", () => {
  let contentService: IContentService;
  let sampleContent: Content;

  beforeEach(() => {
    sampleContent = {
      id: "content-1",
      title: "Sample Content",
      imageUrl: "https://example.com/image.png",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      },
      yn: "Y",
      memo: "This is a test content",
      components: [],
    };

    contentService = new ContentService(sampleContent);
  });

  it("초기 컨텐츠 데이터를 가져올 수 있어야 한다.", () => {
    expect(contentService.getContent()).toEqual(sampleContent);
  });

  it("컨텐츠의 메타데이터를 수정할 수 있어야 한다.", () => {
    contentService.updateContentMeta({ title: "Updated Title" });
    expect(contentService.getContent().title).toBe("Updated Title");
  });

  it("컴포넌트 컬렉션을 가져올 수 있어야 한다.", () => {
    expect(contentService.getComponentCollection()).toBeInstanceOf(
      ComponentCollectionService,
    );
  });
});
