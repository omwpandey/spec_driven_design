import React from 'react';
import Box from '../Box';
import Typography from '../Typography';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon';
import { colors } from '@core/theme';
import { buildMonthGrid, monthName, WEEKDAY_NAMES } from '@utils/dateUtils';
import type { WorkingDay } from '../../../types/holiday.types';
import { schedulerStyles, dayTypeColors } from './SchedulerCalendar.styles';

interface LegendItem {
  label: string;
  color: string;
  border?: string;
}

const DEFAULT_LEGEND: LegendItem[] = [
  { label: 'Working day', color: dayTypeColors.working, border: colors.border.main },
  { label: 'Weekend', color: dayTypeColors.weekend },
  { label: 'Holiday', color: dayTypeColors.holiday },
  { label: 'Not editable', color: dayTypeColors.notEditable },
];

interface WorkingDayCalendarProps {
  /** 1-based month (1 = January). */
  month: number;
  year: number;
  /** Day metadata keyed by ISO date (YYYY-MM-DD). */
  days?: Record<string, WorkingDay>;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  /** Fired when an editable, in-month day cell is clicked. */
  onDayClick?: (isoDate: string, day: WorkingDay | undefined) => void;
  showLegend?: boolean;
  showNav?: boolean;
}

/**
 * WorkingDayCalendar
 *
 * A month grid (Sunday–Saturday) that renders working days, weekends,
 * holidays and non-editable days, with optional "call plan" and holiday
 * tags per cell. Presentation-only: pass `days` metadata and handle clicks
 * via `onDayClick`. Data loading/saving lives in the container.
 */
const WorkingDayCalendar: React.FC<WorkingDayCalendarProps> = ({
  month,
  year,
  days = {},
  onPrevMonth,
  onNextMonth,
  onDayClick,
  showLegend = true,
  showNav = true,
}) => {
  const cells = buildMonthGrid(month, year);

  return (
    <Box>
      {(showNav || showLegend) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 1.5,
          }}
        >
          {showNav && (
            <Box sx={schedulerStyles.monthNav}>
              <ChevronLeftIcon
                role="button"
                aria-label="Previous month"
                onClick={onPrevMonth}
                sx={{ fontSize: 20, cursor: 'pointer', color: colors.text.secondary }}
              />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, px: 0.5 }}>
                {monthName(month)} {year}
              </Typography>
              <ChevronRightIcon
                role="button"
                aria-label="Next month"
                onClick={onNextMonth}
                sx={{ fontSize: 20, cursor: 'pointer', color: colors.text.secondary }}
              />
            </Box>
          )}

          {showLegend && (
            <Box sx={schedulerStyles.legendRow}>
              {DEFAULT_LEGEND.map((item) => (
                <Box key={item.label} sx={schedulerStyles.legendItem}>
                  <Box sx={schedulerStyles.legendSwatch(item.color, item.border)} />
                  <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Weekday header */}
      <Box sx={schedulerStyles.weekdayHeaderRow}>
        {WEEKDAY_NAMES.map((wd) => (
          <Typography key={wd} component="div" sx={schedulerStyles.weekdayHeaderCell}>
            {wd}
          </Typography>
        ))}
      </Box>

      {/* Day grid */}
      <Box sx={schedulerStyles.grid}>
        {cells.map((cell) => {
          const meta = days[cell.date];
          const editable = meta?.editable ?? cell.inCurrentMonth;
          const clickable = Boolean(onDayClick);
          const isHoliday = meta?.type === 'holiday' || Boolean(meta?.holiday);

          return (
            <Box
              key={cell.date}
              sx={schedulerStyles.dayCell({
                weekend: cell.weekend,
                inMonth: cell.inCurrentMonth,
                editable,
                clickable,
              })}
              onClick={
                clickable && editable && cell.inCurrentMonth
                  ? () => onDayClick?.(cell.date, meta)
                  : undefined
              }
            >
              <Typography
                component="span"
                sx={schedulerStyles.dayNumber({
                  inMonth: cell.inCurrentMonth,
                  weekend: cell.weekend || isHoliday,
                })}
              >
                {cell.day}
              </Typography>

              {meta?.callPlanTag && (
                <Box component="span" sx={schedulerStyles.callPlanTag}>
                  {meta.callPlanTag}
                </Box>
              )}

              {isHoliday && meta?.holiday && (
                <Box component="span" sx={schedulerStyles.holidayTag}>
                  {meta.holiday.additionalRemark || formatRemark(meta.holiday.remark)}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

/** Turn a HolidayRemark enum into a short display label. */
function formatRemark(remark: string): string {
  return remark
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default WorkingDayCalendar;
