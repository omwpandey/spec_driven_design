import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';
import Tooltip from '../Tooltip';

export interface EllipsisTextProps extends Omit<MuiTypographyProps, 'children'> {
  /** The text content. Used both for display and as the tooltip title when clipped. */
  children: React.ReactNode;
  /**
   * Number of lines to show before clamping. Defaults to 1 (single-line ellipsis).
   * Values > 1 use multi-line clamping (-webkit-line-clamp).
   */
  lines?: number;
  /** Tooltip placement. Defaults to 'top'. */
  tooltipPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
  /** Override the tooltip text. Defaults to the string form of `children`. */
  tooltipTitle?: string;
}

/** Extract a plain string from arbitrary React children for use as tooltip text. */
const toText = (node: React.ReactNode): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  if (React.isValidElement(node)) {
    return toText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
};

/** True only when the element's content is actually clipped by the ellipsis. */
const isElementClipped = (el: HTMLElement | null, lines: number): boolean => {
  if (!el) return false;
  // A small tolerance avoids false positives from sub-pixel rounding.
  return lines > 1
    ? el.scrollHeight - el.clientHeight > 1
    : el.scrollWidth - el.clientWidth > 1;
};

/**
 * Text that truncates with an ellipsis and shows a tooltip with the full text
 * ONLY when the text is actually clipped at the current rendered size.
 *
 * Overflow is measured against the real DOM box and re-evaluated on resize and
 * on hover, so the tooltip appears based on the available screen space (not a
 * fixed rule) and never appears when the full text is visible.
 */
const EllipsisText: React.FC<EllipsisTextProps> = ({
  children,
  lines = 1,
  tooltipPlacement = 'top',
  tooltipTitle,
  sx,
  ...typographyProps
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isClipped, setIsClipped] = useState(false);

  const measure = useCallback(() => {
    setIsClipped(isElementClipped(ref.current, lines));
  }, [lines]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, children]);

  // Re-measure right before a hover could open the tooltip. This guarantees the
  // tooltip is suppressed whenever the text currently fits, regardless of any
  // stale state from earlier layout passes.
  const handleEnter = useCallback(() => {
    setIsClipped(isElementClipped(ref.current, lines));
  }, [lines]);

  const clampSx =
    lines > 1
      ? {
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          wordBreak: 'break-word' as const,
        }
      : {
          // Block display gives the element a real, constrained width so
          // scrollWidth vs clientWidth is meaningful (an inline span reports 0).
          display: 'block',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' as const,
        };

  const content = (
    <MuiTypography
      ref={ref as React.Ref<HTMLElement>}
      component="span"
      onMouseEnter={handleEnter}
      {...typographyProps}
      sx={[clampSx, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </MuiTypography>
  );

  if (!isClipped) return content;

  return (
    <Tooltip title={tooltipTitle ?? toText(children)} placement={tooltipPlacement}>
      {content}
    </Tooltip>
  );
};

export default EllipsisText;
