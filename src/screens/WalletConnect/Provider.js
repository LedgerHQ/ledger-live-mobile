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

const Provider = ({ children }: { children: React$Node }) => {
  const [session, setSession] = useState({});
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

      if (
        wcCallRequest.type === "transaction" &&
        wcCallRequest.method === "send"
      ) {
        setCurrentCallRequestId(payload.id);
        navigate(NavigatorName.SendFunds, {
          screen: ScreenName.SendSummary,
          params: {
            transaction: wcCallRequest.data,
            accountId: account.id,
          },
        });
      } else if (wcCallRequest.type === "message") {
        setCurrentCallRequestId(payload.id);
        navigate(NavigatorName.SignMessage, {
          screen: ScreenName.SignSummary,
          params: {
            message: wcCallRequest.data,
            accountId: account.id,
          },
        });
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
  }, [initDone]);

  const { account } = useSelector(
    accountScreenSelector({
      params: { accountId: session.accountId },
    }),
  );
  useEffect(() => {
    if (
      account &&
      session.session &&
      status === STATUS.DISCONNECTED &&
      navigationRef.current
    ) {
      connect({ account });

      navigate(NavigatorName.Base, {
        screen: ScreenName.WalletConnectConnect,
        params: {
          accountId: account.id,
        },
      });
    }
  });

  useEffect(() => {
    if (!initDone) {
      return;
    }
    saveWCSession(session);
  }, [session, initDone]);

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
        // eslint-disable-next-line no-underscore-dangle
        socketReady: connector?._transport?._socket?.readyState === 1,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Provider;
