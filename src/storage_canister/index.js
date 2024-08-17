export const storageIdlFactory = ({ IDL }) => {
    const WithdrawRequest = IDL.Record({
        'transaction_id': IDL.Text,
        'fee_rate': IDL.Nat,
        'timestamp': IDL.Nat64,
        'bitcoinAddress': IDL.Text,
        'priority': IDL.Text,
        'asset_id': IDL.Text,
        'calculated_fee': IDL.Nat,
    });
    const EthereumAddress = IDL.Text;
    const TransactionDetail = IDL.Record({
        'transaction': IDL.Text,
        'fee_rate': IDL.Nat,
        'timestamp': IDL.Nat64,
        'bitcoinAddress': IDL.Text,
        'asset_id': IDL.Text,
    });
    const BitcoinChainKey = IDL.Record({
        'bitcoinAddress': IDL.Text,
        'chainId': IDL.Nat,
    });
    const EthereumChainKey = IDL.Record({
        'ethereumAddress': IDL.Text,
        'chainId': IDL.Nat,
    });
    const AddressPair = IDL.Record({
        'chain_id': IDL.Nat,
        'bitcoinAddress': IDL.Text,
        'ethereumAddress': IDL.Text,
    });
    return IDL.Service({
        'acceptCycles': IDL.Func([], [], []),
        'addTransaction': IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
        'addUserSupply': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
        'addWithDrawAssetsRequest': IDL.Func([WithdrawRequest], [IDL.Bool], []),
        'allowInscriptions': IDL.Func([EthereumAddress, IDL.Text], [IDL.Bool], []),
        'availableCycles': IDL.Func([], [IDL.Nat], ['query']),
        'deleteAllowInscriptions': IDL.Func(
            [EthereumAddress, IDL.Text],
            [IDL.Bool],
            [],
        ),
        'deleteTransactionByKey': IDL.Func([IDL.Text], [IDL.Bool], []),
        'getAllTransactionHistory': IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(TransactionDetail)))],
            [],
        ),
        'getAllowInscriptions': IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(EthereumAddress, IDL.Vec(IDL.Text)))],
            ['query'],
        ),
        'getByBitcoinAddress': IDL.Func(
            [BitcoinChainKey],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'getByEthereumAddress': IDL.Func(
            [EthereumChainKey],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'getById': IDL.Func([IDL.Nat], [IDL.Opt(AddressPair)], ['query']),
        'getTransactionByKey': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'getTransactionHistory': IDL.Func(
            [IDL.Text],
            [IDL.Vec(TransactionDetail)],
            [],
        ),
        'getUserSupply': IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
        'getWithDrawAssetsRequest': IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Nat, WithdrawRequest))],
            ['query'],
        ),
        'getWithDrawStatus': IDL.Func([IDL.Text], [IDL.Bool], []),
        'isBitcoinAddressExists': IDL.Func(
            [BitcoinChainKey],
            [IDL.Bool],
            ['query'],
        ),
        'isEthereumAddressExists': IDL.Func(
            [EthereumChainKey],
            [IDL.Bool],
            ['query'],
        ),
        'removeAllowInscriptions': IDL.Func([EthereumAddress], [IDL.Bool], []),
        'removeWithDrawAssetsRequest': IDL.Func(
            [TransactionDetail],
            [IDL.Bool],
            [],
        ),
        'resetSupply': IDL.Func([IDL.Nat], [IDL.Bool], []),
        'retrieve': IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
        'retrieveByBitcoinAddress': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'retrieveByEthereumAddress': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'retrieveById': IDL.Func([IDL.Nat], [IDL.Opt(AddressPair)], ['query']),
        'storeAddress': IDL.Func([AddressPair], [IDL.Nat], []),
        'verifyAddressPair': IDL.Func([AddressPair], [IDL.Nat], []),
        'wallet_receive': IDL.Func(
            [],
            [IDL.Record({ 'accepted': IDL.Nat64 })],
            [],
        ),
    });
};
