// pages/bloodSugarScale/record.js
const constants = require('./constants.js');
const moment = require('../../libs/moment.js');

let app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    tabs: [constants.KEY_FASTING, constants.KEY_2H, constants.KEY_NIGHT],
    records: [{
        date: moment().format(constants.timeFormat),
        value: undefined,
      }, {
        date: moment().format(constants.timeFormat),
        value: undefined,
      }, {
        date: moment().format(constants.timeFormat),
        value: undefined,
      }
    ],

    activeTabIndex: 0,
    sliderWidth: 96,
    sliderLeft: 0,
    sliderOffset: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - this.data.sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeTabIndex
        })
      }
    })
  },

  onUnload: function() {
    let records = {};
    if (this.data.records[0].value !== undefined) {
      records[constants.KEY_FASTING] = this.data.records[0];
    }
    if (this.data.records[1].value !== undefined) {
      records[constants.KEY_2H] = this.data.records[1];
    }
    if (this.data.records[2].value !== undefined) {
      records[constants.KEY_NIGHT] = this.data.records[2];
    }
    app.pubsub.emit("finish_record_bloodSugar", records);
  },

  tapTab: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeTabIndex: parseInt(e.currentTarget.id),
    })
  },

  onChangeDate: function(e) {
    let oldRecords = this.data.records;
    this.setData({
      records: [
        ...oldRecords.slice(0, this.data.activeTabIndex),
        {
          ...oldRecords[this.data.activeTabIndex],
          date: moment(e.detail.value).format(constants.timeFormat),
        },
        ...oldRecords.slice(this.data.activeTabIndex + 1),
      ]
    })
  },

  onChangeBloodSugarValue: function(e) {
    let oldRecords = this.data.records;
    this.setData({
      records: [
        ...oldRecords.slice(0, this.data.activeTabIndex),
        {
          ...oldRecords[this.data.activeTabIndex],
          value: e.detail.value,
        },
        ...oldRecords.slice(this.data.activeTabIndex + 1),
      ]
    })
  }
})