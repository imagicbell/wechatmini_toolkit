const echarts = require('../../libs/ec-canvas/echarts.js')

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {

  };
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },
  onLoad: function() {

  },
  tapRecord: function() {
    
  }
})