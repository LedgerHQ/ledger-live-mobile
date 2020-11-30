/* @flow */
import React, { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import { useSelector } from "react-redux";
import { parseCallRequest } from "@ledgerhq/live-common/lib/walletconnect";
import { saveWCSession, getWCSession } from "../../db";
import { accountScreenSelector } from "../../reducers/accounts";
import { NavigatorName, ScreenName } from "../../const";
import { navigate, navigationRef } from "../../rootnavigation";

export const context = React.createContext();

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
  isReady,
  saveWCSession,
  getWCSession,
}: {
  children: React$Node,
  useAccount: Function,
  onMessage: Function,
  onSessionRestarted: Function,
  isReady: Function,
  saveWCSession: Function,
  getWCSession: Function,
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

  const connect = ({ uri, account }) => {
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
      disconnect();
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

    setDappInfo();
    setApproveSession();
    setSession({});
    setError();
    setStatus(STATUS.DISCONNECTED);
    setConnector();
  };

  useEffect(() => {
    if (!(currentCallRequestResult || currentCallRequestError)) {
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
      isReady()
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
      useAccount={useAccount}
      isReady={() => !!navigationRef.current}
      saveWCSession={saveWCSession}
      getWCSession={getWCSession}
    >
      {children}
    </ProviderCommon>
  );
};

export default Provider;
