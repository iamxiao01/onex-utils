import { EventTarget } from '../EventTarget';
import { throttle } from '../utils/trottle';

/**
 * A global service that monitors the window size and scroll position.
 */
export class Viewport extends EventTarget {
  static readonly instance = new Viewport();

  /**
     * The current scroll position.
     */
  scrollTop = 0;

  /**
     * The previous scrollTop.
     */
  lastY = 0;

  /**
     * The width of the window.
     */
  width = 0;

  /**
     * The height of the window.
     */
  height = 0;

  /**
     * The toolbar (contains the search input).
     */
  toolbar: HTMLDivElement;

  /**
     * Boolean indicating whether the toolbar is shown.
     */
  showToolbar = true;

  /**
     * The sticky side nav that contains members of the current page.
     */
  secondaryNav: HTMLElement;

  /**
     * Create new Viewport instance.
     */
  constructor() {
    super();

    this.toolbar = (
      document.querySelector('.tsd-page-toolbar')
    ) as HTMLDivElement;
    this.secondaryNav = (
      document.querySelector('.tsd-navigation.secondary')
    ) as HTMLElement;

    window.addEventListener(
      'scroll',
      throttle(() => this.onScroll(), 10),
    );
    window.addEventListener(
      'resize',
      throttle(() => this.onResize(), 10),
    );

    this.onResize();
    this.onScroll();
  }

  /**
     * Trigger a resize event.
     */
  triggerResize() {
    const event = new CustomEvent('resize', {
      detail: {
        width: this.width,
        height: this.height,
      },
    });

    this.dispatchEvent(event);
  }

  /**
     * Triggered when the size of the window has changed.
     */
  onResize() {
    this.width = window.innerWidth || 0;
    this.height = window.innerHeight || 0;

    const event = new CustomEvent('resize', {
      detail: {
        width: this.width,
        height: this.height,
      },
    });

    this.dispatchEvent(event);
  }

  /**
     * Triggered when the user scrolled the viewport.
     */
  onScroll() {
    this.scrollTop = window.scrollY || 0;

    const event = new CustomEvent('scroll', {
      detail: {
        scrollTop: this.scrollTop,
      },
    });

    this.dispatchEvent(event);
    this.hideShowToolbar();
  }

  /**
     * Handle hiding/showing of the toolbar.
     */
  hideShowToolbar() {
    const isShown = this.showToolbar;
    this.showToolbar = this.lastY >= this.scrollTop || this.scrollTop === 0;
    if (isShown !== this.showToolbar) {
      this.toolbar.classList.toggle('tsd-page-toolbar--hide');
      this.secondaryNav.classList.toggle('tsd-navigation--toolbar-hide');
    }
    this.lastY = this.scrollTop;
  }
}
