// pages/weightScale/recordModal.js
const moment = require('../../libs/moment.js');

Component({
  /**
   * Component properties
   */
  properties: {
    date: {
      type: String,
      value: moment().format('YYYY-MM-DD'),
    },
    weight: {
      type: Number,
      value: 100,
    },
  },

  /**
   * Component initial data
   */
  data: {
    isHidden: true,
  },

  /**
   * Component methods
   */
  methods: {
    show() {
      this.setData({
        isHidden: false,
        date: moment().format('YYYY-MM-DD'),
      })
    },
    hide() {
      this.setData({
        isHidden: true
      })
    },
    tapConfirm() {
      this.hide();
      this.triggerEvent("confirm", {
        date: this.data.date,
        weight: this.data.weight,
      });
    },
    tapCancel() {
      this.hide();
    },
    onSelectTime(e) {
      this.setData({
        date: moment(e.detail.value).format('YYYY-MM-DD'),
      })
    },
    onChangeWeight(e) {
      this.setData({
        weight: e.detail.value
      });
    }
  }
})
