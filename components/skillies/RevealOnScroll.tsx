"use client";

/**
 * RevealOnScroll · lightweight one-shot fade-up wrapper.
 *
 * Wraps any children and, the first time the wrapper enters the
 * viewport, toggles `is-visible` on the root so the `.sk-fade-up`
 * (and optionally `.sk-stagger`) primitives in `app/globals.css`
 * play their reveal transition. The IntersectionObserver is then
 * disconnected — reveal is one-shot.
 *
 * No Framer Motion dependency on purpose; the transition is a pure
 * CSS one driven by the `.is-visible` class. This keeps the primitive
 * cheap to drop into long pages.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  type JSX,
} from "react";

export type RevealOnScrollProps = {
  children: ReactNode;
  /**
   * If true, the wrapper additionally gets the `sk-stagger` class so
   * its direct children animate in sequence rather than as a single
   * group.
   */
  stagger?: boolean;
  /**
   * IntersectionObserver `rootMargin`. Default `"0px 0px -10% 0px"` so
   * the reveal fires slightly before the element bottoms-in fully.
   */
  rootMargin?: string;
  /**
   * IntersectionObserver `threshold`. Default `0.1`.
   */
  threshold?: number;
  /**
   * HTML tag to render as. Default `"div"`.
   */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export default function RevealOnScroll({
  children,
  stagger = false,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.1,
  as = "div",
  className = "",
}: RevealOnScrollProps) {
  const nodeRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Hoist the observer-attach logic so it can be (re)bound from a
  // callback ref. Using a callback ref instead of `useRef`-as-prop
  // sidesteps the React 19 rule that flags refs threaded through
  // arbitrary functions during render.
  const attach = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      nodeRef.current = node;
      if (!node) return;

      // Already revealed — no need to re-observe.
      if (isVisible) return;

      // Older runtimes lacking IntersectionObserver: reveal once.
      if (typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
              observerRef.current = null;
              break;
            }
          }
        },
        { rootMargin, threshold },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [isVisible, rootMargin, threshold],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const composedClassName = [
    "sk-fade-up",
    stagger ? "sk-stagger" : "",
    isVisible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Aliasing the dynamic tag name to a Capitalized local turns it
  // into a JSX component reference, so `ref={attach}` is parsed as a
  // standard ref attribute (no `createElement` indirection that would
  // trip the react-hooks/refs lint).
  const Tag = as as ElementType;
  return (
    <Tag ref={attach} className={composedClassName}>
      {children}
    </Tag>
  );
}
