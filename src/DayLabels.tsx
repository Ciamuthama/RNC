import { format } from 'date-fns';
import { View, Text } from 'react-native';
import { useCalenderContext } from './context';
import React from 'react';

export const DayLabels = ({daysOfWeek}:{daysOfWeek: Date[]}) => {
  return (
    <View style={{flexDirection:'row'}}>
     <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
      {daysOfWeek.map((day) => (
        <LabelDay key={`day-label-${day.toISOString()}`} day={day} />
      ))}
     </View>
    </View>
  );
};

export const LabelDay = ({ day }: { day: Date }) => {
  const { DayLabelComponent, theme } = useCalenderContext();

  const dayLabelText = format(day, theme.dayLabelDateFormat);

  return DayLabelComponent ? (
    <DayLabelComponent date={day} />
  ) : (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:theme.dayLabelColor, fontFamily:theme.dayLabelFontFamily, fontSize:theme.dayLabelFontSize,textTransform:theme.dayLabelTextTransform}}>{dayLabelText}</Text>
    </View>
  );
};

