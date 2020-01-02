//防抖节流
export function _debounce(fn, delay) {
	var delay = delay || 200;
	var timer;
	return function () {
		var th = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(function () {
			timer = null;
			fn.apply(th, args);
		}, delay);
	};
}
 
export function _throttle(fnName, interval) {
	var last;
	var timer;
	var interval = interval || 200;
	return function () {
		var th = this;
		var args = arguments;
		var now = +new Date();
		if (last && now - last < interval) {
			clearTimeout(timer);
			timer = setTimeout(function () {
				last = now;
				th[fnName] && th[fnName].apply(th, args);
			}, interval);
		} else {
			last = now;
			th[fnName] && th[fnName].apply(th, args);
		}
	}
}