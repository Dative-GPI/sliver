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
      { ...makeLineSerie("Line 1", 1660860000000 + 86400000, 1, 2.16e+7, 1, 25 ) },
      { ...makeLineSerie("Line 2", 1660860000000 + 86400000, 1, 2.16e+7, 1, 25 ) }
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
    { startValue: -5,   endValue: 0,  opacity: 0.2, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 5,  opacity: 0.2, color: "#00ff00", label: "Bad" },
  ],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5
};