import { ExtensionComponent } from '../../messaging';
import { getLogger } from '../../logging';
import { DappRequest } from '../use-case/dto/dapp-request';
import { DappResponse } from '../use-case/dto/dapp-response';
import * as DappRequestMap from './maps/dto/dapp-request-map';
import * as DappResponseMap from './maps/dto/dapp-response-map';

const log = getLogger('controller');

interface DappRequestMessage {
  sender: ExtensionComponent;
  destination: ExtensionComponent;
  request: DappRequestMap.RawDappRequestDTO;
}

interface DappResponseMessage {
  sender: ExtensionComponent;
  destination: ExtensionComponent;
  response: DappResponseMap.RawDappResponseDTO;
}

export type ResponseHandler = (response: DappResponse) => void;
export type RequestHandler = (request: DappRequest, handleResponse: ResponseHandler) => void;

/**
 * Listens for messages from the DAPP WALLET CONNECTION and executes use cases based on the request.
 */
export class Controller {
  private handlers: RequestHandler[] = [];

  constructor() {
    log(`loaded`);
    this.listen();
  }

  private listen(): void {
    window.addEventListener('message', async (event: MessageEvent<DappRequestMessage>) => {
      const dappMessage = event.data;
      if (dappMessage.destination !== ExtensionComponent.content) {
        return;
      }

      log(`Received dapp message: ${JSON.stringify(dappMessage)}}`);

      const request = DappRequestMap.mapDappDTOToDomain(dappMessage.request);

      this.handlers.forEach((handler) => {
        const responseHandler: ResponseHandler = (response) => {
          console.log('[controller] responseHandler', response);
          const responseDTO = DappResponseMap.mapDomainToDappDTO(response);

          log(`Request complete: method: ${request.getMethod()}, id: ${request.getID()}`);

          const extensionMessage: DappResponseMessage = {
            sender: ExtensionComponent.content,
            destination: dappMessage.sender,
            response: responseDTO,
          };
          window.postMessage(extensionMessage);
        };
        handler(request, responseHandler);
      });
    });
  }

  public subscribe(requestCallback: RequestHandler): void {
    this.handlers.push(requestCallback);
  }

  public unsubscribe(requestCallback: RequestHandler): void {
    this.handlers = this.handlers.filter((handler) => handler !== requestCallback);
  }
}
