import RadarChart from '../components/examples/RadarChart.vue';

export default {
  title: 'Example/RadarChart/Without ranges',
  component: RadarChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RadarChart },
  template:
    `<radar-chart
      :minHeight="minHeight"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendLayout="legendLayout"
      :legendPosition="legendPosition"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
      :legendY="legendY"
      :legendCenterY="legendCenterY"
      :panX="panX"
      :panY="panY"
      :startAngle="startAngle"
      :endAngle="endAngle"
      :radius="radius"
      :axisMin="axisMin"
      :axisMax="axisMax"
      :ranges="ranges"
      :firstClockHand="firstClockHand"
      :firstValue="firstValue"
      :secondClockHand="secondClockHand"
      :secondValue="secondValue"
    />`,
});

export const Default = Template.bind({});
Default.args = {
  panX: false,
  panY: false,
  startAngle: 180,
  endAngle: 360,
  radius: 70,
  axisMin: 0,
  axisMax: 200,
  ranges: undefined,
  minHeight: '400px',
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  firstClockHand: { colorIndex: 0, name: "Value 1" },
  firstValue: 50,
  secondClockHand: undefined,
  secondValue: 0
};