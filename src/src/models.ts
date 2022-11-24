export interface AxisRange {
  startValue: number;
  endValue: number;
  color: string;
  opacity: number;
  label?: string;
}

export interface TimeRange {
  startDay: number;
  startHour: number;
  startMinute: number;
  endDay: number;
  endHour: number;
  endMinute: number;
  color: string;
  opacity: number;
  label?: string;
}