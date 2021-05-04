import { NavigatorName, ScreenName } from "../../const";
import { accountsSelector, accountSelector } from "../../reducers/accounts";

async function testFail() {
  throw new Error("THIS IS A FAILURE");
}

async function accountList(state) {
  return accountsSelector(state);
}

async function accountGet(state, dispatch, params) {
  const { accountId } = params;

  return accountSelector(state, { accountId });
}

async function accountReceive(state, dispatch, params, navigation) {
  const { accountId } = params;

  const account = accountSelector(state, { accountId });

  return new Promise((resolve, reject) => {
    if (!account) reject();

    navigation.navigate(NavigatorName.ReceiveFunds, {
      screen: ScreenName.ReceiveConnectDevice,
      params: {
        account,
        onSuccess: resolve,
        onError: () => {
          // @TODO put in correct error text maybe
          reject();
        },
      },
    });
  });
}

async function transactionSign() {
  return Promise.resolve(true);
}

async function transactionBroadcast() {
  return Promise.resolve(true);
}

const handlers = {
  "account.get": accountGet,
  "account.list": accountList,
  "account.receive": accountReceive,
  "transaction.sign": transactionSign,
  "transaction.broadcast": transactionBroadcast,
  fail: testFail,
};

export default handlers;
