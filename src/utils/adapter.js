import { NightlyConnectAptosAdapter } from '@nightlylabs/wallet-selector-aptos'

let _adapter;
export const getAdapter = async (persistent = true) => {
  if (_adapter) return _adapter
  _adapter = await NightlyConnectAptosAdapter.build({
    appMetadata: {
      name: 'NCTestAptos',
      description: 'Nightly Connect Test',
      icon: 'https://docs.nightly.app/img/logo.png',
    }, persistent
  }, { initOnConnect: true, disableModal: false, disableEagerConnect: true })
  return _adapter;
}
