import { ValueObject } from '../../../../library/ddd-core-objects';
import { TokenValue } from '../../currency/token-value';

interface EthereumTransactionRequestProps {
  data: string;
  from: string;
  gas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  to: string;
  nonce: string;
  gasLimit: string;
  value: TokenValue;
}

export class EthereumTransactionRequest extends ValueObject<EthereumTransactionRequestProps> {
  public getData(): string {
    return this.props.data;
  }

  public getFrom(): string {
    return this.props.from;
  }

  public getGas(): string {
    return this.props.gas;
  }

  public getMaxFeePerGas(): string {
    return this.props.maxFeePerGas;
  }

  public getMaxPriorityFeePerGas(): string {
    return this.props.maxPriorityFeePerGas;
  }

  public getTo(): string {
    return this.props.to;
  }

  public getNonce(): string {
    return this.props.nonce;
  }

  public getGasLimit(): string {
    return this.props.gasLimit;
  }

  public getValue(): TokenValue {
    return this.props.value;
  }

  public static create(props: EthereumTransactionRequestProps): EthereumTransactionRequest {
    return new EthereumTransactionRequest(props);
  }
}

// Comes from payload from request

// id: 1647967158709
// method: "eth_sendTransaction"
// params: Array (1)
// eslint-disable-next-line
//   data: "0xb2f1e6db000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000920947f0cd51a00…"
//   from: "0x51a4f8419ac902006211786a5648f0cc14aa7074"
//   gas: "0x2a298"
//   maxFeePerGas: "0x13ecf72b00"
//   maxPriorityFeePerGas: "0x5b31f280"
//   to: "0xdef171fe48cf0115b1d80b88dc8eab59176fee57"
//   value: "0x920947f0cd51a"

// *********************
// Added by getLatestTxCount (alchemy)

// params:
//   nonce: "0x0"

// *********************
// Added by setGasValues() (gas fee - block native / gas limit - alchemy)

// params: Array (1)
//   gasLimit: "0xcf08"
//   maxFeePerGas: "0x1631515dc"
//   maxPriorityFeePerGas: "0x4f31c781"
