/* @flow */
import React, { useState, useEffect, useRef } from "react";
import { unstable_batchedUpdates as batchUpdates } from "react-native";
import WalletConnect from "@walletconnect/client";
import { useSelector } from "react-redux";
import { parseCallRequest } from "@ledgerhq/live-common/lib/walletconnect";
import { saveWCSession, getWCSession } from "../../db";
import { accountScreenSelector } from "../../reducers/accounts";
import { NavigatorName, ScreenName } from "../../const";
import { navigate, navigationRef } from "../../rootnavigation";

export const context = React.createContext<{
  connect: Function,
  disconnect: Function,
  status: number,
  error?: any,
  currentCallRequestId?: string,
  setCurrentCallRequestResult?: Function,
  setCurrentCallRequestError?: Function,
  dappInfo?: any,
  approveSession?: Function,
  initDone: boolean,
  hasSession: boolean,
  socketReady: boolean,
}>({});

export const STATUS = {
  DISCONNECTED: 0x00,
  CONNECTING: 0x01,
  ERROR: 0x02,
  CONNECTED: 0x03,
};

const ProviderCommon = ({
  children,
  useAccount,
  onMessage,
  onSessionRestarted,
  onRemoteDisconnected,
  isReady,
  saveWCSession,
  getWCSession,
  batchUpdates,
}: {
  children: React$Node,
  useAccount: Function,
  onMessage: Function,
  onSessionRestarted: Function,
  onRemoteDisconnected: Function,
  isReady: boolean,
  saveWCSession: Function,
  getWCSession: Function,
  batchUpdates: Function,
}) => {
  const [session, setSession] = useState({});
  const [socketReady, setSocketReady] = useState(false);
  const [connector, setConnector] = useState();
  const [status, setStatus] = useState(STATUS.DISCONNECTED);
  const [error, setError] = useState();
  const [initDone, setInitDone] = useState(false);
  const [currentCallRequestId, setCurrentCallRequestId] = useState();
  const [currentCallRequestError, setCurrentCallRequestError] = useState();
  const [currentCallRequestResult, setCurrentCallRequestResult] = useState();
  const [dappInfo, setDappInfo] = useState();
  const [approveSession, setApproveSession] = useState();
  const disconnectRef = useRef();

  const connect = ({ uri, account }: { uri?: String, account: Account }) => {
    setStatus(STATUS.CONNECTING);
    setError();

    let connector;

    try {
      connector = new WalletConnect(
        session.session
          ? {
              session: session.session,
            }
          : {
              // Required
              uri,
              // Required
              clientMeta: {
                description: "LedgerLive",
                url: "https://ledger.fr",
                icons: [
                  "https://play-lh.googleusercontent.com/RVKjd96rcTjiAnr45Gy6Nj2kCJ4_opdU2mrop7KftfyRhPWJf5ukvUR_Gi9AtOA920I",
                ],
                name: "LedgerLive",
              },
            },
      );
    } catch (e) {
      setError(e);
      setStatus(STATUS.ERROR);
      return;
    }
    const connectorOn = connector.on.bind(connector);
    connector.on = (event, handler) => {
      connectorOn(event, (...args) => batchUpdates(() => handler(...args)));
    };

    connector.on("session_request", (error, payload) => {
      if (error) {
        setError(error);
        setStatus(STATUS.ERROR);
        return;
      }

      setDappInfo(payload.params[0].peerMeta);
      setApproveSession({
        fn: () => {
          connector.approveSession({
            accounts: [account.freshAddress],
            chainId: account.currency.ethereumLikeInfo.chainId,
          });
          setApproveSession();
        },
      });
    });

    connector.on("connect", () => {
      if (error) {
        setError(error);
        setStatus(STATUS.ERROR);
        return;
      }

      setStatus(STATUS.CONNECTED);
      setSession({
        session: connector.session,
        accountId: account.id,
      });
    });

    connector.on("disconnect", () => {
      if (!disconnectRef.current) {
        return;
      }
      disconnectRef.current();
    });

    connector.on("error", () => {
      setError(error);
      setStatus(STATUS.ERROR);
    });

    connector.on("call_request", async (error, payload) => {
      if (error) {
        // ?
        setError(error);
        setStatus(STATUS.ERROR);
        return;
      }

      if (currentCallRequestId) {
        connector.rejectRequest({
          id: payload.id,
          error: {
            message: "An other request is ongoing",
          },
        });
        return;
      }

      let wcCallRequest;

      try {
        wcCallRequest = await parseCallRequest(account, payload);
      } catch (e) {
        connector.rejectRequest({
          id: payload.id,
          error: {
            message: e.message || e,
          },
        });
      }

      const handler = onMessage(wcCallRequest, account);
      if (handler) {
        setCurrentCallRequestId(payload.id);
        handler();
      } else {
        connector.rejectRequest({
          id: payload.id,
          error: {
            message: "Request not supported",
          },
        });
      }
    });

    setConnector(connector);
    if (connector.connected) {
      setDappInfo(session.session.peerMeta);
      setStatus(STATUS.CONNECTED);
    }
  };

  const disconnect = () => {
    if (connector) {
      connector.killSession();
    }

    if (status !== STATUS.DISCONNECTED) {
      setSession({});
      setDappInfo();
      setApproveSession();
      setError();
      setConnector();
      setStatus(STATUS.DISCONNECTED);

      onRemoteDisconnected();
    }
  };
  disconnectRef.current = disconnect;

  useEffect(() => {
    if (!(currentCallRequestResult || currentCallRequestError) || !connector) {
      return;
    }
    if (currentCallRequestResult) {
      connector.approveRequest({
        id: currentCallRequestId,
        result: currentCallRequestResult,
      });
    }
    if (currentCallRequestError) {
      connector.rejectRequest({
        id: currentCallRequestId,
        error: { message: currentCallRequestError.message },
      });
    }
    setCurrentCallRequestId();
    setCurrentCallRequestResult();
    setCurrentCallRequestError();
  }, [
    currentCallRequestId,
    currentCallRequestError,
    currentCallRequestResult,
    connector,
  ]);

  useEffect(() => {
    if (initDone) {
      return;
    }

    const init = async () => {
      setSession((await getWCSession()) || {});
      setInitDone(true);
    };

    init();
  }, [initDone, getWCSession]);

  const account = useAccount(session.accountId);
  useEffect(() => {
    if (
      account &&
      session.session &&
      status === STATUS.DISCONNECTED &&
      isReady
    ) {
      connect({ account });

      onSessionRestarted(account);
    }
  });

  useEffect(() => {
    if (!initDone) {
      return;
    }
    saveWCSession(session);
  }, [session, initDone, saveWCSession]);

  useEffect(() => {
    if (!session.session) {
      setSocketReady(false);
      return;
    }

    const interval = setInterval(() => {
      // eslint-disable-next-line no-underscore-dangle
      setSocketReady(connector?._transport?._socket?.readyState === 1);
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
  }, [session, connector]);

  return (
    <context.Provider
      value={{
        connect,
        disconnect,
        status,
        error,
        currentCallRequestId,
        setCurrentCallRequestResult,
        setCurrentCallRequestError,
        dappInfo,
        approveSession: approveSession && approveSession.fn,
        initDone,
        hasSession: Object.keys(session).length > 0,
        socketReady,
      }}
    >
      {children}
    </context.Provider>
  );
};

const useAccount = accountId => {
  const { account } = useSelector(
    accountScreenSelector({
      params: { accountId },
    }),
  );
  return account;
};

const Provider = ({ children }: { children: React$Node }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (isReady) {
      return;
    }

    const interval = setInterval(() => {
      setIsReady(!!navigationRef.current);
    }, 500);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  });

  return (
    <ProviderCommon
      onMessage={(wcCallRequest, account) => {
        if (
          wcCallRequest.type === "transaction" &&
          wcCallRequest.method === "send"
        ) {
          return () =>
            navigate(NavigatorName.SendFunds, {
              screen: ScreenName.SendSummary,
              params: {
                transaction: wcCallRequest.data,
                accountId: account.id,
              },
            });
        }

        if (wcCallRequest.type === "message") {
          return () =>
            navigate(NavigatorName.SignMessage, {
              screen: ScreenName.SignSummary,
              params: {
                message: wcCallRequest.data,
                accountId: account.id,
              },
            });
        }

        return false;
      }}
      onSessionRestarted={account => {
        navigate(NavigatorName.Base, {
          screen: ScreenName.WalletConnectConnect,
          params: {
            accountId: account.id,
          },
        });
      }}
      onRemoteDisconnected={() => {
        navigate(NavigatorName.Base, {
          screen: NavigatorName.Main,
        });
      }}
      useAccount={useAccount}
      isReady={isReady}
      saveWCSession={saveWCSession}
      getWCSession={getWCSession}
      batchUpdates={batchUpdates}
    >
      {children}
    </ProviderCommon>
  );
};

export default Provider;
