
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import { isEqual } from 'date-fns';
import { defaultPageInterpolator, DEFAULT_THEME } from './defaults';
import {
  CalenderImperativeApi,
  CalenderProps,
  ImperativeApiOptions,
  PageInterval,
} from './interface';
import { CalenderContext } from './context';
import { MonthPage } from './Month';
import { WeekPage } from './Week';
import { DayPage } from './Day';
import {
  getAddFn,
  getDayLabelDateFormat,
  getDiffFn,
  getHeaderDateFormat,
  getFirstDayOfInteval,
  getIsSameFn,
} from './dateutils';
import { getDaysInMonth } from 'date-fns';
import Animated, {
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import InfinitePager,{ InfinitePagerImperativeApi, PageInterpolatorParams } from 'react-native-infinite-pager';

function getPageComponent(interval: PageInterval) {
  switch (interval) {
    case "day":
      return DayPage;
    case "week":
      return WeekPage;
    case "month":
      return MonthPage;
  }
}

const MyComponent = memo(
  (
    {
      selectedDate,
      onDateSelect,
      onPageChange,
      currentDate,
      HeaderComponent,
      DayLabelComponent,
      DayComponent,
      WeekComponent,
      MonthComponent,
      theme = {},
      pageBuffer = 1,
      minDate,
      maxDate,
      pageInterpolator = defaultPageInterpolator,
      simultaneousGestures,
      monthAnimCallbackNode,
      gesturesDisabled,
      animationConfig,
      weekStartsOn = 0,
      pageInterval = 'month',
    }: CalenderProps,
    ref: React.ForwardedRef<CalenderImperativeApi>
  ) => {
    const initialDateRef = useRef(currentDate || new Date());
    const currentDateRef = useRef(currentDate);
    const currentPageRef = useRef(0);
    const pagerRef = useRef<InfinitePagerImperativeApi>(null);
    const pageCallbackNode = useSharedValue(0);

    const minPageIndex = useMemo(() => {
      if (!minDate) {return -Infinity;}
      const differ = getDiffFn(pageInterval);
      return differ(initialDateRef.current, minDate) * -1;
    }, [minDate, pageInterval]);

    const maxPageIndex = useMemo(() => {
      if (!maxDate) {return Infinity;}
      const differ = getDiffFn(pageInterval);
      return differ(initialDateRef.current, maxDate);
    }, [maxDate, pageInterval]);

    const onPageChangeRef = useRef(onPageChange);
    onPageChangeRef.current = onPageChange;

    const fullThemeObj = {
      ...DEFAULT_THEME,
      dayLabelDateFormat: getDayLabelDateFormat(pageInterval),
      headerDateFormat: getHeaderDateFormat(pageInterval),
      ...theme,
    };

    const fullThemeRef = useRef(fullThemeObj);

    const fullTheme: typeof DEFAULT_THEME = useMemo(() => {
      const updatedTheme = { ...fullThemeRef.current, ...theme };

      if (isEqual(+fullThemeRef.current, +updatedTheme)) {
        return fullThemeRef.current;
      } else {
        fullThemeRef.current = updatedTheme;
        return updatedTheme;
      }
    }, [theme]);

    useImperativeHandle(
      ref,
      () => ({
        incrementPage: (options?: ImperativeApiOptions) => {
          const animated = options?.animated ?? true;
          pagerRef.current?.incrementPage({ animated });
        },
        decrementPage: (options?: ImperativeApiOptions) => {
          const animated = options?.animated ?? true;
          pagerRef.current?.decrementPage({ animated });
        },
        setPage: (date: Date, options?: ImperativeApiOptions) => {
          const animated = options?.animated ?? false;
          const differ = getDiffFn(pageInterval);
          const page = differ(date, initialDateRef.current);
          pagerRef.current?.setPage(page, { animated });
        },
      }),
      [pageInterval]
    );

    useEffect(() => {
      // Hard set the page if the passed-in currentDate changes and the calendar isn't already displaying that month.
  
      const isSameFn = getIsSameFn(pageInterval);
      const diffFn = getDiffFn(pageInterval);
      if (
        currentDate &&
        currentDateRef.current &&
        !isSameFn(currentDate, currentDateRef.current)
      ) {
        const page = diffFn(currentDate, initialDateRef.current);
        if (page === currentPageRef.current) {return;}
        pagerRef.current?.setPage(page, { animated: false });
      }
  
      currentDateRef.current = currentDate;
    }, [currentDate, pageInterval]);
    const _onPageChange = useCallback((pg:number)=>{
      currentPageRef.current = pg;
      const addFn = getAddFn(pageInterval);
      const firstDayOfIntervalFn =  getFirstDayOfInteval(pageInterval, {
        weekStartsOn,
      });
      const dateWithOffset = addFn(initialDateRef.current,pg);
      onPageChangeRef.current?.(firstDayOfIntervalFn(dateWithOffset));
    },[pageInterval,weekStartsOn]);

    const providerValue = useMemo(
      () => ({
        referenceDate: initialDateRef.current,
        selectedDate,
        onDateSelect,
        HeaderComponent,
        DayLabelComponent,
        DayComponent,
        WeekComponent,
        MonthComponent,
        theme: fullTheme,
        pageInterpolator,
        weekStartsOn,
      }),
      [
        selectedDate,
        onDateSelect,
        HeaderComponent,
        DayLabelComponent,
        DayComponent,
        WeekComponent,
        MonthComponent,
        fullTheme,
        pageInterpolator,
        weekStartsOn,
      ]
    );


    const pageInterpolatorInternal = useCallback(
      (params: PageInterpolatorParams) => {
        "worklet";
        return pageInterpolator(Object.assign({}, params, { theme: fullTheme }));
      },
      [fullTheme, pageInterpolator]
    );

    return (
      <CalenderContext.Provider value={providerValue}>
        <InfinitePager
        ref={pagerRef}
        PageComponent={getPageComponent(pageInterval)}
        pageBuffer={pageBuffer}
        onPageChange={_onPageChange}
        minIndex={minPageIndex}
        maxIndex={maxPageIndex}
        pageInterpolator={pageInterpolatorInternal}
        simultaneousGestures={simultaneousGestures}
        pageCallbackNode={monthAnimCallbackNode ? pageCallbackNode : undefined}
        gesturesDisabled={gesturesDisabled}
        animationConfig={animationConfig}
      />
      {monthAnimCallbackNode && (
        <AnimUpdater
          pageInterval={pageInterval}
          initialDateRef={initialDateRef}
          monthAnimCallbackNode={monthAnimCallbackNode}
          pageCallbackNode={pageCallbackNode}
        />
      )}
      </CalenderContext.Provider>
    );
  }
);

export default forwardRef(MyComponent);

function AnimUpdater({initialDateRef,pageCallbackNode,monthAnimCallbackNode,pageInterval}: {initialDateRef: React.MutableRefObject<Date>; pageCallbackNode: Animated.SharedValue<number>; monthAnimCallbackNode: Animated.SharedValue<number>;pageInterval:PageInterval;}){
  const initialMonthIndex = initialDateRef.current.getMonth();
  const initialDayOfMonth = initialDateRef.current.getDate();

  useDerivedValue(()=>{
    function getMonthFromPage(page:number,initialOffset:number){
      switch (pageInterval){
        case 'week':{
          const midweek = page * 7 + 3.5 + initialOffset;
          return getMonthFromDay(midweek);
        }
        case 'day':{
          return getMonthFromDay(page + initialOffset);
        }
        case 'month':
          return page;
      }
    }

    const initialOffset = daysElapsedAtMonthStart[initialMonthIndex] + initialDayOfMonth;
    const monthAnim = getMonthFromPage(pageCallbackNode.value, initialOffset);
    const rawVal = monthAnim;
    let modVal = rawVal % 12;
    if (modVal < 0){
      modVal = 12 + modVal;
    }
    monthAnimCallbackNode.value = modVal;

  },[pageCallbackNode,monthAnimCallbackNode,initialMonthIndex,initialDayOfMonth,pageInterval]);
  return null;
}

const numDaysInMonth = [...Array(12)].fill(0).flatMap((d, i) => {
  const month = new Date();
  month.setMonth(i);
  const numDaysInMonths = getDaysInMonth(month);
  return numDaysInMonths;
});

const daysElapsedAtMonthStart = numDaysInMonth.reduce(
  (acc, cur) => {
    const last = acc[acc.length - 1] || 0;
    acc.push(last + cur);
    return acc;
  },
  [0]
);

const dayOfYearToMonthIndex = numDaysInMonth.flatMap(
  (numDaysInMonth, monthIndex) => {
    return [...new Array(numDaysInMonth)].fill(0).map((_, i) => {
      return {
        pct: monthIndex + i / numDaysInMonth,
        numDaysInMonth,
      };
    });
  }
);

function getMonthFromDay(dayOfYear: number) {
  'worklet';
  const floor = Math.floor(dayOfYear);
  const remainder = dayOfYear % 1;
  const { pct, numDaysInMonth } = dayOfYearToMonthIndex[floor % 365];
  return pct + remainder / numDaysInMonth;
}



