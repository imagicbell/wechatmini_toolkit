const echarts = require('../../libs/ec-canvas/echarts.js')

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let option = {
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: "category",
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
  };
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    startTime: null,
    endTime: null,
  },
  onReady() {
    // this.getWeight();
    this.recordModal = this.selectComponent("#record-modal");
  },
  tapRecord() {
    this.recordModal.show();
  },
  getWeight() {
    wx.getStorage({
      key: 'weight',
      success: (res) => {
        let weightData = res.data.filter(item => {
          let time = new Date(item[0]).getTime;
          return (!this.data.startTime || time >= new Date(this.data.startTime).getTime) &&
                 (!this.data.endTime || time <= new Date(this.data.endTime).getTime);
        });
        this.updateChart(weightData.map(item => item[0]), weightData.map(item => item[1]));
      },
      fail: (error) => {
        console.log(error);
        this.updateChart([this.getDateFormatString(new Date())], []);
      }
    });
  },
  saveWeight(weightData) {
    wx.getStorage({
      key: 'weight',
      success: (res) => {
        wx.setStorage({
          key: 'weight',
          data: [...res.data, weightData],
        })
      },
      fail: (error) => {
        console.log(error);
        wx.setStorage({
          key: 'weight',
          data: [weightData],
        })
      }
    });
  },
  updateChart(xData, yData) {
    console.log(xData, yData)
    chart.setOption({
      xAxis: {
        data: xData,
      },
      series: [{
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'blue',
        },
        data: yData,
      }]
    });
  },
  getDateFormatString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
})