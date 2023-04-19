import LineChart from '../components/examples/LineChart.vue';

export default {
  title: 'Example/LineChart',
  component: LineChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LineChart },
  template:
    `<line-chart
      :data="data"
      :minHeight="minHeight"
      :locale="locale"
      :timeOffset="timeOffset"
      :colorSet="colorSet"
      :colorSeed="colorSeed"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendLayout="legendLayout"
      :legendPosition="legendPosition"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
      :legendY="legendY"
      :legendCenterY="legendCenterY"
      :cursor="cursor"
      :cursorBehavior="cursorBehavior"
      :cursorXVisible="cursorXVisible"
      :cursorYVisible="cursorYVisible"
      :scrollbar="scrollbar"
      :scrollbarHeight="scrollbarHeight"
      :scrollbarStartGripVisible="scrollbarStartGripVisible"
      :scrollbarEndGripVisible="scrollbarEndGripVisible"
      :xAxisOpposite="xAxisOpposite"
      :xAxisShowTooltip="xAxisShowTooltip"
      :xAxisTooltipDateFormat="xAxisTooltipDateFormat"
      :xAxisLines="xAxisLines"
      :xAxisRanges="xAxisRanges"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisRanges="yAxisRanges"
      :yAxisUnit="yAxisUnit"
      :serieShowBullets="serieShowBullets"
      :serieBulletsRadius="serieBulletsRadius"
      :heatRule="heatRule"
      :minColor="minColor"
      :maxColor="maxColor"
      :heatRanges="heatRanges"
    />`,
});

const makeLineSerie = (label, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime + (i%10 === 1 ? elapsedTime : 0);
    vZero += (Math.random() * rangeValue * plusOrMinus);
  }

  return {
    label: label,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      makeLineSerie("Level 1", 1680332700000, 225000, 3600000, 10000, 500),
      // makeLineSerie("Level 2", 1674028800000, 250000, 3600000, 10000, 50),
      // makeLineSerie("Level 3", 1674028800000, 275000, 3600000, 10000, 50),
      // makeLineSerie("Level 4", 1674028800000, 275000, 3600000, 10000, 50),
      // makeLineSerie("Level 5", 1674028800000, 275000, 3600000, 10000, 50),
      // makeLineSerie("Level 6", 1674028800000, 275000, 3600000, 10000, 50),
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  timeOffset: "UTC +05:00:00",
  colorSet: 0,
  colorSeed: "tango",
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  cursor: true,
  cursorBehavior: "zoomX",
  cursorXVisible: true,
  cursorYVisible: true,
  scrollbar: false,
  scrollbarHeight: 2,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  xAxisLines: [
    { value: 1680339901289, color: "#000000", tooltip: ["Triggered", "Saturday 1st 2023 14:05:01"], icon: "schedule" },
    // { value: 1674028800000 + 5 * 3600000, color: "#0000FF", tooltip: ["Resolved", "January 26th 2023 16:00"], icon: "block" }
  ],
  xAxisRanges: [
    // { startDay: 3, startHour: 6, startMinute: 30, endDay: 3, endHour: 7, endMinute: 30, opacity: 0.15, color: "#0000FF", label: "X"},
    { startDay: 6, startHour: 6, startMinute: 0, endDay: 6, endHour: 16, endMinute: 0, opacity: 0.15, color: "#5f5f5f", label: "Journée 11h-21h"}
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    // { startValue: 200000, endValue: 225000, opacity: 0.5, color: "#0000FF", label: "Y" }
  ],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5,
  heatRule: 0,
  minColor: "#FF0000",
  maxColor: "#00FF00",
  heatRanges: []
};