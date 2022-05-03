(() => {
var $17166201e7aeaf64$exports = {};
"use strict";
Object.defineProperty($17166201e7aeaf64$exports, "__esModule", {
    value: true
});
// MIT © 2017 azu
var $17166201e7aeaf64$var$hasOwn = Object.prototype.hasOwnProperty;
// Object.is ponyfill
$17166201e7aeaf64$exports.is = function(x, y) {
    if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y;
    else return x !== x && y !== y;
};
/**
 * Return true, if `objectA` is shallow equal to `objectB`.
 * Pass Custom equality function to `customEqual`.
 * Default equality is `Object.is`
 *
 * Options:
 *
 * - `customEqual`: function should return true if the `a` value is equal to `b` value.
 * - `debug`: enable debug info to console log. This log will be disable in production build
 */ $17166201e7aeaf64$exports.shallowEqual = function(objectA, objectB, options) {
    if (objectA === objectB) return true;
    if (typeof objectA !== "object" || objectA === null) {
        var out;
        return false;
    }
    if (typeof objectB !== "object" || objectB === null) {
        var out;
        return false;
    }
    var keysA = Object.keys(objectA);
    var keysB = Object.keys(objectB);
    if (keysA.length !== keysB.length) {
        var out;
        return false;
    }
    var isEqual = options && typeof options.customEqual === "function" ? options.customEqual : $17166201e7aeaf64$exports.is;
    for(var i = 0; i < keysA.length; i++){
        var key = keysA[i];
        if (!$17166201e7aeaf64$var$hasOwn.call(objectB, key) || !isEqual(objectA[key], objectB[key])) {
            var out;
            return false;
        }
    }
    return true;
};


class $ddce45652d33f7aa$export$d53114150807fd22 {
    constructor(props){
        this.props = Object.freeze(props);
    }
    equals(vo) {
        if (vo === null || vo === undefined) return false;
        if (vo.props === undefined) return false;
        return $17166201e7aeaf64$exports.shallowEqual(this.props, vo.props);
    }
}




let $ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad;
(function($ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad) {
    $ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad["ConnectDapp"] = 'connectDapp';
    $ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad["SignAndSendTransaction"] = 'signAndSendTransaction';
    $ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad["SignTransaction"] = 'signTransaction';
    $ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad["SignPersonalMessage"] = 'signPersonalMessage';
})($ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad || ($ebac0c3c7faf13a9$export$8d9ecf8a6190d0ad = {}));
let $ebac0c3c7faf13a9$export$a7e1148f0e98483a;
(function($ebac0c3c7faf13a9$export$a7e1148f0e98483a) {
    $ebac0c3c7faf13a9$export$a7e1148f0e98483a["ConnectDapp"] = 'eth_requestAccounts';
    $ebac0c3c7faf13a9$export$a7e1148f0e98483a["SignAndSendTransaction"] = 'eth_sendTransaction';
    $ebac0c3c7faf13a9$export$a7e1148f0e98483a["SignPersonalMessage"] = 'signPersonalMessage';
})($ebac0c3c7faf13a9$export$a7e1148f0e98483a || ($ebac0c3c7faf13a9$export$a7e1148f0e98483a = {}));
let $ebac0c3c7faf13a9$export$6f8959d005e6c8f0;
(function($ebac0c3c7faf13a9$export$6f8959d005e6c8f0) {
    $ebac0c3c7faf13a9$export$6f8959d005e6c8f0["ConnectDapp"] = 'solana_getAccount';
    $ebac0c3c7faf13a9$export$6f8959d005e6c8f0["SignAndSendTransaction"] = 'solana_signAndSendTransaction';
    $ebac0c3c7faf13a9$export$6f8959d005e6c8f0["SignTransaction"] = 'solana_signTransaction';
    $ebac0c3c7faf13a9$export$6f8959d005e6c8f0["SignAllTransactions"] = 'solana_signAllTransactions';
})($ebac0c3c7faf13a9$export$6f8959d005e6c8f0 || ($ebac0c3c7faf13a9$export$6f8959d005e6c8f0 = {}));
class $ebac0c3c7faf13a9$export$3d1391be359ed341 extends $ddce45652d33f7aa$export$d53114150807fd22 {
    getID() {
        return this.props.id;
    }
    getType() {
        return this.props.type;
    }
    getMethod() {
        return this.props.method;
    }
    getPayload() {
        return this.props.payload;
    }
    getChain() {
        return this.props.chain;
    }
    static create(props) {
        return new $ebac0c3c7faf13a9$export$3d1391be359ed341(props);
    }
}


let $f047d79a9426f7d2$export$908ff786c04d5297;
(function($f047d79a9426f7d2$export$908ff786c04d5297) {
    $f047d79a9426f7d2$export$908ff786c04d5297["solana"] = "solana";
    $f047d79a9426f7d2$export$908ff786c04d5297["ethereum"] = "ethereum";
    $f047d79a9426f7d2$export$908ff786c04d5297["content"] = "content";
    $f047d79a9426f7d2$export$908ff786c04d5297["background"] = "background";
    $f047d79a9426f7d2$export$908ff786c04d5297["popup"] = "popup";
})($f047d79a9426f7d2$export$908ff786c04d5297 || ($f047d79a9426f7d2$export$908ff786c04d5297 = {}));
async function $f047d79a9426f7d2$export$61027ddcc22c3df2(message) {
    try {
        return browser.runtime.sendNativeMessage('application.id', message);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        console.error('Caught error in backend messaging', errorMessage);
        return {
            ...message,
            error: errorMessage
        };
    }
}
function $f047d79a9426f7d2$export$8c67b4fe4bab8610(request) {
    let message = {
        sender: $f047d79a9426f7d2$export$908ff786c04d5297.popup,
        destination: $f047d79a9426f7d2$export$908ff786c04d5297.content,
        request: request
    };
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs)=>{
        const [tab] = tabs;
        if (tab && tab.id) browser.tabs.sendMessage(tab.id, message);
    });
}


