import StepLineChart from '../components/examples/StepLineChart.vue';

export default {
  title: 'Example/StepLineChart',
  component: StepLineChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { StepLineChart },
  template:
    `<step-line-chart
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
      :yAxisRanges="yAxisRanges"
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
    vZero += Math.floor((Math.random() * rangeValue * plusOrMinus))
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
      { ...makeLineSerie("Line 1", 1660860000000 + 86400000, 50, 2.16e+7, 5, 25 ) },
      { ...makeLineSerie("Line 2", 1660860000000 + 86400000, 50, 2.16e+7, 5, 25 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "soyouz",
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
    { startDay: 5, startHour: 0, startMinute: 0, endDay: 0, endHour: 0, endMinute: 0, opacity: 0.2, color: "#ff00ff", label: "Week-end"},
    { startDay: 2, startHour: 0, startMinute: 0, endDay: 3, endHour: 0, endMinute: 0, opacity: 0.2, color: "#cccccc", label: "Wednesday"}
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [],
  serieShowBullets: false,
  serieBulletsRadius: 5
};