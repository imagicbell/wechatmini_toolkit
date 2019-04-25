const echarts = require('../../libs/ec-canvas/echarts.js')
const moment = require('../../libs/moment.js')

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  console.log("init weight chart");

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
        formatter: function (value, index) {
          // 格式化成月.日，只在第一个刻度显示年份
          let date = moment(value);
          return index === 0 ? date.format('YY-MM-DD') : date.format('MM-DD');
        },
        showMinLabel: true,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.5,
        }
      }
    },
    dataZoom: [{
      type: 'slider',
      filterMode: 'filter',
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
    },
    startTime: null,
    endTime: null,
  },
  onReady() {
    setTimeout(this.getWeight, 100);
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
        let weightData;
        let index = res.data.findIndex(d => moment(d[0]).isSame(moment(e.detail.date), 'day'));
        if (index >= 0) {
          weightData = [
            ...res.data.slice(0, index),
            newData,
            ...res.data.slice(index + 1)
          ];
        } else {
          index = res.data.findIndex(d => moment(d[0]).isAfter(moment(e.detail.date), 'day'));
          if (index >= 0) {
            weightData = [
              ...res.data.slice(0, index),
              newData,
              ...res.data.slice(index)
            ];
          } else {
            weightData = [...res.data, newData];
          }
        }
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
      return (!this.data.startTime || time.isSameOrAfter(moment(this.data.startTime), 'day')) &&
             (!this.data.endTime || time.isSameOrBefore(moment(this.data.endTime), 'day'));
    });

    let yMin = Infinity, yMax = 0;
    weightData.forEach(item => {
      yMin = Math.min(yMin, item[1]);
      yMax = Math.max(yMax, item[1]);
    });
    yMin -= 20;
    yMax += 20;

    chart.setOption({
      yAxis: {
        min: yMin,
        max: yMax,
      },
      series: [{
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'blue',
        },
        data: weightData,
      }]
    });
  },
})