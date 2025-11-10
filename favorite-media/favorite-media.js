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
    likes: { type: Object },
    copied: { type: String }, 
  };

  constructor() {
    super();
    this.media = [];
    this.currentIndex = 0;
    this.loading = false;
    this.likes = {};
    this.copied = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadLikes();
    this.getMedia(6);
  }

  loadLikes() {
    const stored = localStorage.getItem("favoriteMediaLikes");
    if (stored) {
      try {
        this.likes = JSON.parse(stored);
      } catch {
        console.warn("Failed to parse stored likes.");
      }
    }
  }

  saveLikes() {
    localStorage.setItem("favoriteMediaLikes", JSON.stringify(this.likes));
  }

  async getMedia(count = 3, direction = "right") {
    this.loading = true;
    try {
      const resp = await fetch("/api/movies");
      if (!resp.ok) throw new Error("Fetch failed");
      const data = await resp.json();
      const movieList = data.movies;

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

  toggleLike(title, value) {
    const updatedLikes = {
      ...this.likes,
      [title]: this.likes[title] === value ? null : value,
    };
    this.likes = updatedLikes;
    this.saveLikes();
  }

  async copyLink(link, title) {
    try {
      await navigator.clipboard.writeText(link);
      this.copied = title;
      setTimeout(() => (this.copied = ""), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  render() {
    const visible = this.media.slice(this.currentIndex, this.currentIndex + 3);
    return html`
      <div class="wrapper">
        <div class="carousel">
          <button class="arrow" @click=${this.prev} ?disabled=${this.loading}>
            &#8592;
          </button>
          <div class="slides">
            ${visible.map(
              (m) => html`
                <div class="card">
                  <img
                    src=${m.image}
                    alt=${m.title}
                    loading="lazy"
                    @click=${() => window.open(m.link, "_blank")}
                  />
                  <p>${m.title}</p>
                  <div class="buttons">
                    <button
                      class="like ${this.likes[m.title] === "like"
                        ? "active"
                        : ""}"
                      @click=${() => this.toggleLike(m.title, "like")}
                    >
                      ❤️ Like
                    </button>
                    <button
                      class="dislike ${this.likes[m.title] === "dislike"
                        ? "active"
                        : ""}"
                      @click=${() => this.toggleLike(m.title, "dislike")}
                    >
                      👎 Dislike
                    </button>
                    <button
                      class="share"
                      @click=${() => this.copyLink(m.link, m.title)}
                    >
                      🔗 Share
                    </button>
                  </div>
                  ${this.copied === m.title
                    ? html`<p class="copied">Copied!</p>`
                    : ""}
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
      padding-bottom: 0.5rem;
      position: relative;
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

    .buttons {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    button.like,
    button.dislike,
    button.share {
      background: #e0e0e0;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    button.like.active {
      background: #ff4d4f;
      color: white;
    }

    button.dislike.active {
      background: #4f5d75;
      color: white;
    }

    button.like:hover:not(.active) {
      background: #ff9999;
    }

    button.dislike:hover:not(.active) {
      background: #9fa9c9;
    }

    button.share:hover {
      background: #a0d8ef;
    }

    .copied {
      color: green;
      font-size: 0.85rem;
      margin-top: 0.3rem;
      animation: fadeOut 1.2s ease-in-out forwards;
    }

    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
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

      img {
        height: 200px;
      }
    }
  `;
}

customElements.define("favorite-media", FavoriteMedia);



