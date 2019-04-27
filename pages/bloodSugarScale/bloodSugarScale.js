const echarts = require('../../libs/ec-canvas/echarts.js');
const moment = require('../../libs/moment.js');
const constants = require('./constants.js');

let chart = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width,
    height
  });
  canvas.setChart(chart);
  console.log("init blood sugar chart");

  let option = {
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: "time",
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: function(value, index) {
          let date = moment(value);
          return index === 0 ? date.format('YY-MM-DD') : date.format('MM-DD');
        },
        showMinLabel: true,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.5
        }
      },
    },
    dataZoom: [{
      type: 'slider',
      filterMode: 'none',
      startValue: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    }],
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

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    setTimeout(this.getSaveData, 100);
    
  },
  tapRecord: function() {

  },
  confirmRecord: function(e) {
    console.log("confirm blood sugar record", e.detail);
  },
  getSaveData: function() {
    wx.getStorage({
      key:'bloodSugar',
      success: (res) => {
        this.updateChart(res.data);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  },
  updateChart: function(chartData) {
    if (!chartData) 
      return;

    let yMax = 0;
    chartData[constants.KEY_FASTING].forEach(item => {
      yMax = Math.max(yMax, item[1]);
    });
    chartData[constants.KEY_2H].forEach(item => {
      yMax = Math.max(yMax, item[1]);
    });
    chartData[constants.KEY_NIGHT].forEach(item => {
      yMax = Math.max(yMax, item[1]);
    });
    yMax += 2;

    chart.setOption({
      yAxis: {
        max: yMax,
      },
      series: [{
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'red',
        },
        data: chartData[constants.KEY_FASTING],
      }, {
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'yellow',
        },
        data: chartData[constants.KEY_2H],
      }, {
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'blue',
        },
        data: chartData[constants.KEY_NIGHT],
      }],
    })
  }
})