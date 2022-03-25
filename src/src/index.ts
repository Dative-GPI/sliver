import DCategoryXAxis from "./components/axis/DCategoryXAxis.vue";
import DCategoryYAxis from "./components/axis/DCategoryYAxis.vue";
import DDateXAxis from "./components/axis/DDateXAxis.vue";
import DDateYAxis from "./components/axis/DDateYAxis.vue";
import DValueTAxis from "./components/axis/DValueTAxis.vue";
import DValueXAxis from "./components/axis/DValueXAxis.vue";
import DValueYAxis from "./components/axis/DValueYAxis.vue";

import DLegend from "./components/charts/DLegendWrapper.vue";
import DPieChart from "./components/charts/DPieChart.vue";
import DRadarChart from "./components/charts/DRadarChart.vue";
import DXYChart from "./components/charts/DXYChart.vue";
import DXYCursor from "./components/charts/DXYCursorWrapper.vue";
import DXScrollbar from "./components/charts/DXScrollbar.vue";
import DYScrollbar from "./components/charts/DYScrollbar.vue";

import DClockHand from "./components/series/DClockHand.vue";
import DColumnSerie from "./components/series/DColumnSerie.vue";
import DHeatmapSerie from "./components/series/DHeatmapSerie.vue";
import DHistogramSerie from "./components/series/DHistogramSerie.vue";
import DLineSerie from "./components/series/DLineSerie.vue";
import DPieSerie from "./components/series/DPieSerie.vue";
import DPlanningSerie from "./components/series/DPlanningSerie.vue";
import DScatterPlotSerie from "./components/series/DScatterPlotSerie.vue";
import DStackedColumnSerie from "./components/series/DStackedColumnSerie.vue";

import { LayoutEnum, PositionEnum } from "./enums";

const Sliver = {
  install(vue: any, options: any) {
    vue.component("d-category-x-axis", DCategoryXAxis);
    vue.component("d-category-y-axis", DCategoryYAxis);
    vue.component("d-date-x-axis", DDateXAxis);
    vue.component("d-date-y-axis", DDateYAxis);
    vue.component("d-value-t-axis", DValueTAxis);
    vue.component("d-value-x-axis", DValueXAxis);
    vue.component("d-value-y-axis", DValueYAxis);
    vue.component("d-legend", DLegend);
    vue.component("d-pie-chart", DPieChart);
    vue.component("d-radar-chart", DRadarChart);
    vue.component("d-xy-chart", DXYChart);
    vue.component("d-xy-cursor", DXYCursor);
    vue.component("d-x-scrollbar", DXScrollbar);
    vue.component("d-y-scrollbar", DYScrollbar);
    vue.component("d-clock-hand", DClockHand);
    vue.component("d-column-serie", DColumnSerie);
    vue.component("d-heatmap-serie", DHeatmapSerie);
    vue.component("d-histogram-serie", DHistogramSerie);
    vue.component("d-line-serie", DLineSerie);
    vue.component("d-pie-serie", DPieSerie);
    vue.component("d-planning-serie", DPlanningSerie);
    vue.component("d-scatter-plot-serie", DScatterPlotSerie)
    vue.component("d-stacked-column-serie", DStackedColumnSerie);
  }
};
 
 export { Sliver, LayoutEnum, PositionEnum };