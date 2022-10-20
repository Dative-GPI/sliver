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

const makeLineSerie = (name, tZero, vZero, elapsedTime, rangeValue, values) => {
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
    serie: name,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      { ...makeLineSerie("Line 1", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) },
      { ...makeLineSerie("Line 2", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) },
      { ...makeLineSerie("Line 3", 1660860000000 + 86400000, 0, 2.16e+7, 2, 50 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
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
  scrollbar: true,
  scrollbarHeight: 2,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  xAxisRanges: [],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    { startValue: -3,   endValue: 0,  opacity: 0.2, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 3,  opacity: 0.2, color: "#00ff00", label: "Good" },
  ],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5,
  heatRule: 2,
  minColor: "#FF0000",
  maxColor: "#00FF00",
  heatRanges: [
    { startValue: -1500,   endValue: -3,  opacity: 1, color: "#0000ff", label: "Out of scope" },
    { startValue: -3,   endValue: 0,  opacity: 1, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 3,  opacity: 1, color: "#00ff00", label: "Good" },
    { startValue: 3,   endValue: 1500,  opacity: 1, color: "#0000ff", label: "Out of scope" },
  ]
};