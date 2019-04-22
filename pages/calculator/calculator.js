const Decimal = require('../../libs/decimal.js')
const { computed, watch } = require('../../libs/vuefy.js')

Page({
  data: {
    inputDatas: [
      { key: 'AC', flexGrow: 0 },
      { key: '+/-', flexGrow: 0 },
      { key: '%', flexGrow: 0 },
      { key: '/', flexGrow: 0 },
      { key: '7', flexGrow: 0 },
      { key: '8', flexGrow: 0 },
      { key: '9', flexGrow: 0 },
      { key: '*', flexGrow: 0 },
      { key: '4', flexGrow: 0 },
      { key: '5', flexGrow: 0 },
      { key: '6', flexGrow: 0 },
      { key: '-', flexGrow: 0 },
      { key: '1', flexGrow: 0 },
      { key: '2', flexGrow: 0 },
      { key: '3', flexGrow: 0 },
      { key: '+', flexGrow: 0 },
      { key: '0', flexGrow: 1 },
      { key: '.', flexGrow: 0 },
      { key: '=', flexGrow: 0 },
    ],
    screenData: '0',
    inputQueue: [],
    waitForNewInput: true,
  },
  onLoad: function() {
    computed(this, {
      displayedData: function() {
        let prefix = this.data.screenData;
        let suffix = '';
        let index = prefix.indexOf('.');
        if (index >= 0) {
          suffix = prefix.substring(index);
          prefix = prefix.substring(0, index);
        }
        let start = prefix.length % 3;
        let result = '';
        for (let i = 0; i < prefix.length; i++) {
          if (i > 0 && (i - start) % 3 === 0) {
            result += ',';
          }
          result += prefix[i];
        }
        result += suffix;
        return result;
      }
    })
  },
  tapInput: function(event) {
    const key = event.target.dataset.key;
    console.log("tap: ", key);
    
    let inputQueue = this.data.inputQueue;
    let screenData = this.data.screenData;
    let waitForNewInput = this.data.waitForNewInput;

    switch(key) {
      case 'AC': 
        this.setData({
          inputQueue: [],
          screenData: '0',
          waitForNewInput: true
        });
        break;

      case '+/-':
        if (screenData[0] === '-') {
          screenData = screenData.substring(1);
        } else {
          screenData = '-' + screenData;
        }
        this.setData({
          screenData,
          waitForNewInput: false
        });
        break;
      
      case '%':
        let data = parseFloat(screenData);
        data *= 0.01;
        screenData = data.toString();
        this.setData({
          screenData,
          waitForNewInput: true
        });
        break;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (waitForNewInput) {
          screenData = key;
        } else {
          if (screenData === '0') {
            screenData = key;
          } else {
            if (screenData.includes('.') && screenData.length < 16 ||
                !screenData.includes('.') && screenData.length < 15) {
                  screenData += key;
            }
          }
        }
        this.setData({
          screenData,
          waitForNewInput: false
        });
        break;

      case '.':
        if (waitForNewInput) {
          screenData = '0.';
        } else {
          screenData += '.';
        }
        this.setData({
          screenData,
          waitForNewInput: false
        });
        break;

      case '/':
      case '*':
      case '+':
      case '-':
        inputQueue.push(screenData);
        console.log(inputQueue);
        if (inputQueue.length === 3) {
          screenData = this.calculate(inputQueue).toString();
          inputQueue = [screenData];
        } 
        inputQueue.push(key);
        this.setData({
          screenData,
          inputQueue,
          waitForNewInput: true
        });
        break;  

      case '=':
        inputQueue.push(screenData);
        screenData = this.calculate(inputQueue).toString();
        inputQueue = [];
        this.setData({
          screenData,
          inputQueue,
          waitForNewInput: true
        });
        break;
    }
  },
  calculate: function(inputQueue) {
    let data1 = parseFloat(inputQueue[0]);
    let data2 = parseFloat(inputQueue[2]);
    let result = 0;
    switch(inputQueue[1]) {
      case '/':
        result = Decimal.div(data1, data2);
        break;
      case '*':
        result = Decimal.mul(data1, data2);
        break;
      case '+':
        result = Decimal.add(data1, data2);
        break;
      case '-':
        result = Decimal.sub(data1, data2);
        break;
    }
    return result;
  },
})