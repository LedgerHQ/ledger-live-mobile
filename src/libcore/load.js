import { createInstance, getNativeModule } from "./specific";

let core;
let corePromise;

let walletPoolInstance;
let threadDispatcher;

export default async () => {
  if (core) {
    return core;
  }
  if (!corePromise) {
    corePromise = loadCore();
  }
  core = await corePromise;
  return core;
};

async function loadCore() {
  const core = {
    getPoolInstance: () => walletPoolInstance,
    getThreadDispatcher: () => threadDispatcher,
    flush: async () => {
      await core.coreHttpClient.flush();
      await core.coreWebSocketClient.flush();
      await core.corePathResolver.flush();
      await core.coreLogPrinter.flush();
      await core.coreRandomNumberGenerator.flush();
      await core.coreDynamicObject.flush();
      await core.coreDatabaseBackend.flush();
    },
  };

  const modules = [
    "Account",
    "AccountCreationInfo",
    "Address",
    "Amount",
    "BigInt",
    "BitcoinLikeAccount",
    "BitcoinLikeOperation",
    "BitcoinLikeOutput",
    "BitcoinLikeInput",
    "BitcoinLikeNetworkParameters",
    "BitcoinLikeTransaction",
    "BitcoinLikeTransactionBuilder",
    "Block",
    "Currency",
    "DatabaseBackend",
    "DerivationPath",
    "DynamicObject",
    "EventBus",
    "EventReceiver",
    "ExtendedKeyAccountCreationInfo",
    "HttpClient",
    "LogPrinter",
    "Operation",
    "OperationQuery",
    "PathResolver",
    "RandomNumberGenerator",
    "ThreadDispatcher",
    "Wallet",
    "WalletPool",
    "WebSocketClient",
  ];

  modules.forEach(m => {
    core[`core${m}`] = getNativeModule(m);
  });

  const httpClient = await createInstance(core.coreHttpClient);
  const webSocket = await createInstance(core.coreWebSocketClient);
  const pathResolver = await createInstance(core.corePathResolver);
  const logPrinter = await createInstance(core.coreLogPrinter);
  threadDispatcher = await createInstance(core.coreThreadDispatcher);
  const rng = await createInstance(core.coreRandomNumberGenerator);
  const backend = await core.coreDatabaseBackend.getSqlite3Backend();

  const dynamicObject = await core.coreDynamicObject.newInstance();
  walletPoolInstance = await core.coreWalletPool.newInstance(
    "ledger_live_desktop",
    "",
    httpClient,
    webSocket,
    pathResolver,
    logPrinter,
    threadDispatcher,
    rng,
    backend,
    dynamicObject,
  );

  if (__DEV__) {
    console.log({ core }); // eslint-disable-line
  }

  // PoC of a "modern" view of libcore. eventually we should switch over
  const modern = {};
  modules.forEach(m => {
    const native = getNativeModule(m);
    const decorate = instance => {
      const proto = {};
      Object.keys(native).forEach(k => {
        proto[k] = (...arg) => {
          const res = native[k].call(native, instance, ...arg);
          return res;
        };
      });
      return Object.create(proto, instance);
    };
    modern[m] = decorate;
  });
  core.modern = modern;

  return core;
}
