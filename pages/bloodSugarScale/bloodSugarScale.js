const echarts = require('../../libs/ec-canvas/echarts.js');
const moment = require('../../libs/moment.js');
const constants = require('./constants.js');

let app = getApp();

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
    color: ['red', 'green', 'blue'],
    legend: {
      left: "center",
      top: 30,
      itemGap: 20,
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
      minInterval: 3600 * 24 * 1000
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
      startValue: moment().subtract(7, 'days').format(constants.timeFormat),
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

  onLoad: function() {
    app.pubsub.on("finish_record_bloodSugar", (records) => {
      console.log("new blood sugar records", records);
      this.getBloodSugarData(
        (data) => this.updateBloodSugarData(data, records),
        () => this.updateBloodSugarData(null, records));
    });
  },
 
  onReady: function () {
    setTimeout(() => this.getBloodSugarData(this.updateChart), 100);
  },

  tapRecord: function() {
    wx.navigateTo({
      url: './record'
    })
  },
  confirmRecord: function(e) {
    console.log("confirm blood sugar record", e.detail);
  },

  getBloodSugarData: function(success, fail) {
    wx.getStorage({
      key:'bloodSugar',
      success: (res) => {
        if (success !== null) 
          success.call(null, res.data);
      },
      fail: (error) => {
        console.log(error);
        if (fail !== null && fail !== undefined)
          fail.call(null)
      },
    });
  },
  updateBloodSugarData: function(data, records) {
    console.log(records)
    if (!data) 
      data = {};

    for (const key in records) {
      const record = records[key];
      let newData = [record.date, record.value];

      if (!data.hasOwnProperty(key)) {
        data[key] = [newData];
        continue;
      }
      
      let itemArr = data[key];
      let index = itemArr.findIndex(item => moment(item[0]).isSame(moment(record.date), 'day'));
      if (index >= 0) {
        data[key] = [
          ...itemArr.slice(0, index),
          newData,
          ...itemArr.slice(index + 1),
        ];
      } else {
        index = itemArr.findIndex(item => moment(item[0]).isAfter(moment(record.date), 'day'));
        if (index >= 0) {
          data[key] = [
            ...itemArr.slice(0, index),
            newData,
            ...itemArr.slice(index),
          ];
        } else {
          data[key] = [...itemArr, newData];
        }
      }
    }
    wx.setStorage({
      key: 'bloodSugar',
      data: data,
    });
    this.updateChart(data);
  },

  updateChart: function(chartData) {
    if (!chartData) 
      return;

    let yMax = 0;
    if (chartData[constants.KEY_FASTING]) {
      chartData[constants.KEY_FASTING].forEach(item => {
        yMax = Math.max(yMax, item[1]);
      });
    }
    if (chartData[constants.KEY_2H]) {
      chartData[constants.KEY_2H].forEach(item => {
        yMax = Math.max(yMax, item[1]);
      });
    }
    if (chartData[constants.KEY_NIGHT]) {
      chartData[constants.KEY_NIGHT].forEach(item => {
        yMax = Math.max(yMax, item[1]);
      });
    }
    yMax += 2;

    chart.setOption({
      yAxis: {
        max: yMax,
      },
      series: [{
        name: constants.KEY_FASTING,
        type: 'line',
        smooth: true,
        data: chartData[constants.KEY_FASTING],
      }, {
        name: constants.KEY_2H,
        type: 'line',
        smooth: true,
        data: chartData[constants.KEY_2H],
      }, {
        name: constants.KEY_NIGHT,
        type: 'line',
        smooth: true,
        data: chartData[constants.KEY_NIGHT],
      }],
    })
  }
})