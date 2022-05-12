import React from 'react';
import { Chain } from '../../../domain/chain';
import { useApiCall } from '../../../hooks/use-api-call';
import { getWeb3SafetyStore } from '../../stores/web3safety';
import { useRequest } from '../hooks/request-context';
import { Web3CheckAlert } from './Web3CheckAlert';

export function NewContractDomainNamePanel(): JSX.Element | null {
  const { request } = useRequest();
  const chain = request?.getChain() as Chain;
  const store = getWeb3SafetyStore(chain);
  const { hostname } = window.location;

  const { data: whitelisted } = useApiCall(store.isDomainWhitelisted, {
    args: [hostname, chain],
  });

  if (whitelisted) {
    return null;
  }

  return (
    <Web3CheckAlert
      type="danger"
      color="#F04F52"
      bgcolor="#30101B"
      title="Contract Not Recognised"
      text="This contract isn’t associated with this domain. Make sure you trust the app before proceeding."
    />
  );
}
