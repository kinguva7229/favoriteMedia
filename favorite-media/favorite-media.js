/**
 * Copyright 2025 kinguva7229
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

export class FavoriteMedia extends LitElement {
  static get properties() {
    return {
      foxes: { type: Array },
      currentIndex: { type: Number },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.foxes = [];
    this.currentIndex = 0;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getFoxes(6); // load initial images
  }

  // ✅ updated to support both directions
  getFoxes(count = 3, direction = "right") {
    this.loading = true;
    const newFoxes = [];
    let completed = 0;

    for (let i = 0; i < count; i++) {
      fetch("https://randomfox.ca/floof/")
        .then((resp) => resp.ok && resp.json())
        .then((data) => {
          if (data) {
            newFoxes.push({ image: data.image, link: data.link });
          }
        })
        .catch((err) => console.error("Error fetching fox:", err))
        .finally(() => {
          completed++;
          if (completed === count) {
            // ✅ prepend or append based on direction
            if (direction === "left") {
              this.foxes = [...newFoxes, ...this.foxes];
              // shift index forward so visible window stays aligned
              this.currentIndex += count;
            } else {
              this.foxes = [...this.foxes, ...newFoxes];
            }
            this.loading = false;
          }
        });
    }
  }

  next() {
    // if we're at the end, fetch 3 more to the right
    if (this.currentIndex + 3 >= this.foxes.length) {
      this.getFoxes(3, "right");
    }
    this.currentIndex = Math.min(this.currentIndex + 1, this.foxes.length - 3);
  }

  prev() {
    // if we're at the beginning, fetch 3 more to the left
    if (this.currentIndex <= 0) {
      this.getFoxes(3, "left");
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }
  }

  render() {
    const visibleFoxes = this.foxes.slice(
      this.currentIndex,
      this.currentIndex + 3
    );

    return html`
      <div class="wrapper">
        <h2>Fox Carousel</h2>

        <div class="carousel">
          <button class="arrow" @click=${this.prev} ?disabled=${this.loading}>
            &#8592;
          </button>

          <div class="slides">
            ${visibleFoxes.map(
              (fox) => html`
                <div
                  class="card"
                  @click=${() => window.open(fox.link, "_blank")}
                >
                  <img src=${fox.image} alt="Fox" loading="lazy" />
                </div>
              `
            )}
          </div>

          <button class="arrow" @click=${this.next} ?disabled=${this.loading}>
            &#8594;
          </button>
        </div>

        ${this.loading
          ? html`<p class="loading">Loading new foxes...</p>`
          : ""}
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
      background-color: #f5f5f5;
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
        width: 80%;
      }
    }
  `;
}

globalThis.customElements.define("favorite-media", FavoriteMedia);


