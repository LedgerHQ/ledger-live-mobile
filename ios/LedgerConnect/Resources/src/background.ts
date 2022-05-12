/* eslint-disable max-len */
import { EthereumMethod, SolanaMethod } from './content/use-case/dto/dapp-request';
import { sendNativeMessage, ExtensionComponent, ExtensionMessageRequest } from './messaging';
import { getLogger } from './logging';

const log = getLogger('background');

browser.runtime.onMessage.addListener(async (request, sender): Promise<any> => {
  log('Receive message', request, request.getValue, sender);

  const message = request as ExtensionMessageRequest;

  if (!message || message.destination !== ExtensionComponent.background) {
    return undefined;
  }

  const { method, id } = message.request;

  switch (method) {
    case EthereumMethod.ConnectDapp: {
      log('receive ETH request accounts', message.request);

      const result = await sendNativeMessage(message.request);
      log('request accounts result', result);

      // await new Promise((resolve) => {
      //   setTimeout(resolve, 3000);
      // });

      // const result = { id, value: ['0x51a4f8419aC902006211786a5648F0cc14aa7074'] };

      return result;
    }
    case EthereumMethod.SignAndSendTransaction: {
      log('receive ETH send transaction', message.request);

      const result = await sendNativeMessage(message.request);
      log('send transaction result', result);

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
    case EthereumMethod.SignPersonalMessage: {
      log('receive ETH sign personal message', message.request);

      const result = await sendNativeMessage(message.request);
      log('send transaction result', result);

      // await new Promise((resolve) => {
      //   setTimeout(resolve, 4000);
      // });

      // const result = {
      //   id,
      //   value: '0x0c52dc17fbc8eafe95c9225484c2360c793296b43bbf7de5…eca87419c9dbf5be5bdbfdad4a4f3cb6d8eeb8a7116bd4901',
      // };

      return result;
    }
    case SolanaMethod.ConnectDapp: {
      log('receive SOL request accounts', message.request);

      const result = await sendNativeMessage(message.request);
      log('request accounts result', result);

      // await new Promise((resolve) => {
      //   setTimeout(resolve, 3000);
      // });

      // const result = { id, value: ['GxhLFJ7XoCoxLdcLBzvycknww3yqzBfDe5ra61EdUEAR'] };

      return result;
    }
    case SolanaMethod.SignAndSendTransaction:
    case SolanaMethod.SignTransaction:
    case SolanaMethod.SignAllTransactions: {
      log('receive SOL sign and send transaction', message.request);

      const result = await sendNativeMessage(message.request);
      log('solana sign transaction result', result);

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
      log(`unexpected request method ${method}`);
  }
  return undefined;
});

log(`loaded`);
