// pages/fetalMoveScale/fetalMoveScale.js

const CIRCLE_RADIUS = 120;
const PROGRESS_BAR_COLOR = '#ffffff';

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
    timeElapsed: 0,
    timerId: -1,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    const context = wx.createCanvasContext("timer-canvas");
    this.setData({ context });
    this.drawProgress(1);
    this.tapStart();
  },

  tapStart: function() {
    const timerId = setInterval(this.updateTime, 1000);
    this.setData({ 
      timeElapsed: 0,
      timerId
    });
  },

  updateTime: function() {
    let timeElapsed = this.data.timeElapsed;
    timeElapsed += 1;
    this.setData({ timeElapsed });
    console.log("minutes elapsed: ", this.data.timeElapsed);
    
    if (timeElapsed === 60) {
      console.log("finish 1h");
      clearInterval(this.data.timerId);
      this.setData({ timerId: -1 });
    }

    this.drawProgress(1 - timeElapsed / 60);
  },

  drawProgress: function(progress) {
    const context = this.data.context;
    context.clearRect(0, 0, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 2);

    const progressBar = this.data.progressBar;
    context.beginPath();
    context.setStrokeStyle(PROGRESS_BAR_COLOR);
    context.setLineWidth(6);
    context.arc(progressBar.x, progressBar.y, progressBar.radius, 0, 2 * Math.PI * progress);
    context.stroke();
    

    context.draw();
  }
})