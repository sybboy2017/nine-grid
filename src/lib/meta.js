(function () {
    const ua = navigator.userAgent;
    const android = ua.match(/Android \d\.\d/);
    // const ios = ua.match(/iPhone OS \d.\d.\d/);
    const androidVersion = android && android[0].match(/\d.\d/) && parseFloat(android && android[0].match(/\d.\d/)[0]);
    const baseWidth = 375;
    let nowWidth = baseWidth;
    // window.screen.width > 600 ? window.screen.width / 3 : window.screen.width;
    let basicFontSize = 32;

    if (nowWidth < 375) {
        nowWidth = 375;
    }
    basicFontSize *= (nowWidth / baseWidth);

    function rootFontSize(size) {
        const css = `html,body{font-size:${size}px !important;}`;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
        // document.write('<style>html,body{font-size:' + size + 'px !important;}</style>')
    }

    function _scale(zoom) {
		const meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = `width=device-width, initial-scale=${zoom}, minimum-scale=${zoom}, maximum-scale=${zoom}`;
		document.getElementsByTagName('head')[0].appendChild(meta);
    }

    function isScale() {
        let result = true;
        if (/KTU84P/.test(ua)) {
            result = false;
        }
        if (android) {
            if (androidVersion <= 4.3) {
                result = false;
            } else if (androidVersion <= 4.4) {
                const type = [/A31/, /R8207/, /R8170/, /R8270/, /R7c/];
                for (let i = 0; i < type.length; i += 1) {
                    if (type[i].test(ua)) {
                        result = false;
                    }
                }
            }
        }
        return result;
    }


    if (!isScale()) {
        rootFontSize(16);
        _scale(1);
    } else {
        _scale(0.5);
        rootFontSize(basicFontSize);
    }
}());
