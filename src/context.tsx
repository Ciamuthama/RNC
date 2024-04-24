import React, { createContext } from 'react';
import { defaultPageInterpolator, DEFAULT_THEME } from './defaults';
import { WeekDayIndex, DayComponentType, DayLabelComponentType, HeaderComponentType, MonthComponentType ,OnDateSelect, WeekComponentType } from './interface';

export const CalenderContext = createContext({
    referenceDate: new Date(),
    selectedDate : null as Date | null | undefined,
    onDateSelect:(()=> {}) as OnDateSelect,
    DayComponent: undefined as DayComponentType | undefined,
    DayLabelComponent : undefined as DayLabelComponentType | undefined,
    HeaderComponent : undefined as HeaderComponentType | undefined,
    MonthComponent : undefined as MonthComponentType | undefined,
    WeekComponent : undefined as WeekComponentType | undefined,
    pageInterpolator: defaultPageInterpolator,
    theme: DEFAULT_THEME,
    weekStartsOn : 0 as WeekDayIndex,
});

export function useCalenderContext(){
    return React.useContext(CalenderContext);
}
