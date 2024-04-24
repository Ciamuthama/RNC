import { View, Text } from "react-native";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { DayProps, DayWrapperProps, OnDateSelect } from "./interface";
import { LabelDay } from "./DayLabels";
import { useCalenderContext } from "./context";
import { TouchableOpacity } from "react-native";

export const DayWrapper = memo(
  ({ date, isInDisplayedMonth, dateFormatted }: DayWrapperProps) => {
    const dateRef = useRef(date);
    const memoDate = useMemo(() => {
      if (isSameDay(date, dateRef.current)) {
        return dateRef.current;
      }
      dateRef.current = date;
      return date;
    }, [date]);

    const { selectedDate, onDateSelect, DayComponent, theme } =
      useCalenderContext();
    const isSelected = useMemo(() => {
      return !!selectedDate && isSameDay(selectedDate, memoDate);
    }, [memoDate, selectedDate]);

    const isToday = useMemo(() => isSameDay(memoDate, new Date()), [memoDate]);
    const onDateSelectRef = useRef(onDateSelect);
    onDateSelectRef.current = onDateSelect;
    const onDateSelectCb: OnDateSelect = useCallback((date:any, options:any) => {
      return onDateSelectRef.current?.(date, options);
    }, []);

    return (
      <DayItem
        date={memoDate}
        dateFormatted={dateFormatted}
        isSelected={isSelected}
        isToday={isToday}
        isInDisplayedMonth={isInDisplayedMonth}
        DayComponent={DayComponent}
        onDateSelect={onDateSelectCb}
        theme={theme}
      />
    );
  }
);

export const DayItem = React.memo(
  ({
    date,
    isInDisplayedMonth,
    isSelected,
    DayComponent,
    isToday,
    onDateSelect,
    theme,
  }: DayProps) => {
    const dayText = format(date, "d");
    const deselectedColor = isInDisplayedMonth
      ? theme.dayFontColor
      : theme.dayInactiveFontColor;
    const color = isSelected ? theme.daySelectedFontColor : deselectedColor;

    if (DayComponent) {
      return (
        <DayComponent
          date={date}
          isSelected={isSelected}
          isToday={isToday}
          isInDisplayedMonth={false}
        />
      );
    }

    const padding = 10;

    return (
      <TouchableOpacity
        onPress={() => onDateSelect?.(date, { isSelected })}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: padding,
        }}
      >
        <View
          style={{
            flex: 0,
            aspectRatio: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            backgroundColor: isSelected
              ? theme.selectedDayBackground
              : "transparent",
            borderRadius: 5,
          }}
        />
        <Text
          style={{
            color:isToday ? "white": color,
            fontSize: theme.dayFontSize,
            fontFamily: theme.dayFontFamily,
            backgroundColor: isToday
                ? "black"
                : "transparent",
            padding:10,
            borderRadius:10
          }}
        >
          {dayText}
        </Text>
      </TouchableOpacity>
    );
  }
);

export const DayPage = memo(({ index }: { index: number }) => {
  const { referenceDate, HeaderComponent, theme } = useCalenderContext();

  const dayOffset = useMemo(() => {
    return addDays(referenceDate, index);
  }, [referenceDate, index]);

  const firstDayOfMonth = useMemo(() => new Date(dayOffset), [dayOffset]);
  firstDayOfMonth.setDate(1);
  const dayDayFormatted = format(dayOffset, "yyyy-MM-dd");
  const headerText = format(dayOffset, theme.headerDateFormat);

  return (
    <>
      {HeaderComponent ? (
        <HeaderComponent startDate={dayOffset} endDate={dayOffset} />
      ) : (
        <View style={{alignItems:"center"}}>
          <Text style={{fontSize:theme.headerFontSize, fontFamily: theme.headerFontFamily, color:theme.headerFontColor, textTransform:theme.headerTextTransform}}>{headerText}</Text>
        </View>
      )}
      <View style={{flexDirection:"row"}}>
        <LabelDay day={dayOffset} />
      </View>
      <View style={{flexDirection:"row"}}>
        <DayWrapper
          isInDisplayedMonth
          date={dayOffset}
          dateFormatted={dayDayFormatted}
        />
      </View>
    </>
  );
});
