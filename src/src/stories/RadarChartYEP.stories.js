import RadarChart from '../components/examples/RadarChart.vue';

export default {
  title: 'Example/RadarChart/With ranges',
  component: RadarChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RadarChart },
  template:
    `<radar-chart
      :panX="panX"
      :panY="panY"
      :startAngle="startAngle"
      :endAngle="endAngle"
      :radius="radius"
      :axisMin="axisMin"
      :axisMax="axisMax"
      :ranges="ranges"
      :legend="legend"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
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
  ranges: [
    { lowBound: 0, highBound: 40, color: "#ff3c3c", label: "Bad" },
    { lowBound: 40, highBound: 80, color: "#ff8c3c", label: "Somewhat bad" },
    { lowBound: 80, highBound: 120, color: "#b4b4b4", label: "Just meh" },
    { lowBound: 120, highBound: 160, color: "#aaff64", label: "Somewhat good" },
    { lowBound: 160, highBound: 200, color: "#64ff8c", label: "Good" }
  ],
  legend: true,
  legendX: 50,
  legendCenterX: 50,
  firstClockHand: { colorIndex: 0, name: "Value 1" },
  firstValue: 50,
  secondClockHand: undefined,
  secondValue: 0
};