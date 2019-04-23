const echarts = require('../../ec-canvas/echarts.js')

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let option = {
    title: {
      text: 'Weight Line',
      left: 'center'
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: "time",
      // min:
      // max:
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          // color: ['#aaa', '#ddd']
          type: 'dashed',
          opacity: 0.5,
        }
      }
    },
    series: [{
      type: 'line',
      smooth: true,
      lineStyle: {
        color: 'blue',
      },
      data: [90, 91, 92, 93, 94, 96, 98, 100]
    }]
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