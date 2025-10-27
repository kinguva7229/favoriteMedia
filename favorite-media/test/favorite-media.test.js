import { html, fixture, expect } from '@open-wc/testing';
import "../favorite-media.js";

describe("FavoriteMedia test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <favorite-media
        title="title"
      ></favorite-media>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
