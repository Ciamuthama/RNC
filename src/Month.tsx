import { View, Text } from 'react-native';
import React, { memo, useMemo } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  lastDayOfMonth,
} from 'date-fns';
import { useCalenderContext } from './context';
import { DayLabels } from './DayLabels';
import Week from './Week';

export const MonthPage = memo(({ index }: { index: number }) => {
  const {
    referenceDate,
    HeaderComponent,
    MonthComponent,
    theme,
    weekStartsOn,
  } = useCalenderContext();
  const firstDayOfMonth = useMemo(
    () => addMonths(referenceDate, index),
    [referenceDate, index]
  );
  firstDayOfMonth.setDate(1);
  const lastDayOfMonths = useMemo(
    () => lastDayOfMonth(firstDayOfMonth),
    [firstDayOfMonth]
  );

  const headerText = format(firstDayOfMonth, theme.headerDateFormat);
  const weekStarts = useMemo(
    () =>
      eachWeekOfInterval(
        {
          start: firstDayOfMonth,
          end: lastDayOfMonths,
        },
        {
          weekStartsOn,
        }
      ),
    [firstDayOfMonth, lastDayOfMonths, weekStartsOn]
  );

  const weeks = useMemo(
    () =>
      weekStarts.map((week) => {
        return eachDayOfInterval({ start: week, end: addDays(week, 6) });
      }),
    [weekStarts]
  );

  return (
    <View>
      {HeaderComponent ? (
        <HeaderComponent
          startDate={firstDayOfMonth}
          endDate={lastDayOfMonths}
        />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: theme.headerFontSize,
              fontFamily: theme.headerFontFamily,
              color: theme.headerFontColor,
              textTransform: theme.headerTextTransform,
            }}
          >
            {headerText}
          </Text>
        </View>
      )}
      <DayLabels daysOfWeek={weeks[0]} />
      {MonthComponent ? (
        <MonthComponent weeks={weeks} firstDayOfMonth={firstDayOfMonth} />
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {weeks.map((week) => {
              return (
                <Week
                  key={`week-${week[0].toISOString()}`}
                  days={week}
                  firstDayOfMonth={firstDayOfMonth}
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
});