const $1feaf5137e56a072$export$2b1d391cd05230fd = (fileName)=>(message, ...others)=>{
        console.log(`[${fileName}.js] ${message}`, ...others);
    }
;
const $1feaf5137e56a072$export$b522027998979def = (fileName)=>(message, ...others)=>console.error(`[${fileName}.js] ${message}`, ...others)
;


const $07c03eb40a016611$var$log = $1feaf5137e56a072$export$2b1d391cd05230fd('background');
browser.runtime.onMessage.addListener(async (request, sender)=>{
    $07c03eb40a016611$var$log('Receive message', request, request.getValue, sender);
    const message = request;
    if (!message || message.destination !== $f047d79a9426f7d2$export$908ff786c04d5297.background) return undefined;
    const { method: method , id: id  } = message.request;
    switch(method){
        case $ebac0c3c7faf13a9$export$a7e1148f0e98483a.ConnectDapp:
            {
                $07c03eb40a016611$var$log('receive ETH request accounts', message.request);
                const result = await $f047d79a9426f7d2$export$61027ddcc22c3df2(message.request);
                $07c03eb40a016611$var$log('request accounts result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 3000);
                // });
                // const result = { id, value: ['0x51a4f8419aC902006211786a5648F0cc14aa7074'] };
                return result;
            }
        case $ebac0c3c7faf13a9$export$a7e1148f0e98483a.SignAndSendTransaction:
            {
                $07c03eb40a016611$var$log('receive ETH send transaction', message.request);
                const result = await $f047d79a9426f7d2$export$61027ddcc22c3df2(message.request);
                $07c03eb40a016611$var$log('send transaction result', result);
                await new Promise((resolve)=>{
                    setTimeout(resolve, 4000);
                });
                // const result = {
                //   id: 1648642005769,
                //   method: 'eth_sendTransaction',
                //   value:
                //     '0x02f8d1030d8509427a0a60851284f4151482cf0894c778417e063141139fce010982780140aa0cd5ab80b86423b872dd000000000000000000000000ce7bae6d741abade3a7c03030cc37cf2ad0f19fe0000000000000000000000001600e1a05b4126ed0937f5e2d00f6171e359afba000000000000000000000000000000000000000000000000000009184e72a000c001a008a432ce2d7a19139324cfca7169b4e7b678e07cd6f61fc070290c3072286691a0121d9ee27c908182fb7a3e70935b3bc4285fc4241313810395fc7ae69500ac03',
                // };
                return result;
            }
        case $ebac0c3c7faf13a9$export$a7e1148f0e98483a.SignPersonalMessage:
            {
                $07c03eb40a016611$var$log('receive ETH sign personal message', message.request);
                const result = await $f047d79a9426f7d2$export$61027ddcc22c3df2(message.request);
                $07c03eb40a016611$var$log('send transaction result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 4000);
                // });
                // const result = {
                //   id,
                //   value: '0x0c52dc17fbc8eafe95c9225484c2360c793296b43bbf7de5…eca87419c9dbf5be5bdbfdad4a4f3cb6d8eeb8a7116bd4901',
                // };
                return result;
            }
        case $ebac0c3c7faf13a9$export$6f8959d005e6c8f0.ConnectDapp:
            {
                $07c03eb40a016611$var$log('receive SOL request accounts', message.request);
                const result = await $f047d79a9426f7d2$export$61027ddcc22c3df2(message.request);
                $07c03eb40a016611$var$log('request accounts result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 3000);
                // });
                // const result = { id, value: ['GxhLFJ7XoCoxLdcLBzvycknww3yqzBfDe5ra61EdUEAR'] };
                return result;
            }
        case $ebac0c3c7faf13a9$export$6f8959d005e6c8f0.SignAndSendTransaction:
        case $ebac0c3c7faf13a9$export$6f8959d005e6c8f0.SignTransaction:
        case $ebac0c3c7faf13a9$export$6f8959d005e6c8f0.SignAllTransactions:
            {
                $07c03eb40a016611$var$log('receive SOL sign and send transaction', message.request);
                const result = await $f047d79a9426f7d2$export$61027ddcc22c3df2(message.request);
                $07c03eb40a016611$var$log('solana sign transaction result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 3000);
                // });
                // const result = {
                //   value: '4a2AySzhrAxXoMqQZ1MvFZx7Fg9YuztXXyDtji54mijNNqJGaCrhGdeG8SxS4y2NFSX6HBzq2wJRnkxb3LeodSPg',
                //   id,
                // };
                return result;
            }
        default:
            $07c03eb40a016611$var$log(`unexpected request method ${method}`);
    }
    return undefined;
});
$07c03eb40a016611$var$log(`loaded`);

})();
//# sourceMappingURL=background.js.map
