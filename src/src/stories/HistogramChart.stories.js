import HistogramChart from '../components/examples/HistogramChart.vue';

export default {
  title: 'Example/HistogramChart',
  component: HistogramChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HistogramChart },
  template:
    `<histogram-chart
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
      :xAxisRanges="xAxisRanges"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisMin="yAxisMin"
      :yAxisMax="yAxisMax"
      :serieStacked="serieStacked"
    />`,
});

const makeHistogramSerie = (name, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      closeTimestampX: tZero + elapsedTime,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.floor(Math.random() * rangeValue) * plusOrMinus)
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
      { ...makeHistogramSerie("Line 1", 1640815320000, 50, 2.16e+7, 5, 50 ) },
      { ...makeHistogramSerie("Line 2", 1640815320000, 50, 2.16e+7, 5, 50 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "hector",
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
  scrollbarHeight: 5,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  xAxisRanges: [
    { startDay: 0, startHour: 8, startMinute: 30, endDay: 0, endHour: 18, endMinute: 30, opacity: 0.2, color: "#ff00ff", label: "Don't know"}
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisMin: 0,
  yAxisMax: undefined,
  serieStacked: false
};