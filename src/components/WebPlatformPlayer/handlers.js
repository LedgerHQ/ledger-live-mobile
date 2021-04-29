//import { openModal } from "~/renderer/actions/modals";

import { accountsSelector, accountSelector } from "../../reducers/accounts";

async function testFail(state, dispatch, params) {
  throw new Error("THIS IS A FAILURE");
}

async function accountList(state, dispatch, params) {
  console.log("XXX - handlers - accountList");
  return accountsSelector(state);
}

async function accountGet(state, dispatch, params) {
  console.log("XXX - handlers - accountGet");
  const { accountId } = params;

  return accountSelector(state, { accountId });
}

async function accountReceive(state, dispatch, params) {
  console.log("XXX - handlers - accountReceive");
  const { accountId } = params;

  const account = accountSelector(state, { accountId });

  return new Promise((resolve, reject) => {
    // TODO
    /*
    dispatch(
      openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
        account,
        parentAccount: null,
        onResult: resolve,
        onCancel: () => resolve(null),
        verifyAddress: true,
      }),
    ),
    */
  });
}

const handlers = {
  "account.get": accountGet,
  "account.list": accountList,
  "account.receive": accountReceive,
  fail: testFail,
};

export default handlers;
