import { RawDappRequestDTO } from './content/external/maps/dto/dapp-request-map';
import { RawDappResponseDTO } from './content/external/maps/dto/dapp-response-map';

export enum ExtensionComponent {
  solana = 'solana',
  ethereum = 'ethereum',
  content = 'content',
  background = 'background',
  popup = 'popup',
}

export type MethodRequest = {
  id: number;
  type: string;
  method: string;
  chain: string;
  payload: any;
};

export type MethodResponse = {
  id: number;
  type: string;
  method: string;
  chain: string;
  payload: any;
};

export type ExtensionMessageRequest = {
  sender: ExtensionComponent;
  destination: ExtensionComponent;
  request: MethodRequest | RawDappRequestDTO;
};

export type ExtensionMessageResponse = {
  sender: ExtensionComponent;
  destination: ExtensionComponent;
  response: MethodResponse | RawDappResponseDTO;
};

export async function sendNativeMessage(message: MethodRequest): Promise<any> {
  try {
    return browser.runtime.sendNativeMessage('application.id', message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    console.error('Caught error in backend messaging', errorMessage);
    return { ...message, error: errorMessage };
  }
}

export function sendContentMessage(request: MethodRequest) {
  let message: ExtensionMessageRequest = {
    sender: ExtensionComponent.popup,
    destination: ExtensionComponent.content,
    request: request,
  };

  (browser.tabs as any).query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs: browser.tabs.Tab[]) => {
      const [tab] = tabs;
      if (tab && tab.id) {
        browser.tabs.sendMessage(tab.id, message);
      }
    },
  );
}
