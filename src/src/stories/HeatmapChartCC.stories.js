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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :xAxisLabelsOversizedBehavior="xAxisLabelsOversizedBehavior"
      :xAxisLabelsMaxWidth="xAxisLabelsMaxWidth"
      :xAxisLabelsTooltipText="xAxisLabelsTooltipText"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
      :minColor="minColor"
      :maxColor="maxColor"
    />`,
});

const makeHeatmapSerie = (name, categoriesX, categoriesY, range) => {
  var data = [];
  for (let i = 0; i < categoriesX.length; i++) {
    for (let j = 0; j < categoriesY.length; j++) {
        data.push({
          categoryX: categoriesX[i],
          categoryY: categoriesY[j],
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
  xAxisTooltipNumberFormat: "#",
  xAxisLabelsOversizedBehavior: "truncate",
  xAxisLabelsMaxWidth: 100,
  xAxisLabelsTooltipText: "{categoryX}",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#",
  yAxisCellStartLocation: 0,
  yAxisCellEndLocation: 1,
  minColor: "#00ffff",
  maxColor: "#ff0000"
};