/**
 * Copyright 2025 kinguva7229
 * @license Apache-2.0
 */
import { html, css, LitElement } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class FavoriteMedia extends DDDSuper(LitElement) {
  static get tag() {
    return "favorite-media";
  }

  static properties = {
    media: { type: Array },
    currentIndex: { type: Number },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.media = [];
    this.currentIndex = 0;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getMedia(6);
  }

  async getMedia(count = 3, direction = "right") {
    this.loading = true;
    try {
      const resp = await fetch("/data/movies.json");
      if (!resp.ok) throw new Error("Fetch failed");
      const data = await resp.json();
      const movieList = Array.isArray(data.movies) ? data.movies : data;

      const newMedia = movieList.map((m) => ({
        image: m.src,
        link: m.src,
        title: m.title,
      }));

      if (direction === "left") {
        this.media = [...newMedia, ...this.media];
        this.currentIndex += count;
      } else {
        this.media = [...this.media, ...newMedia];
      }
    } catch (e) {
      console.error("Error fetching media:", e);
    } finally {
      this.loading = false;
    }
  }

  next() {
    if (this.currentIndex + 3 >= this.media.length) this.getMedia(3, "right");
    this.currentIndex = Math.min(this.currentIndex + 1, this.media.length - 3);
  }

  prev() {
    if (this.currentIndex <= 0) this.getMedia(3, "left");
    else this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }

  render() {
    const visible = this.media.slice(this.currentIndex, this.currentIndex + 3);
    return html`
      <div class="wrapper">
        <h2 class="ddd-heading">Media Carousel</h2>
        <div class="carousel">
          <button class="arrow" @click=${this.prev} ?disabled=${this.loading}>
            &#8592;
          </button>
          <div class="slides">
            ${visible.map(
              (m) => html`
                <div class="card" @click=${() => window.open(m.link, "_blank")}>
                  <img src=${m.image} alt=${m.title} loading="lazy" />
                  <p>${m.title}</p>
                </div>
              `
            )}
          </div>
          <button class="arrow" @click=${this.next} ?disabled=${this.loading}>
            &#8594;
          </button>
        </div>
        ${this.loading ? html`<p class="loading">Loading new media...</p>` : ""}
      </div>
    `;
  }

  static styles = [
    super.styles,
    css`
      :host {
        display: block;
        font-family: var(--ddd-font-navigation);
        background-color: var(--ddd-theme-background);
        color: var(--ddd-theme-primary);
      }

      .wrapper {
        padding: var(--ddd-spacing-4);
        max-width: 950px;
        margin: 0 auto;
        text-align: center;
        background: var(--ddd-theme-surface);
        border-radius: var(--ddd-radius-xl);
        box-shadow: var(--ddd-box-shadow-sm);
      }

      h2.ddd-heading {
        margin-bottom: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-xxl);
        color: var(--ddd-theme-primary);
      }

      .carousel {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ddd-spacing-3);
      }

      .arrow {
        font-size: var(--ddd-font-size-xxl);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--ddd-theme-primary);
        transition: transform 0.2s ease, color 0.2s ease;
      }

      .arrow:hover:not(:disabled) {
        transform: scale(1.2);
        color: var(--ddd-theme-accent);
      }

      .arrow:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .slides {
        display: flex;
        gap: var(--ddd-spacing-3);
        overflow: hidden;
        width: 800px;
        transition: transform 0.4s ease-in-out;
      }

      .card {
        flex: 1 0 250px;
        border-radius: var(--ddd-radius-lg);
        overflow: hidden;
        background: var(--ddd-theme-background);
        cursor: pointer;
        box-shadow: var(--ddd-box-shadow-md);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }

      .card:hover {
        transform: scale(1.03);
        box-shadow: var(--ddd-box-shadow-lg);
      }

      img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
      }

      p {
        margin: var(--ddd-spacing-1) 0;
        font-weight: bold;
        color: var(--ddd-theme-primary);
      }

      .loading {
        margin-top: var(--ddd-spacing-2);
        font-style: italic;
        color: var(--ddd-theme-secondary);
      }

      @media (max-width: 800px) {
        .slides {
          width: 100%;
          flex-direction: column;
          align-items: center;
        }

        .card {
          width: 85%;
        }

        .arrow {
          font-size: var(--ddd-font-size-xl);
        }

        h2.ddd-heading {
          font-size: var(--ddd-font-size-xl);
        }

        img {
          height: 200px;
        }
      }
    `,
  ];
}

customElements.define(FavoriteMedia.tag, FavoriteMedia);

