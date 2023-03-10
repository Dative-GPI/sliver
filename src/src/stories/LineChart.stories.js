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

    tZero += elapsedTime;
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
      makeLineSerie("Level 1", 1674028800000, 225000, 36000000, 10000, 50),
      makeLineSerie("Level 2", 1674028800000, 250000, 36000000, 10000, 50),
      makeLineSerie("Level 3", 1674028800000, 275000, 36000000, 10000, 50),
      makeLineSerie("Level 4", 1674028800000, 275000, 36000000, 10000, 50),
      makeLineSerie("Level 5", 1674028800000, 275000, 36000000, 10000, 50),
      makeLineSerie("Level 6", 1674028800000, 275000, 36000000, 10000, 50),
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
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
    { value: 1674388800000, color: "#000000", tooltip: ["Triggered", "January 22nd 2023 12:00"], icon: "error_outline" },
    { value: 1674748800000, color: "#0000FF", tooltip: ["Resolved", "January 26th 2023 16:00"], icon: "check_circle_outline" }
  ],
  xAxisRanges: [
    { startDay: 0, startHour: 8, startMinute: 30, endDay: 0, endHour: 18, endMinute: 30, opacity: 0.5, color: "#0000FF", label: "X"}
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    { startValue: 200000, endValue: 225000, opacity: 0.5, color: "#0000FF", label: "Y" }
  ],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5,
  heatRule: 0,
  minColor: "#FF0000",
  maxColor: "#00FF00",
  heatRanges: []
};