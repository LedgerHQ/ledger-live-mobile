/* @flow */
import React, { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import { useSelector } from "react-redux";
import { saveWCSession, getWCSession } from "../../db";
import { accountScreenSelector } from "../../reducers/accounts";
import { NavigatorName, ScreenName } from "../../const";
import { navigate } from "../../rootnavigation";

export const context = React.createContext();

export const STATUS = {
  DISCONNECTED: 0x00,
  CONNECTING: 0x01,
  ERROR: 0x02,
  CONNECTED: 0x03,
};

const Provider = ({ children }) => {
  const [session, setSession] = useState({});
  const [connector, setConnector] = useState();
  const [status, setStatus] = useState(STATUS.DISCONNECTED);
  const [error, setError] = useState();
  const [initDone, setInitDone] = useState(false);

  const connect = ({ uri, account }) => {
    setStatus(STATUS.CONNECTING);
    setError();
    console.log("connect");

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
                description: "LedgerLive CLI",
                url: "https://ledger.fr",
                icons: [
                  "https://avatars0.githubusercontent.com/u/9784193?s=400&v=4",
                ],
                name: "LedgerLive CLI",
              },
            },
      );
    } catch (e) {
      setError(error);
      setStatus(STATUS.ERROR);
      return;
    }

    connector.on("session_request", () => {
      if (error) {
        setError(error);
        setStatus(STATUS.ERROR);
        return;
      }

      connector.approveSession({
        accounts: [account.freshAddress],
        chainId: account.currency.ethereumLikeInfo.chainId,
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

    setConnector(connector);
    if (connector.connected) {
      setStatus(STATUS.CONNECTED);
    }
  };

  const disconnect = () => {
    if (connector) {
      connector.killSession();
    }

    setSession({});
    setError();
    setStatus(STATUS.DISCONNECTED);
    setConnector();
  };

  useEffect(() => {
    if (initDone) {
      return;
    }

    const init = async () => {
      console.log("init");
      setSession(await getWCSession());
      setInitDone(true);
    };

    init();
  });

  const { account } = useSelector(
    accountScreenSelector({
      params: { accountId: session.accountId },
    }),
  );
  useEffect(() => {
    console.log("session", session);
    if (account && session.session && status === STATUS.DISCONNECTED) {
      console.log("restart session", account, session, status);
      connect({ account });

      console.log("should navigate to wc page");
      navigate(NavigatorName.Base, {
        screen: ScreenName.WalletConnectConnect,
        params: {
          defaultAccount: account,
        },
      });
    }
  });

  useEffect(() => {
    if (!initDone) {
      return;
    }
    console.log("save session", session);
    saveWCSession(session);
  }, [session, initDone]);

  return (
    <context.Provider
      value={{
        connect,
        disconnect,
        status,
        error,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Provider;
