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
      :height="height"
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
      makeLineSerie("Level 1", 1685570400000, 0.0001, 864000, 0.0001, 6)
    ]
  },
  height: '100vh',
  locale: "fr-FR",
  timeOffset: "UTC +02:00:00",
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
    { value: 1682632800000, color: "#000000", tooltip: ["Triggered", "Thursday 28th April 2023 00:00:00"], icon: "schedule" },
  ],
  xAxisRanges: [
    { startDay: 4, startHour: 22, startMinute: 0, endDay: 6, endHour: 22, endMinute: 0, opacity: 0.10, color: "#5f5f5f", label: "Week-end"},
    { startDay: 7, startHour: 7, startMinute: 0, endDay: 7, endHour: 15, endMinute: 0, opacity: 0.10, color: "#005f00", label: ""},
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5,
  heatRule: 0,
  minColor: "#FF0000",
  maxColor: "#00FF00",
  heatRanges: []
};