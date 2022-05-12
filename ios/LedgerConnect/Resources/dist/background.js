(() => {
var $318647308e3525fd$exports = {};
"use strict";
Object.defineProperty($318647308e3525fd$exports, "__esModule", {
    value: true
});
// MIT © 2017 azu
var $318647308e3525fd$var$hasOwn = Object.prototype.hasOwnProperty;
// Object.is ponyfill
$318647308e3525fd$exports.is = function(x, y) {
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
 */ $318647308e3525fd$exports.shallowEqual = function(objectA, objectB, options) {
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
    var isEqual = options && typeof options.customEqual === "function" ? options.customEqual : $318647308e3525fd$exports.is;
    for(var i = 0; i < keysA.length; i++){
        var key = keysA[i];
        if (!$318647308e3525fd$var$hasOwn.call(objectB, key) || !isEqual(objectA[key], objectB[key])) {
            var out;
            return false;
        }
    }
    return true;
};


class $954e4e4dc54c446a$export$d53114150807fd22 {
    constructor(props){
        this.props = Object.freeze(props);
    }
    equals(vo) {
        if (vo === null || vo === undefined) return false;
        if (vo.props === undefined) return false;
        return $318647308e3525fd$exports.shallowEqual(this.props, vo.props);
    }
}




let $49c5a02eaa106cab$export$8d9ecf8a6190d0ad;
(function($49c5a02eaa106cab$export$8d9ecf8a6190d0ad) {
    $49c5a02eaa106cab$export$8d9ecf8a6190d0ad["ConnectDapp"] = 'connectDapp';
    $49c5a02eaa106cab$export$8d9ecf8a6190d0ad["SignAndSendTransaction"] = 'signAndSendTransaction';
    $49c5a02eaa106cab$export$8d9ecf8a6190d0ad["SignTransaction"] = 'signTransaction';
    $49c5a02eaa106cab$export$8d9ecf8a6190d0ad["SignPersonalMessage"] = 'signPersonalMessage';
})($49c5a02eaa106cab$export$8d9ecf8a6190d0ad || ($49c5a02eaa106cab$export$8d9ecf8a6190d0ad = {}));
let $49c5a02eaa106cab$export$a7e1148f0e98483a;
(function($49c5a02eaa106cab$export$a7e1148f0e98483a) {
    $49c5a02eaa106cab$export$a7e1148f0e98483a["ConnectDapp"] = 'eth_requestAccounts';
    $49c5a02eaa106cab$export$a7e1148f0e98483a["SignAndSendTransaction"] = 'eth_sendTransaction';
    $49c5a02eaa106cab$export$a7e1148f0e98483a["SignPersonalMessage"] = 'signPersonalMessage';
})($49c5a02eaa106cab$export$a7e1148f0e98483a || ($49c5a02eaa106cab$export$a7e1148f0e98483a = {}));
let $49c5a02eaa106cab$export$6f8959d005e6c8f0;
(function($49c5a02eaa106cab$export$6f8959d005e6c8f0) {
    $49c5a02eaa106cab$export$6f8959d005e6c8f0["ConnectDapp"] = 'solana_getAccount';
    $49c5a02eaa106cab$export$6f8959d005e6c8f0["SignAndSendTransaction"] = 'solana_signAndSendTransaction';
    $49c5a02eaa106cab$export$6f8959d005e6c8f0["SignTransaction"] = 'solana_signTransaction';
    $49c5a02eaa106cab$export$6f8959d005e6c8f0["SignAllTransactions"] = 'solana_signAllTransactions';
})($49c5a02eaa106cab$export$6f8959d005e6c8f0 || ($49c5a02eaa106cab$export$6f8959d005e6c8f0 = {}));
class $49c5a02eaa106cab$export$3d1391be359ed341 extends $954e4e4dc54c446a$export$d53114150807fd22 {
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
        return new $49c5a02eaa106cab$export$3d1391be359ed341(props);
    }
}


let $479e784236c1fcf9$export$908ff786c04d5297;
(function($479e784236c1fcf9$export$908ff786c04d5297) {
    $479e784236c1fcf9$export$908ff786c04d5297["solana"] = "solana";
    $479e784236c1fcf9$export$908ff786c04d5297["ethereum"] = "ethereum";
    $479e784236c1fcf9$export$908ff786c04d5297["content"] = "content";
    $479e784236c1fcf9$export$908ff786c04d5297["background"] = "background";
    $479e784236c1fcf9$export$908ff786c04d5297["popup"] = "popup";
})($479e784236c1fcf9$export$908ff786c04d5297 || ($479e784236c1fcf9$export$908ff786c04d5297 = {}));
async function $479e784236c1fcf9$export$61027ddcc22c3df2(message) {
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
function $479e784236c1fcf9$export$8c67b4fe4bab8610(request) {
    let message = {
        sender: $479e784236c1fcf9$export$908ff786c04d5297.popup,
        destination: $479e784236c1fcf9$export$908ff786c04d5297.content,
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


const $53382f7b3a533fc6$export$2b1d391cd05230fd = (fileName)=>(message, ...others)=>{
        console.log(`[${fileName}.js] ${message}`, ...others);
    }
;
const $53382f7b3a533fc6$export$b522027998979def = (fileName)=>(message, ...others)=>console.error(`[${fileName}.js] ${message}`, ...others)
;


const $76daf2678a5c69cb$var$log = $53382f7b3a533fc6$export$2b1d391cd05230fd('background');
browser.runtime.onMessage.addListener(async (request, sender)=>{
    $76daf2678a5c69cb$var$log('Receive message', request, request.getValue, sender);
    const message = request;
    if (!message || message.destination !== $479e784236c1fcf9$export$908ff786c04d5297.background) return undefined;
    const { method: method , id: id  } = message.request;
    switch(method){
        case $49c5a02eaa106cab$export$a7e1148f0e98483a.ConnectDapp:
            {
                $76daf2678a5c69cb$var$log('receive ETH request accounts', message.request);
                const result = await $479e784236c1fcf9$export$61027ddcc22c3df2(message.request);
                $76daf2678a5c69cb$var$log('request accounts result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 3000);
                // });
                // const result = { id, value: ['0x51a4f8419aC902006211786a5648F0cc14aa7074'] };
                return result;
            }
        case $49c5a02eaa106cab$export$a7e1148f0e98483a.SignAndSendTransaction:
            {
                $76daf2678a5c69cb$var$log('receive ETH send transaction', message.request);
                const result = await $479e784236c1fcf9$export$61027ddcc22c3df2(message.request);
                $76daf2678a5c69cb$var$log('send transaction result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 4000);
                // });
                // const result = {
                //   id: 1648642005769,
                //   method: 'eth_sendTransaction',
                //   value:
                //     '0x02f8d1030d8509427a0a60851284f4151482cf0894c778417e063141139fce010982780140aa0cd5ab80b86423b872dd000000000000000000000000ce7bae6d741abade3a7c03030cc37cf2ad0f19fe0000000000000000000000001600e1a05b4126ed0937f5e2d00f6171e359afba000000000000000000000000000000000000000000000000000009184e72a000c001a008a432ce2d7a19139324cfca7169b4e7b678e07cd6f61fc070290c3072286691a0121d9ee27c908182fb7a3e70935b3bc4285fc4241313810395fc7ae69500ac03',
                // };
                return result;
            }
        case $49c5a02eaa106cab$export$a7e1148f0e98483a.SignPersonalMessage:
            {
                $76daf2678a5c69cb$var$log('receive ETH sign personal message', message.request);
                const result = await $479e784236c1fcf9$export$61027ddcc22c3df2(message.request);
                $76daf2678a5c69cb$var$log('send transaction result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 4000);
                // });
                // const result = {
                //   id,
                //   value: '0x0c52dc17fbc8eafe95c9225484c2360c793296b43bbf7de5…eca87419c9dbf5be5bdbfdad4a4f3cb6d8eeb8a7116bd4901',
                // };
                return result;
            }
        case $49c5a02eaa106cab$export$6f8959d005e6c8f0.ConnectDapp:
            {
                $76daf2678a5c69cb$var$log('receive SOL request accounts', message.request);
                const result = await $479e784236c1fcf9$export$61027ddcc22c3df2(message.request);
                $76daf2678a5c69cb$var$log('request accounts result', result);
                // await new Promise((resolve) => {
                //   setTimeout(resolve, 3000);
                // });
                // const result = { id, value: ['GxhLFJ7XoCoxLdcLBzvycknww3yqzBfDe5ra61EdUEAR'] };
                return result;
            }
        case $49c5a02eaa106cab$export$6f8959d005e6c8f0.SignAndSendTransaction:
        case $49c5a02eaa106cab$export$6f8959d005e6c8f0.SignTransaction:
        case $49c5a02eaa106cab$export$6f8959d005e6c8f0.SignAllTransactions:
            {
                $76daf2678a5c69cb$var$log('receive SOL sign and send transaction', message.request);
                const result = await $479e784236c1fcf9$export$61027ddcc22c3df2(message.request);
                $76daf2678a5c69cb$var$log('solana sign transaction result', result);
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
            $76daf2678a5c69cb$var$log(`unexpected request method ${method}`);
    }
    return undefined;
});
$76daf2678a5c69cb$var$log(`loaded`);

})();
//# sourceMappingURL=background.js.map
