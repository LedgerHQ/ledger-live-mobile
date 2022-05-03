import TransportBLE from "@ledgerhq/react-native-hw-transport-ble";
import Transport from "@ledgerhq/hw-transport";
import AppEth from "@ledgerhq/hw-app-eth";
import Solana from "@ledgerhq/hw-app-solana";
import getAppAndVersion from "./getAppAndVersion";
import openApp from "./openApp";
import { FeeMarketEIP1559Transaction } from "@ethereumjs/tx";
import Common, { Chain } from "@ethereumjs/common";
import { binary_to_base58 } from "base58-js";
import * as Sentry from "@sentry/react-native";

const OPEN_TIMEOUT = 15000;
const LISTEN_TIMEOUT = 15000
const DERIVATION_PATH_ETH = "44'/60'/0'/0/0";
const DERIVATION_PATH_SOL = "44'/501'/0'";

const common = new Common({ chain: Chain.Mainnet, hardfork: "london" });
const ensureLeading0x = (input: string) =>
    input.startsWith("0x") ? input : `0x${input}`;
const trimLeading0x = (input: string) =>
    input.startsWith("0x") ? input.slice(2) : input;

async function openAppIfNeeded(
    appName: string,
    transport: TransportBLE
): Promise<Transport | null> {
    return getAppAndVersion(transport).then((currentApp) => {
        if (currentApp.name != appName) {
            console.log(
                `switching current app ${currentApp.name} to ${appName}`
            );
            
            Sentry.addBreadcrumb({
                message: `switching current app ${currentApp.name} to ${appName}`,
                level: Sentry.Severity.Info,
            });

            return openApp(transport, appName)
                .then(async () => {
                    // Every time a user enters or exits an application,
                    // the connection gets temporarily closed and needs to be reopened.

                    Sentry.addBreadcrumb({
                        message: `opened app ${appName}`,
                        level: Sentry.Severity.Info,
                    });

                    // Need a slight delay here otherwise the device won't be found
                    await new Promise((f) => setTimeout(f, 1500));
                    return TransportBLE.create(OPEN_TIMEOUT, LISTEN_TIMEOUT);
                })
                .then((transport) => {
                    Sentry.addBreadcrumb({
                        message: 'Opened new transport',
                        level: Sentry.Severity.Info,
                    });
                    return Promise.resolve(transport);
                });
        } else {
            // TODO: Can probably return the passed in transport here
            return Promise.resolve(null);
        }
    });
}

export function getDeviceAndAddress(appName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let currentTransport: TransportBLE;

        Sentry.addBreadcrumb({
            message: "Opening transport for getDeviceAndAddress",
            level: Sentry.Severity.Info,
        });

        TransportBLE.create(OPEN_TIMEOUT, LISTEN_TIMEOUT)
            .then((transport) => {
                currentTransport = transport as TransportBLE;
                return openAppIfNeeded(appName, currentTransport);
            })
            .then(async (transport: Transport | null) => {
                if (transport != null) {
                    currentTransport = transport as TransportBLE;
                }

                const device = currentTransport.device;
                let address: string;

                switch (appName) {
                    case "Ethereum":
                        const eth = new AppEth(currentTransport);
                        const ethAddress = await eth.getAddress(
                            DERIVATION_PATH_ETH
                        );
                        address = ethAddress.address;
                        break;
                    case "Solana":
                        const sol = new Solana(currentTransport);
                        const solAddress = await sol.getAddress(
                            DERIVATION_PATH_SOL
                        );
                        address = binary_to_base58(
                            solAddress.address
                        ).toString();
                        break;
                    default:
                        throw Error("Unsupported application");
                }

                const deviceAndAddress = {
                    deviceName: device.localName,
                    address: [address],
                };
                const jsonData = JSON.stringify(deviceAndAddress);
                currentTransport.close();
                resolve(jsonData);
            })
            .catch((error) => {
                currentTransport?.close();
                reject(error);
            });
    });
}

