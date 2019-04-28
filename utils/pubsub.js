/* /plugins/pubsub.js
 * 一个简单的PubSub
 */
export default class PubSub {
  constructor() {
    this.PubSubCache = {
      $uid: 0
    };
  }

  on(type, handler) {
    let cache = this.PubSubCache[type] || (this.PubSubCache[type] = {});

    handler.$uid = handler.$uid || this.PubSubCache.$uid++;
    cache[handler.$uid] = handler;
  }

  emit(type, ...param) {
    let cache = this.PubSubCache[type];
    if(!cache) return;

    for(let key in cache) {
      cache[key].call(this, ...param);
    }
  }

  off(type, handler) {
    let cache = this.PubSubCache[type];

    if(!handler) {
      if(!cache) return true;
      return !!cache && (delete this.PubSubCache[type]);
    } else {
      !!cache && (delete this.PubSubCache[type][handler.$uid]);
    }

    return cache.keys().length === 0 && (delete this.PubSubCache[type]);
  }
}