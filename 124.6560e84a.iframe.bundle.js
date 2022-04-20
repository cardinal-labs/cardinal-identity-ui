"use strict";(self.webpackChunk_cardinal_namespaces_components=self.webpackChunk_cardinal_namespaces_components||[]).push([[124],{"./node_modules/@solflare-wallet/sdk/lib/esm/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>esm});var extendStatics,eventemitter3=__webpack_require__("./node_modules/eventemitter3/index.js"),eventemitter3_default=__webpack_require__.n(eventemitter3),__extends=(extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)Object.prototype.hasOwnProperty.call(b,p)&&(d[p]=b[p])},extendStatics(d,b)},function(d,b){if("function"!=typeof b&&null!==b)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)});const base=function(_super){function WalletAdapter(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(WalletAdapter,_super),WalletAdapter}(eventemitter3_default());var index_browser_esm=__webpack_require__("./node_modules/@solana/web3.js/lib/index.browser.esm.js"),bs58=__webpack_require__("./node_modules/bs58/index.js"),bs58_default=__webpack_require__.n(bs58);class Wallet extends(eventemitter3_default()){constructor(provider,network){var _this;if(super(),_this=this,this._handleMessage=e=>{if(this._injectedProvider&&e.source===window||e.origin===this._providerUrl.origin&&e.source===this._popup)if("connected"===e.data.method){const newPublicKey=new index_browser_esm.PublicKey(e.data.params.publicKey);this._publicKey&&this._publicKey.equals(newPublicKey)||(this._publicKey&&!this._publicKey.equals(newPublicKey)&&this._handleDisconnect(),this._publicKey=newPublicKey,this._autoApprove=!!e.data.params.autoApprove,this.emit("connect",this._publicKey))}else if("disconnected"===e.data.method)this._handleDisconnect();else if((e.data.result||e.data.error)&&this._responsePromises.has(e.data.id)){const[resolve,reject]=this._responsePromises.get(e.data.id);e.data.result?resolve(e.data.result):reject(new Error(e.data.error))}},this._handleConnect=()=>(this._handlerAdded||(this._handlerAdded=!0,window.addEventListener("message",this._handleMessage),window.addEventListener("beforeunload",this.disconnect)),this._injectedProvider?new Promise((resolve=>{this._sendRequest("connect",{}),resolve()})):(window.name="parent",this._popup=window.open(this._providerUrl.toString(),"_blank","location,resizable,width=460,height=675"),new Promise((resolve=>{this.once("connect",resolve)})))),this._handleDisconnect=()=>{this._handlerAdded&&(this._handlerAdded=!1,window.removeEventListener("message",this._handleMessage),window.removeEventListener("beforeunload",this.disconnect)),this._publicKey&&(this._publicKey=null,this.emit("disconnect")),this._responsePromises.forEach((([resolve,reject],id)=>{this._responsePromises.delete(id),reject("Wallet disconnected")}))},this._sendRequest=async function(method,params){if("connect"!==method&&!_this.connected)throw new Error("Wallet not connected");const requestId=_this._nextRequestId;return++_this._nextRequestId,new Promise(((resolve,reject)=>{_this._responsePromises.set(requestId,[resolve,reject]),_this._injectedProvider?_this._injectedProvider.postMessage({jsonrpc:"2.0",id:requestId,method,params:{network:_this._network,...params}}):(_this._popup.postMessage({jsonrpc:"2.0",id:requestId,method,params},_this._providerUrl.origin),_this.autoApprove||_this._popup.focus())}))},this.connect=()=>(this._popup&&this._popup.close(),this._handleConnect()),this.disconnect=async function(){_this._injectedProvider&&await _this._sendRequest("disconnect",{}),_this._popup&&_this._popup.close(),_this._handleDisconnect()},this.sign=async function(data,display){if(!(data instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");const response=await _this._sendRequest("sign",{data,display});return{signature:bs58_default().decode(response.signature),publicKey:new index_browser_esm.PublicKey(response.publicKey)}},this.signTransaction=async function(transaction){const response=await _this._sendRequest("signTransaction",{message:bs58_default().encode(transaction.serializeMessage())}),signature=bs58_default().decode(response.signature),publicKey=new index_browser_esm.PublicKey(response.publicKey);return transaction.addSignature(publicKey,signature),transaction},this.signAllTransactions=async function(transactions){const response=await _this._sendRequest("signAllTransactions",{messages:transactions.map((tx=>bs58_default().encode(tx.serializeMessage())))}),signatures=response.signatures.map((s=>bs58_default().decode(s))),publicKey=new index_browser_esm.PublicKey(response.publicKey);return transactions=transactions.map(((tx,idx)=>(tx.addSignature(publicKey,signatures[idx]),tx)))},function isInjectedProvider(a){return function isObject(a){return"object"==typeof a&&null!==a}(a)&&function isFunction(a){return"function"==typeof a}(a.postMessage)}(provider))this._injectedProvider=provider;else{if(!function isString(a){return"string"==typeof a}(provider))throw new Error("provider parameter must be an injected provider or a URL string.");this._providerUrl=new URL(provider),this._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network}).toString()}this._network=network,this._publicKey=null,this._autoApprove=!1,this._popup=null,this._handlerAdded=!1,this._nextRequestId=1,this._responsePromises=new Map}get publicKey(){return this._publicKey}get connected(){return null!==this._publicKey}get autoApprove(){return this._autoApprove}}const index_modern=Wallet;var web_extends=function(){var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)Object.prototype.hasOwnProperty.call(b,p)&&(d[p]=b[p])},extendStatics(d,b)};return function(d,b){if("function"!=typeof b&&null!==b)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}}(),__awaiter=function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))},__generator=function(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}};const web=function(_super){function WebAdapter(iframe,network,provider){var _this=_super.call(this)||this;return _this._instance=null,_this.handleMessage=function(data){},_this._handleConnect=function(){_this.emit("connect")},_this._handleDisconnect=function(){window.clearInterval(_this._pollTimer),_this.emit("disconnect")},_this._network=network,_this._provider=provider,_this}return web_extends(WebAdapter,_super),Object.defineProperty(WebAdapter.prototype,"publicKey",{get:function(){return this._instance.publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(WebAdapter.prototype,"connected",{get:function(){return this._instance.connected||!1},enumerable:!1,configurable:!0}),WebAdapter.prototype.connect=function(){return __awaiter(this,void 0,void 0,(function(){var _this=this;return __generator(this,(function(_a){switch(_a.label){case 0:return this._instance=new index_modern(this._provider,this._network),this._instance.on("connect",this._handleConnect),this._instance.on("disconnect",this._handleDisconnect),this._pollTimer=window.setInterval((function(){var _a,_b;!1!==(null===(_b=null===(_a=_this._instance)||void 0===_a?void 0:_a._popup)||void 0===_b?void 0:_b.closed)&&_this._handleDisconnect()}),200),[4,this._instance.connect()];case 1:return _a.sent(),[2]}}))}))},WebAdapter.prototype.disconnect=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return this._instance.removeAllListeners("connect"),this._instance.removeAllListeners("disconnect"),[4,this._instance.disconnect()];case 1:return _a.sent(),[2]}}))}))},WebAdapter.prototype.signTransaction=function(transaction){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signTransaction(transaction)];case 1:return[2,_a.sent()]}}))}))},WebAdapter.prototype.signAllTransactions=function(transactions){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signAllTransactions(transactions)];case 1:return[2,_a.sent()]}}))}))},WebAdapter.prototype.signMessage=function(data,display){return void 0===display&&(display="hex"),__awaiter(this,void 0,void 0,(function(){var signature;return __generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.sign(data,display)];case 1:return signature=_a.sent().signature,[2,Uint8Array.from(signature)]}}))}))},WebAdapter}(base);var v4=__webpack_require__("./node_modules/uuid/dist/esm-browser/v4.js"),iframe_extends=function(){var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)Object.prototype.hasOwnProperty.call(b,p)&&(d[p]=b[p])},extendStatics(d,b)};return function(d,b){if("function"!=typeof b&&null!==b)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}}(),__assign=function(){return __assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p]);return t},__assign.apply(this,arguments)},iframe_awaiter=function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))},iframe_generator=function(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}},IframeAdapter=function(_super){function IframeAdapter(iframe,publicKey){var _a,_this=this;return(_this=_super.call(this)||this)._publicKey=null,_this._messageHandlers={},_this.handleMessage=function(data){if(_this._messageHandlers[data.id]){var _a=_this._messageHandlers[data.id],resolve=_a.resolve,reject=_a.reject;delete _this._messageHandlers[data.id],data.error?reject(data.error):resolve(data.result)}},_this._sendMessage=function(data){if(!_this.connected)throw new Error("Wallet not connected");return new Promise((function(resolve,reject){var _a,_b,messageId=(0,v4.Z)();_this._messageHandlers[messageId]={resolve,reject},null===(_b=null===(_a=_this._iframe)||void 0===_a?void 0:_a.contentWindow)||void 0===_b||_b.postMessage({channel:"solflareWalletAdapterToIframe",data:__assign({id:messageId},data)},"*")}))},_this._iframe=iframe,_this._publicKey=new index_browser_esm.PublicKey(null===(_a=null==publicKey?void 0:publicKey.toString)||void 0===_a?void 0:_a.call(publicKey)),_this}return iframe_extends(IframeAdapter,_super),Object.defineProperty(IframeAdapter.prototype,"publicKey",{get:function(){return this._publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(IframeAdapter.prototype,"connected",{get:function(){return!0},enumerable:!1,configurable:!0}),IframeAdapter.prototype.connect=function(){return iframe_awaiter(this,void 0,void 0,(function(){return iframe_generator(this,(function(_a){return[2]}))}))},IframeAdapter.prototype.disconnect=function(){return iframe_awaiter(this,void 0,void 0,(function(){return iframe_generator(this,(function(_a){switch(_a.label){case 0:return[4,this._sendMessage({method:"disconnect"})];case 1:return _a.sent(),[2]}}))}))},IframeAdapter.prototype.signTransaction=function(transaction){return iframe_awaiter(this,void 0,void 0,(function(){var _a,publicKey,signature,e_1;return iframe_generator(this,(function(_b){switch(_b.label){case 0:if(!this.connected)throw new Error("Wallet not connected");_b.label=1;case 1:return _b.trys.push([1,3,,4]),[4,this._sendMessage({method:"signTransaction",params:{message:bs58_default().encode(transaction.serializeMessage())}})];case 2:return _a=_b.sent(),publicKey=_a.publicKey,signature=_a.signature,transaction.addSignature(new index_browser_esm.PublicKey(publicKey),bs58_default().decode(signature)),[2,transaction];case 3:throw e_1=_b.sent(),console.log(e_1),new Error("Failed to sign transaction");case 4:return[2]}}))}))},IframeAdapter.prototype.signAllTransactions=function(transactions){return iframe_awaiter(this,void 0,void 0,(function(){var _a,publicKey_1,signatures_1,e_2;return iframe_generator(this,(function(_b){switch(_b.label){case 0:if(!this.connected)throw new Error("Wallet not connected");_b.label=1;case 1:return _b.trys.push([1,3,,4]),[4,this._sendMessage({method:"signAllTransactions",params:{messages:transactions.map((function(transaction){return bs58_default().encode(transaction.serializeMessage())}))}})];case 2:return _a=_b.sent(),publicKey_1=_a.publicKey,signatures_1=_a.signatures,[2,transactions.map((function(tx,id){return tx.addSignature(new index_browser_esm.PublicKey(publicKey_1),bs58_default().decode(signatures_1[id])),tx}))];case 3:throw e_2=_b.sent(),console.log(e_2),new Error("Failed to sign transactions");case 4:return[2]}}))}))},IframeAdapter.prototype.signMessage=function(data,display){return void 0===display&&(display="hex"),iframe_awaiter(this,void 0,void 0,(function(){var result,e_3;return iframe_generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");_a.label=1;case 1:return _a.trys.push([1,3,,4]),[4,this._sendMessage({method:"signMessage",params:{data,display}})];case 2:return result=_a.sent(),[2,Uint8Array.from(bs58_default().decode(result))];case 3:throw e_3=_a.sent(),console.log(e_3),new Error("Failed to sign message");case 4:return[2]}}))}))},IframeAdapter}(base);const iframe=IframeAdapter;var esm_extends=function(){var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)Object.prototype.hasOwnProperty.call(b,p)&&(d[p]=b[p])},extendStatics(d,b)};return function(d,b){if("function"!=typeof b&&null!==b)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}}(),esm_awaiter=function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))},esm_generator=function(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}},__values=function(o){var s="function"==typeof Symbol&&Symbol.iterator,m=s&&o[s],i=0;if(m)return m.call(o);if(o&&"number"==typeof o.length)return{next:function(){return o&&i>=o.length&&(o=void 0),{value:o&&o[i++],done:!o}}};throw new TypeError(s?"Object is not iterable.":"Symbol.iterator is not defined.")};const esm=function(_super){function Solflare(config){var _this=_super.call(this)||this;return _this._network="mainnet-beta",_this._provider=null,_this._adapterInstance=null,_this._element=null,_this._iframe=null,_this._connectHandler=null,_this._flutterHandlerInterval=null,_this._handleEvent=function(event){var _a,_b,_c;switch(event.type){case"connect_native_web":return _this._collapseIframe(),_this._adapterInstance=new web(_this._iframe,_this._network,(null===(_a=event.data)||void 0===_a?void 0:_a.provider)||_this._provider||"https://solflare.com/provider"),_this._adapterInstance.on("connect",_this._webConnected),_this._adapterInstance.on("disconnect",_this._webDisconnected),_this._adapterInstance.connect(),void _this._setPreferredAdapter("native_web");case"connect":return _this._collapseIframe(),_this._adapterInstance=new iframe(_this._iframe,(null===(_b=event.data)||void 0===_b?void 0:_b.publicKey)||""),_this._adapterInstance.connect(),_this._setPreferredAdapter(null===(_c=event.data)||void 0===_c?void 0:_c.adapter),_this._connectHandler&&(_this._connectHandler.resolve(),_this._connectHandler=null),void _this.emit("connect",_this.publicKey);case"disconnect":return _this._connectHandler&&(_this._connectHandler.reject(),_this._connectHandler=null),_this._disconnected(),void _this.emit("disconnect");case"collapse":return void _this._collapseIframe();default:return}},_this._handleMessage=function(event){var _a;if("solflareIframeToWalletAdapter"===(null===(_a=event.data)||void 0===_a?void 0:_a.channel)){var data=event.data.data||{};"event"===data.type?_this._handleEvent(data.event):_this._adapterInstance&&_this._adapterInstance.handleMessage(data)}},_this._removeElement=function(){null!==_this._flutterHandlerInterval&&(clearInterval(_this._flutterHandlerInterval),_this._flutterHandlerInterval=null),_this._element&&(_this._element.remove(),_this._element=null)},_this._removeDanglingElements=function(){var e_1,_a,elements=document.getElementsByClassName("solflare-wallet-adapter-iframe");try{for(var elements_1=__values(elements),elements_1_1=elements_1.next();!elements_1_1.done;elements_1_1=elements_1.next()){var element=elements_1_1.value;element.parentElement&&element.remove()}}catch(e_1_1){e_1={error:e_1_1}}finally{try{elements_1_1&&!elements_1_1.done&&(_a=elements_1.return)&&_a.call(elements_1)}finally{if(e_1)throw e_1.error}}},_this._injectElement=function(){_this._removeElement(),_this._removeDanglingElements();var iframeUrl="".concat(Solflare.IFRAME_URL,"?cluster=").concat(encodeURIComponent(_this._network),"&origin=").concat(encodeURIComponent(window.location.origin)),preferredAdapter=_this._getPreferredAdapter();preferredAdapter&&(iframeUrl+="&adapter=".concat(encodeURIComponent(preferredAdapter))),_this._element=document.createElement("div"),_this._element.className="solflare-wallet-adapter-iframe",_this._element.innerHTML="\n      <iframe src='".concat(iframeUrl,"' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>\n    "),document.body.appendChild(_this._element),_this._iframe=_this._element.querySelector("iframe"),window.fromFlutter=_this._handleMobileMessage,_this._flutterHandlerInterval=setInterval((function(){window.fromFlutter=_this._handleMobileMessage}),100),window.addEventListener("message",_this._handleMessage,!1)},_this._collapseIframe=function(){_this._iframe&&(_this._iframe.style.top="",_this._iframe.style.right="",_this._iframe.style.height="2px",_this._iframe.style.width="2px")},_this._getPreferredAdapter=function(){return localStorage&&localStorage.getItem("solflarePreferredWalletAdapter")||null},_this._setPreferredAdapter=function(adapter){localStorage&&adapter&&localStorage.setItem("solflarePreferredWalletAdapter",adapter)},_this._clearPreferredAdapter=function(){localStorage&&localStorage.removeItem("solflarePreferredWalletAdapter")},_this._webConnected=function(){_this._connectHandler&&(_this._connectHandler.resolve(),_this._connectHandler=null),_this.emit("connect",_this.publicKey)},_this._webDisconnected=function(){_this._connectHandler&&(_this._connectHandler.reject(),_this._connectHandler=null),_this._disconnected(),_this.emit("disconnect")},_this._disconnected=function(){window.removeEventListener("message",_this._handleMessage,!1),_this._removeElement(),_this._clearPreferredAdapter(),_this._adapterInstance=null},_this._handleMobileMessage=function(data){var _a,_b;null===(_b=null===(_a=_this._iframe)||void 0===_a?void 0:_a.contentWindow)||void 0===_b||_b.postMessage({channel:"solflareMobileToIframe",data},"*")},(null==config?void 0:config.network)&&(_this._network=null==config?void 0:config.network),(null==config?void 0:config.provider)&&(_this._provider=null==config?void 0:config.provider),_this}return esm_extends(Solflare,_super),Object.defineProperty(Solflare.prototype,"publicKey",{get:function(){var _a;return(null===(_a=this._adapterInstance)||void 0===_a?void 0:_a.publicKey)||null},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"isConnected",{get:function(){var _a;return!!(null===(_a=this._adapterInstance)||void 0===_a?void 0:_a.connected)},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"connected",{get:function(){return this.isConnected},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"autoApprove",{get:function(){return!1},enumerable:!1,configurable:!0}),Solflare.prototype.connect=function(){return esm_awaiter(this,void 0,void 0,(function(){var _this=this;return esm_generator(this,(function(_a){switch(_a.label){case 0:return this.connected?[2]:(this._injectElement(),[4,new Promise((function(resolve,reject){_this._connectHandler={resolve,reject}}))]);case 1:return _a.sent(),[2]}}))}))},Solflare.prototype.disconnect=function(){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){switch(_a.label){case 0:return this._adapterInstance?[4,this._adapterInstance.disconnect()]:[2];case 1:return _a.sent(),this._disconnected(),this.emit("disconnect"),[2]}}))}))},Solflare.prototype.signTransaction=function(transaction){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signTransaction(transaction)];case 1:return[2,_a.sent()]}}))}))},Solflare.prototype.signAllTransactions=function(transactions){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signAllTransactions(transactions)];case 1:return[2,_a.sent()]}}))}))},Solflare.prototype.signMessage=function(data,display){return void 0===display&&(display="utf8"),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){switch(_a.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signMessage(data,display)];case 1:return[2,_a.sent()]}}))}))},Solflare.prototype.sign=function(data,display){return void 0===display&&(display="utf8"),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){switch(_a.label){case 0:return[4,this.signMessage(data,display)];case 1:return[2,_a.sent()]}}))}))},Solflare.prototype.detectWallet=function(timeout){return void 0===timeout&&(timeout=10),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(_a){return[2,new Promise((function(resolve){var element=null;function handleDetected(detected){!function cleanUp(){window.removeEventListener("message",handleMessage,!1),element&&(document.body.removeChild(element),element=null);timeoutHandler&&(clearTimeout(timeoutHandler),timeoutHandler=null)}(),resolve(detected)}var timeoutHandler=setTimeout((function(){handleDetected(!1)}),1e3*timeout);function handleMessage(event){var _a,_b,_c;"solflareDetectorToAdapter"===(null===(_a=event.data)||void 0===_a?void 0:_a.channel)&&handleDetected(!!(null===(_c=null===(_b=event.data)||void 0===_b?void 0:_b.data)||void 0===_c?void 0:_c.detected))}window.addEventListener("message",handleMessage,!1),(element=document.createElement("div")).className="solflare-wallet-detect-iframe",element.innerHTML="\n        <iframe src='".concat(Solflare.DETECT_IFRAME_URL,"?timeout=").concat(timeout,"' style='position: fixed; top: -9999px; left: -9999px; width: 0; height: 0; pointer-events: none; border: none;'></iframe>\n      "),document.body.appendChild(element)}))]}))}))},Solflare.IFRAME_URL="https://connect.solflare.com/",Solflare.DETECT_IFRAME_URL="https://connect.solflare.com/detect",Solflare}(eventemitter3_default())}}]);