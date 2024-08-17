export const rootstockApiFactory = ({ IDL }) => {
    const Address = IDL.Text;
    const BorrowRequest = IDL.Record({
        'duration': IDL.Nat,
        'requestId': IDL.Nat,
        'tokenId': IDL.Nat,
        'loanAmount': IDL.Nat,
        'collectionId': IDL.Nat,
        'platformFee': IDL.Nat,
        'createdAt': IDL.Nat,
        'isActive': IDL.Bool,
        'borrower': Address,
        'nftContract': Address,
        'repayAmount': IDL.Nat,
    });
    const FoundaryId = IDL.Nat;
    const Lending = IDL.Record({
        'loanStartTime': IDL.Nat,
        'tokenId': IDL.Nat,
        'dueDate': IDL.Nat,
        'isActive': IDL.Bool,
        'borrower': Address,
        'lender': Address,
        'nftContract': Address,
        'repaymentTime': IDL.Nat,
    });
    const TokenId = IDL.Nat;
    const AddressPair = IDL.Record({
        'bitcoinAddress': IDL.Text,
        'ethereumAddress': IDL.Text,
    });
    return IDL.Service({
        'acceptCycles': IDL.Func([], [], []),
        'addBorrowRequest': IDL.Func([BorrowRequest, FoundaryId], [IDL.Nat], []),
        'addLending': IDL.Func([Lending, FoundaryId], [IDL.Nat], []),
        'addTokenToAddress': IDL.Func(
            [Address, IDL.Vec(TokenId), FoundaryId],
            [IDL.Bool],
            [],
        ),
        'addUserSupply': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
        'availableCycles': IDL.Func([], [IDL.Nat], ['query']),
        'balanceOf': IDL.Func([Address], [IDL.Opt(IDL.Vec(TokenId))], ['query']),
        'getBorrowRequest': IDL.Func(
            [IDL.Nat],
            [IDL.Opt(BorrowRequest)],
            ['query'],
        ),
        'getBorrowRequestsByBorrower': IDL.Func(
            [Address],
            [IDL.Opt(IDL.Vec(BorrowRequest))],
            ['query'],
        ),
        'getBorrowRequestsByCollectionId': IDL.Func(
            [IDL.Nat],
            [IDL.Opt(IDL.Vec(BorrowRequest))],
            ['query'],
        ),
        'getLending': IDL.Func(
            [IDL.Nat, FoundaryId],
            [IDL.Opt(Lending)],
            ['query'],
        ),
        'getUserSupply': IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
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
        'wallet_receive': IDL.Func(
            [],
            [IDL.Record({ 'accepted': IDL.Nat64 })],
            [],
        ),
    });
};