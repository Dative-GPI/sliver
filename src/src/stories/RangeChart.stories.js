import RangeChart from '../components/examples/RangeChart.vue';

export default {
  title: 'Example/RangeChart',
  component: RangeChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RangeChart },
  template:
    `<range-chart
      :serie="data.series[0]"
      :subSeries="data.series.slice(1)"
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
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisRanges="yAxisRanges"
      :yAxisUnit="yAxisUnit"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
      :serieSubTooltipText="serieSubTooltipText"
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
    vZero += (Math.random() * rangeValue) * plusOrMinus
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
      makeLineSerie("Reference", 1640815320000, 50, 120000, 5, 50),
      makeLineSerie("Line 1", 1640815320000, 100, 120000, 5, 50),
      makeLineSerie("Line 2", 1640815320000, 0, 120000, 5, 50)
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
  scrollbarHeight: 5,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    { startValue: -5,   endValue: 0,  opacity: 0.2, color: "#ff0000", label: "Bad" },
    { startValue: 0,   endValue: 5,  opacity: 0.2, color: "#00ff00", label: "Bad" },
  ],
  yAxisUnit: "mL",
  serieShowTooltip: true,
  serieTooltipText: "{name}: {dataItem.dataContext.valueY}",
  serieSubTooltipText: "{name}: {dataItem.dataContext.valueY}"
};