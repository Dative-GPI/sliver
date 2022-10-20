import HeatmapChart from '../components/examples/HeatmapChartCC.vue';

export default {
  title: 'Example/HeatmapChart/Category - Category',
  component: HeatmapChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HeatmapChart },
  template:
    `<heatmap-chart
      :data="data"
      :minHeight="minHeight"
      :locale="locale"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendPosition="legendPosition"
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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :xAxisLabelsOversizedBehavior="xAxisLabelsOversizedBehavior"
      :xAxisLabelsMaxWidth="xAxisLabelsMaxWidth"
      :xAxisLabelsTooltipText="xAxisLabelsTooltipText"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
      :heatRule="heatRule"
      :minColor="minColor"
      :maxColor="maxColor"
      :heatRanges="heatRanges"
    />`,
});

const makeHeatmapSerie = (name, categoriesX, categoriesY, range) => {
  var data = [];
  for (let i = 0; i < categoriesX.length; i++) {
    for (let j = 0; j < categoriesY.length; j++) {
        data.push({
          categoryX: categoriesX[i],
          categoryCodeX: categoriesX[i],
          categoryY: categoriesY[j],
          categoryCodeY: categoriesY[j],
          valueZ: Math.floor(Math.random() * range)
        });
    }
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
      { ...makeHeatmapSerie("Occupancy", ["Monday", "Tuesday", "Wednesday"], ["Dawn", "Morning", "Afternoon", "Evening", "Night"], 100 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  chartLayout: 2,
  legend: true,
  legendPosition: 1,
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
  xAxisTooltipNumberFormat: "#,###.###### a",
  xAxisLabelsOversizedBehavior: "truncate",
  xAxisLabelsMaxWidth: 100,
  xAxisLabelsTooltipText: "{categoryX}",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisCellStartLocation: 0,
  yAxisCellEndLocation: 1,
  heatRule: 1,
  minColor: "#00ffff",
  maxColor: "#ff0000",
  heatRanges: []
};