export function signPersonalMessage(
    messageDataArray: string[]
): Promise<string> {
    return new Promise((resolve, reject) => {
        let currentTransport: TransportBLE;

        TransportBLE.create(30000, 30000)
            .then((transport) => {
                currentTransport = transport as TransportBLE;
                return openAppIfNeeded("Ethereum", currentTransport);
            })
            .then((transport) => {
                if (transport != null) {
                    currentTransport = transport as TransportBLE;
                }

                const eth = new AppEth(currentTransport);
                const message = trimLeading0x(messageDataArray[0]);
                return eth.signPersonalMessage(DERIVATION_PATH_ETH, message);
            })
            .then((result) => {
                var v: number | string = result["v"] - 27;
                v = v.toString(16);
                if (v.length < 2) {
                    v = "0" + v;
                }

                const signatureHash = "0x" + result["r"] + result["s"] + v;
                console.log(signatureHash);

                currentTransport.close();
                resolve(signatureHash);
            })
            .catch((error) => {
                currentTransport?.close();
                reject(error);
            });
    });
}

export function signTransaction(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let currentTransport: TransportBLE;

        TransportBLE.create(30000, 30000)
            .then((transport) => {
                currentTransport = transport as TransportBLE;
                return openAppIfNeeded("Ethereum", currentTransport);
            })
            .then(async (transport) => {
                if (transport != null) {
                    currentTransport = transport as TransportBLE;
                }

                const txData: any = JSON.parse(data);

                const eth = new AppEth(currentTransport);
                const tx = FeeMarketEIP1559Transaction.fromTxData(txData, {
                    common,
                });

                const unsignedTx: Buffer = tx.getMessageToSign(false);
                const signResult = await eth.signTransaction(
                    DERIVATION_PATH_ETH,
                    unsignedTx.toString("hex"),
                    null
                );

                const v = ensureLeading0x(signResult.v);
                const r = ensureLeading0x(signResult.r);
                const s = ensureLeading0x(signResult.s);

                const signedTx = FeeMarketEIP1559Transaction.fromTxData(
                    { ...txData, v, r, s },
                    { common }
                );
                const signedTxString = ensureLeading0x(
                    signedTx.serialize().toString("hex")
                );

                if (__DEV__) {
                    logTxData(signedTx);
                }

                currentTransport.close();
                resolve(signedTxString);
            })
            .catch((error) => {
                currentTransport?.close();
                reject(error);
            });
    });
}

export function solana_signTransaction(
    transactionMessage: string[]
): Promise<string> {
    return new Promise((resolve, reject) => {
        let currentTransport: TransportBLE;

        TransportBLE.create(30000, 30000)
            .then((transport) => {
                currentTransport = transport as TransportBLE;
                return openAppIfNeeded("Solana", currentTransport);
            })
            .then((transport) => {
                if (transport != null) {
                    currentTransport = transport as TransportBLE;
                }

                const txMessage = transactionMessage[0];
                const transactionBuffer = Buffer.from(txMessage, "hex");

                const sol = new Solana(currentTransport, DERIVATION_PATH_SOL);
                return sol.signTransaction(
                    DERIVATION_PATH_SOL,
                    transactionBuffer
                );
            })
            .then((result) => {
                const signature = binary_to_base58(
                    result.signature
                ).toString();

                currentTransport.close();
                resolve(signature);
            })
            .catch((error) => {
                currentTransport?.close();
                reject(error);
            });
    });
}

const logTxData = (signedTx: FeeMarketEIP1559Transaction) => {
    console.log(`validated: ${signedTx.validate()}`);
    console.log(`nonce: ${signedTx.nonce}`);
    console.log(`gasLimit: ${signedTx.gasLimit.toNumber()}`);
    console.log(`baseFee: ${signedTx.getBaseFee().toNumber()}`);
    console.log(`maxFeePerGas: ${signedTx.maxFeePerGas.toNumber()}`);
    console.log(
        `maxPriorityFeePerGas: ${signedTx.maxPriorityFeePerGas.toNumber()}`
    );
    console.log(`getUpfrontCost: ${signedTx.getUpfrontCost()}`);
    console.log(`sender address: ${signedTx.getSenderAddress().toString()}`);
};
