import { View, Text } from 'react-native';
import React, { memo, useMemo } from 'react';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  isSameMonth,
} from 'date-fns';
import { useCalenderContext } from './context';
import { DayWrapper } from './Day';
import { DayLabels } from './DayLabels';


const Week = ({
  days,
  firstDayOfMonth,
}: {
  days: Date[];
  firstDayOfMonth: Date;
}) => {
  const { WeekComponent } = useCalenderContext();

  return WeekComponent ? (
    <WeekComponent days={days} />
  ) : (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((day) => {
        const sameMonth = isSameMonth(day, firstDayOfMonth);
        const dayDayFormatted = format(day, 'yyyy-MM-dd');
        return (
          <DayWrapper
            key={dayDayFormatted}
            isInDisplayedMonth={sameMonth}
            date={day}
            dateFormatted={dayDayFormatted}
          />
        );
      })}
    </View>
  );
};

export default Week;

export const WeekPage = memo(({ index }: { index: number }) => {
  const { referenceDate, HeaderComponent, theme, weekStartsOn } =
    useCalenderContext();

  const weekOffset = useMemo(() => {
    return addWeeks(referenceDate, index);
  }, [referenceDate, index]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(addDays(weekOffset, 3));
  }, [weekOffset]);

  firstDayOfMonth.setDate(1);

  const weekWithStart = useMemo(
    () =>
      eachWeekOfInterval(
        {
          start: weekOffset,
          end: weekOffset,
        },
        {
          weekStartsOn,
        }
      ),
    [weekOffset, weekStartsOn]
  );

  const daysOfWeek = useMemo(
    () =>
      eachDayOfInterval({
        start: weekWithStart[0],
        end: addDays(weekWithStart[0], 6),
      }),
    [weekWithStart]
  );

  const headerText = format(firstDayOfMonth, theme.headerDateFormat);
  return (
    <>
      {HeaderComponent ? (
        <HeaderComponent
          startDate={daysOfWeek[0]}
          endDate={daysOfWeek[daysOfWeek.length - 1]}
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
      <DayLabels daysOfWeek={daysOfWeek} />
      <Week days={daysOfWeek} firstDayOfMonth={firstDayOfMonth} />
    </>
  );
});
