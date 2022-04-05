import LineChart from '../components/examples/LineChart.vue';

export default {
  title: 'Example/LineChart/Logarithmic',
  component: LineChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LineChart },
  template:
    `<line-chart
      :data="data"
      :minHeight="minHeight"
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
      :lineSeriesBullet="lineSeriesBullet"
      :lineSeriesBulletRadius="lineSeriesBulletRadius"
    />`,
});

const makeLineSerie = (name, tZero, vZero, elapsedTime, rangeValue, multiplicator, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    tZero += elapsedTime;
    vZero += (Math.floor(Math.random() * rangeValue));
    vZero = vZero * multiplicator;
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
      { ...makeLineSerie("Line 1", 1640815320000, 2, 120000, 5, 5, 15 ) },
      { ...makeLineSerie("Line 2", 1640815320000, 2, 120000, 5, 2, 15 ) }
    ]
  },
  minHeight: '400px',
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
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm",
  yAxisOpposite: false,
  yAxisLogarithmic: true,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#",
  lineSeriesBullet: true,
  lineSeriesBulletRadius: 3
};