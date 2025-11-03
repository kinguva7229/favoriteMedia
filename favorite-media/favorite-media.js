/**
 * Copyright 2025 kinguva7229
 * @license Apache-2.0
 */
import { LitElement, html, css } from "lit";

export class FavoriteMedia extends LitElement {
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
        <h2>Media Carousel</h2>
        <div class="carousel">
          <button class="arrow" @click=${this.prev} ?disabled=${this.loading}>&#8592;</button>
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
          <button class="arrow" @click=${this.next} ?disabled=${this.loading}>&#8594;</button>
        </div>
        ${this.loading ? html`<p class="loading">Loading new media...</p>` : ""}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .wrapper {
      padding: 1.5rem;
      max-width: 950px;
      margin: 0 auto;
      text-align: center;
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    .carousel {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .arrow {
      font-size: 2rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #007acc;
      transition: transform 0.2s ease;
    }

    .arrow:hover:not(:disabled) {
      transform: scale(1.2);
      color: #005fa3;
    }

    .arrow:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .slides {
      display: flex;
      gap: 1rem;
      overflow: hidden;
      width: 800px;
      transition: transform 0.4s ease-in-out;
    }

    .card {
      flex: 1 0 250px;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: scale(1.03);
    }

    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      display: block;
    }

    p {
      margin: 0.5rem 0;
      font-weight: bold;
    }

    .loading {
      margin-top: 1rem;
      font-style: italic;
      color: #666;
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
        font-size: 1.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      img {
        height: 200px;
      }
    }
  `;
}

customElements.define("favorite-media", FavoriteMedia);
