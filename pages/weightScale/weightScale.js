const echarts = require('../../libs/ec-canvas/echarts.js')
const moment = require('../../libs/moment.js')

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
    this.getWeight();
    this.recordModal = this.selectComponent("#record-modal");
  },
  tapRecord() {
    this.recordModal.show();
  },
  confirmRecord(e) {
    console.log("confirm weight record", e.detail)

    let newData = [e.detail.date, e.detail.weight]
    wx.getStorage({
      key: 'weight',
      success: (res) => {
        let weightData = [...res.data, newData];
        wx.setStorage({
          key: 'weight',
          data: weightData,
        });
        this.updateChart(weightData);
      },
      fail: (error) => {
        console.log(error);
        let weightData = [newData];
        wx.setStorage({
          key: 'weight',
          data: weightData,
        });
        this.updateChart(weightData);
      }
    });
  },
  getWeight() {
    wx.getStorage({
      key: 'weight',
      success: (res) => {
        this.updateChart(res.data);
      },
      fail: (error) => {
        console.log(error);
      }
    });
  },
  updateChart(weightData) {
    if (!weightData) {
      return;
    }

    weightData = weightData.filter(item => {
      let time = moment(item[0]);
      return (!this.data.startTime || time.isSameOrAfter(moment(this.data.startTime))) &&
             (!this.data.endTime || time.isSameOrBefore(moment(this.data.endTime)));
    });

    let xData = weightData.map(item => item[0]);
    let yData = weightData.map(item => item[1]);
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
})