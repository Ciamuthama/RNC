import React from "react";
import { ComposedGesture, GestureType } from "react-native-gesture-handler";
import {
  SharedValue,
  useAnimatedStyle,
  WithSpringConfig,
} from "react-native-reanimated";
import { DEFAULT_THEME } from "./defaults";
import { PageInterpolatorParams } from "react-native-infinite-pager";


export type OnDateSelect =
  | undefined
  | ((date: Date, options: { isSelected: boolean }) => void);

export type DayComponentType = (props: {
  date: Date;
  isInDisplayedMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
}) => React.JSX.Element | null;

export type WeekComponentType = (props: {
  days: Date[];
}) => React.JSX.Element | null;

export type MonthComponentType = (props: {
  weeks: Date[][];
  firstDayOfMonth: Date;
}) => React.JSX.Element | null;

export type HeaderComponentType = (props: {
  startDate: Date;
  endDate: Date;
}) => React.JSX.Element | null;

export type DayLabelComponentType = (props: {
  date: Date;
}) => React.JSX.Element | null;

export type ImperativeApiOptions = {
  animated?: boolean;
};

export type CalenderImperativeApi = {
  incrementPage: (option?: ImperativeApiOptions) => void;
  decrementPage: (option?: ImperativeApiOptions) => void;
  setPage: (date: Date, options?: ImperativeApiOptions) => void;
};

export type CalenderPageInterpolator = (
  params: CalenderPageInterpolatorParams
) => ReturnType<typeof useAnimatedStyle>;

export type CalenderProps = {
  selectedDate?: Date | null;
  onDateSelect?: OnDateSelect;
  onPageChange?: (date: Date) => void;
  currentDate?: Date;
  HeaderComponent?: HeaderComponentType;
  DayLabelComponent?: DayLabelComponentType;
  DayComponent?: DayComponentType;
  WeekComponent?: WeekComponentType;
  MonthComponent?: MonthComponentType;
  theme?: Partial<typeof DEFAULT_THEME>;
  pageBuffer?: number;
  minDate?: Date;
  maxDate?: Date;
  pageInterpolator?: CalenderPageInterpolator;
  simultaneousGestures?: (ComposedGesture | GestureType)[];
  monthAnimCallbackNode?: SharedValue<number>;
  gesturesDisabled?: boolean;
  animationConfig?: Partial<WithSpringConfig>;
  weekStartsOn?: WeekDayIndex;
  pageInterval?: PageInterval;
};

export type DayProps = {
  date: Date;
  isInDisplayedMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  DayComponent?: DayComponentType;
  onDateSelect?: OnDateSelect;
  theme: typeof DEFAULT_THEME;
  dateFormatted: string;
};

export type DayWrapperProps = {
  isInDisplayedMonth: boolean;
  date: Date;
  dateFormatted: string;
};

export type CalendarPageInterpolatorParams = PageInterpolatorParams & {
  theme: typeof DEFAULT_THEME;
};
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type PageInterval = "day" | "week" | "month";
