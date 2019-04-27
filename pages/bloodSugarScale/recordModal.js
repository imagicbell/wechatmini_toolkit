const constants = require('./constants.js');

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    isHidden: true,
    key: constants.KEY_FASTING,
  },

  /**
   * Component methods
   */
  methods: {
    show() {
      this.setData({
        isHidden: true,
      })
    },
    hide() {
      this.setData({
        isHidden: false
      })
    },
  }
})
