// pages/weightScale/recordModal.js
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
  },

  /**
   * Component methods
   */
  methods: {
    show() {
      this.setData({
        isHidden: false
      })
    },
    hide() {
      this.setData({
        isHidden: true
      })
    },
  }
})
