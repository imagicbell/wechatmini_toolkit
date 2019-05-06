// pages/fetalMoveScale/fetalMoveScale.js
const { computed } = require('../../libs/vuefy.js')
const moment = require('../../libs/moment.js')

const CIRCLE_RADIUS = 120;
const PROGRESS_BAR_COLOR = '#ffffff';
const ONE_HOUR = 3600;

Page({

  /**
   * Page initial data
   */
  data: {
    context: null,
    contextSize: CIRCLE_RADIUS * 2,
    circle: {
      x: CIRCLE_RADIUS,
      y: CIRCLE_RADIUS,
      radius: CIRCLE_RADIUS,
    },
    progressBar: {
      x: CIRCLE_RADIUS,
      y: CIRCLE_RADIUS,
      radius: CIRCLE_RADIUS * 0.9,
    },
    started: false,
    timeElapsed: 0, //单位s
    timerId: -1,
    counter: 0,

    recordData: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    computed(this, {
      timeAngle: function() {
        return -360 * this.data.timeElapsed / ONE_HOUR;
      },
      timeText: function() {
        let minute = Math.floor(this.data.timeElapsed / 60);
        let second = this.data.timeElapsed - minute * 60;
        return `${minute}:${second < 10 ? '0'+second : second}`;
      },
    });

    this.loadData();
  },

  onUnload: function() {
    clearInterval(this.data.timerId);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    const context = wx.createCanvasContext("timer-canvas");
    this.setData({ context });
    this.drawProgress(1);
  },

  tapStart: function() {
    this.startTimer();
  },

  tapEnd: function() {
    wx.showModal({
      content: 'This record can\'t be saved if you stop ahead of time.',
      confirmText: "Confirm",
      cancelText: "Cancel",
      success: res => {
        if (res.confirm) {
          this.stopTimer();
          this.drawProgress(1);
        }
      }
    });
  },

  tapCount: function() {
    this.setData({
      counter: this.data.counter + 1
    })
  },

  startTimer: function() {
    const timerId = setInterval(this.updateTime, 1000);
    this.setData({ 
      started: true,
      timeElapsed: 0,
      timerId,
      counter: 0
    });
  },

  stopTimer: function() {
    clearInterval(this.data.timerId);
    this.setData({
      started: false, 
      timerId: -1, 
    });
  },

  updateTime: function() {
    let timeElapsed = this.data.timeElapsed;
    timeElapsed += 1;
    this.setData({ timeElapsed });
    console.log("minutes elapsed: ", this.data.timeElapsed);
    
    if (timeElapsed === ONE_HOUR) {
      console.log("finish 1h");
      this.stopTimer();
      this.saveData();
    }

    this.drawProgress(1 - timeElapsed / ONE_HOUR);
  },

  drawProgress: function(progress) {
    const context = this.data.context;
    context.clearRect(0, 0, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 2);

    const progressBar = this.data.progressBar;
    context.beginPath();
    context.setStrokeStyle(PROGRESS_BAR_COLOR);
    context.setLineWidth(6);
    context.arc(progressBar.x, progressBar.y, progressBar.radius, -0.5 * Math.PI, (-0.5 + 2 * progress) * Math.PI);
    context.stroke();

    context.draw();
  },

  loadData: function() {
    wx.getStorage({
      key: 'fetalMove',
      success: (res) => {
        console.log("load fetal move data: ", res.data);
        this.setData({recordData: res.data});
      },
      fail: (error) => {
        console.log(error);
      }
    });
  },

  saveData: function() {
    let startTime = moment().subtract(1, 'hours');
    this.setData({
      recordData: [
        ...this.data.recordData,
        {
          time: startTime,
          count: this.data.counter
        }
      ]
    });

    wx.setStorage({
      key: 'fetalMove',
      data: this.data.recordData,
    })
  }
})