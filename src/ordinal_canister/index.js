export const apiFactory = ({ IDL }) => {
  const Float = IDL.Float64;
  const ApprovedCollection = IDL.Record({
    'websiteLink': IDL.Text,
    'terms': IDL.Nat,
    'thumbnailURI': IDL.Text,
    'contentType': IDL.Text,
    'collectionID': IDL.Nat,
    'twitterLink': IDL.Text,
    'collectionURI': IDL.Text,
    'description': IDL.Text,
    'marketplaceLink': IDL.Text,
    'yield': Float,
    'collectionName': IDL.Text,
  });
  const WithdrawRequest = IDL.Record({
    'transaction_id': IDL.Text,
    'fee_rate': IDL.Nat,
    'timestamp': IDL.Nat64,
    'bitcoinAddress': IDL.Text,
    'priority': IDL.Text,
    'asset_id': IDL.Text,
    'calculated_fee': IDL.Nat,
  });
  const CollectionOffers = IDL.Record({
    'loanToValue': Float,
    'terms': IDL.Nat,
    'loanAmount': Float,
    'collectionID': IDL.Nat,
    'platformFee': Float,
    'ckTransactionID': IDL.Text,
    'loanTime': IDL.Int,
    'yieldRate': Float,
    'yieldAccured': Float,
    'lender': IDL.Principal,
    'floorValue': Float,
    'offerID': IDL.Nat,
  });
  const Account = IDL.Record({
    'owner': IDL.Principal,
    'subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Burn = IDL.Record({
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
    'spender': IDL.Opt(Account),
  });
  const Mint = IDL.Record({
    'to': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
  });
  const Approve = IDL.Record({
    'fee': IDL.Opt(IDL.Nat),
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
    'expected_allowance': IDL.Opt(IDL.Nat),
    'expires_at': IDL.Opt(IDL.Nat64),
    'spender': Account,
  });
  const Transfer = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
    'spender': IDL.Opt(Account),
  });
  const Transaction = IDL.Record({
    'burn': IDL.Opt(Burn),
    'kind': IDL.Text,
    'mint': IDL.Opt(Mint),
    'approve': IDL.Opt(Approve),
    'timestamp': IDL.Nat64,
    'transfer': IDL.Opt(Transfer),
  });
  const GetBlocksRequest = IDL.Record({
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const TransactionRange = IDL.Record({
    'transactions': IDL.Vec(Transaction),
  });
  const ArchivedRange_1 = IDL.Record({
    'callback': IDL.Func([GetBlocksRequest], [TransactionRange], ['query']),
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const GetTransactionsResponse = IDL.Record({
    'first_index': IDL.Nat,
    'log_length': IDL.Nat,
    'transactions': IDL.Vec(Transaction),
    'archived_transactions': IDL.Vec(ArchivedRange_1),
  });
  const BorrowRequest = IDL.Record({
    'principal': IDL.Principal,
    'asset_details': IDL.Text,
    'bitcoinAddress': IDL.Text,
    'asset_id': IDL.Text,
  });
  const LendData = IDL.Record({
    'transaction_id': IDL.Text,
    'mime_type': IDL.Text,
    'borrower_principal': IDL.Principal,
    'lender_principal': IDL.Principal,
    'loan_amount': IDL.Nat,
    'timestamp': IDL.Nat64,
    'repayment_amount': IDL.Nat,
    'asset_id': IDL.Text,
    'inscriptionid': IDL.Nat32,
  });
  const RepaymentData = IDL.Record({
    'lenddata': LendData,
    'repayment_transaction_id': IDL.Text,
    'timestamp': IDL.Nat64,
    'bitcoinAddress': IDL.Text,
    'repayment_amount': IDL.Nat,
    'asset_id': IDL.Text,
  });
  const TransactionDetail = IDL.Record({
    'transaction': IDL.Text,
    'fee_rate': IDL.Nat,
    'timestamp': IDL.Nat64,
    'bitcoinAddress': IDL.Text,
    'asset_id': IDL.Text,
  });
  const Time = IDL.Int;
  const Float__1 = IDL.Float64;
  const LoanRequest__1 = IDL.Record({
    'apr': IDL.Nat,
    'owner': IDL.Principal,
    'name': IDL.Text,
    'loan_amount': Float__1,
    'lender_profit': Float__1,
    'repayment_amount': Float__1,
    'loan_duration': IDL.Nat,
    'inscriptionid': IDL.Nat32,
    'platform_fee': Float__1,
    'bitcoin_price': Float__1,
  });
  const LendRecord = IDL.Record({
    'id': IDL.Nat,
    'transaction_id': IDL.Text,
    'loan_request': LoanRequest__1,
    'lender': IDL.Principal,
    'loan_start': Time,
    'loan_maturity': Time,
    'bitcoin_price': Float__1,
  });
  const LoanRequest = IDL.Record({
    'apr': IDL.Nat,
    'owner': IDL.Principal,
    'name': IDL.Text,
    'loan_amount': Float__1,
    'lender_profit': Float__1,
    'repayment_amount': Float__1,
    'loan_duration': IDL.Nat,
    'inscriptionid': IDL.Nat32,
    'platform_fee': Float__1,
    'bitcoin_price': Float__1,
  });
  const LendData__1 = IDL.Record({
    'transaction_id': IDL.Text,
    'mime_type': IDL.Text,
    'borrower_principal': IDL.Principal,
    'lender_principal': IDL.Principal,
    'loan_amount': IDL.Nat,
    'timestamp': IDL.Nat64,
    'repayment_amount': IDL.Nat,
    'asset_id': IDL.Text,
    'inscriptionid': IDL.Nat32,
  });
  const UserPortfolio = IDL.Record({
    'user': IDL.Principal,
    'activeLendings': IDL.Nat,
    'borrowValue': Float,
    'completedLoans': IDL.Nat,
    'profitEarned': Float,
    'registeredTime': IDL.Int,
    'lendingValue': Float,
    'activeBorrows': IDL.Nat,
  });
  const LoanDates = IDL.Record({
    'transaction_id': IDL.Text,
    'loan_start': Time,
    'loan_maturity': Time,
    'bitcoin_price': Float__1,
  });
  const HttpHeader = IDL.Record({ 'value': IDL.Text, 'name': IDL.Text });
  const HttpResponsePayload = IDL.Record({
    'status': IDL.Nat,
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context': IDL.Vec(IDL.Nat8),
    'response': HttpResponsePayload,
  });
  const CanisterHttpResponsePayload = IDL.Record({
    'status': IDL.Nat,
    'body': IDL.Vec(IDL.Nat8),
    'headers': IDL.Vec(HttpHeader),
  });
  const TransferError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  const Result = IDL.Variant({ 'Ok': IDL.Nat, 'Err': TransferError });
  return IDL.Service({
    'acceptCycles': IDL.Func([], [], []),
    'addApprovedCollections': IDL.Func([IDL.Text], [IDL.Bool], []),
    'addApproved_Collections': IDL.Func([ApprovedCollection], [IDL.Bool], []),
    'addBitcoinWallet': IDL.Func([IDL.Text], [IDL.Bool], []),
    'addCollectionStat': IDL.Func([IDL.Text], [IDL.Bool], []),
    'addUserSupply': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'addWalletAsset': IDL.Func([IDL.Nat32, IDL.Text], [IDL.Bool], []),
    'addWalletAssets': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'addWithDrawAssetsRequest': IDL.Func([WithdrawRequest], [IDL.Bool], []),
    'addckBTCBalance': IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'addckBTCTransactions': IDL.Func(
      [IDL.Principal, IDL.Text],
      [IDL.Bool],
      [],
    ),
    'addckEthBalance': IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'addckEthTransactions': IDL.Func(
      [IDL.Principal, IDL.Text],
      [IDL.Bool],
      [],
    ),
    'addloanOffer': IDL.Func([CollectionOffers, IDL.Nat], [IDL.Bool], []),
    'availableCycles': IDL.Func([], [IDL.Nat], ['query']),
    'backupAPI': IDL.Func([], [IDL.Bool], []),
    'ckBTCBalance': IDL.Func([], [IDL.Nat], []),
    'ckBTCTransactions': IDL.Func([], [GetTransactionsResponse], []),
    'ckEthBalance': IDL.Func([], [IDL.Nat], []),
    'getAllActiveLendings': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))],
      ['query'],
    ),
    'getAllAskRequests': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, BorrowRequest))],
      ['query'],
    ),
    'getAllAssetStatus': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ['query'],
    ),
    'getAllAssets': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ['query'],
    ),
    'getAllRepayments': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(RepaymentData)))],
      ['query'],
    ),
    'getAllTransactionHistory': IDL.Func(
      [IDL.Text],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(TransactionDetail)))],
      [],
    ),
    'getApprovedCollections': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))],
      ['query'],
    ),
    'getApproved_Collections': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, ApprovedCollection))],
      ['query'],
    ),
    'getAskRequest': IDL.Func([IDL.Text], [IDL.Vec(BorrowRequest)], ['query']),
    'getAssetStatus': IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'getBackup': IDL.Func([], [IDL.Text], ['query']),
    'getBitcoinWallets': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))],
      ['query'],
    ),
    'getCallerPrincipal': IDL.Func([], [IDL.Principal], []),
    'getCkBTC_oldest_tx_id': IDL.Func([], [IDL.Nat], ['query']),
    'getCkEth_oldest_tx_id': IDL.Func([], [IDL.Nat], ['query']),
    'getCollectionStat': IDL.Func([], [IDL.Text], ['query']),
    'getDebugMessage': IDL.Func([], [IDL.Text], ['query']),
    'getLatest_SupplyTime': IDL.Func([], [Time], ['query']),
    'getLoanRecord': IDL.Func(
      [IDL.Text],
      [IDL.Opt(IDL.Vec(LendRecord))],
      ['query'],
    ),
    'getLoanRequest': IDL.Func(
      [IDL.Text],
      [IDL.Opt(IDL.Vec(LoanRequest))],
      ['query'],
    ),
    'getLoanRequests': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(LoanRequest)))],
      ['query'],
    ),
    'getMaxLoanAmounts': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, CollectionOffers))],
      ['query'],
    ),
    'getMyLoans': IDL.Func([IDL.Text], [IDL.Vec(LoanRequest)], ['query']),
    'getOffer': IDL.Func([IDL.Nat], [IDL.Vec(CollectionOffers)], ['query']),
    'getOffers': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Vec(CollectionOffers)))],
      ['query'],
    ),
    'getTransaction': IDL.Func([IDL.Text], [IDL.Text], []),
    'getTransactionHistory': IDL.Func(
      [IDL.Text],
      [IDL.Vec(TransactionDetail)],
      [],
    ),
    'getUserBorrows': IDL.Func(
      [IDL.Principal],
      [IDL.Vec(LendData__1)],
      ['query'],
    ),
    'getUserData': IDL.Func([IDL.Principal], [UserPortfolio], ['query']),
    'getUserLending': IDL.Func(
      [IDL.Principal],
      [IDL.Vec(LendData__1)],
      ['query'],
    ),
    'getUserOffers': IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(CollectionOffers)))],
      ['query'],
    ),
    'getUserPaidAssets': IDL.Func(
      [IDL.Principal],
      [IDL.Opt(IDL.Vec(IDL.Text))],
      ['query'],
    ),
    'getUserSupply': IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getWalletAsset': IDL.Func([IDL.Text], [IDL.Vec(IDL.Nat32)], ['query']),
    'getWalletAssets': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'getWithDrawAssetsRequest': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, WithdrawRequest))],
      ['query'],
    ),
    'get_btc_usd': IDL.Func([], [IDL.Text], []),
    'get_collections': IDL.Func([], [IDL.Text], []),
    'get_project': IDL.Func([IDL.Text], [IDL.Text], []),
    'getckBTCBalance': IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getckBTCTransactions': IDL.Func(
      [IDL.Text],
      [IDL.Opt(IDL.Vec(IDL.Text))],
      ['query'],
    ),
    'getckEthBalance': IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getckEthTransactions': IDL.Func(
      [IDL.Text],
      [IDL.Opt(IDL.Vec(IDL.Text))],
      ['query'],
    ),
    'putLoanRecord': IDL.Func([LoanRequest, LoanDates], [IDL.Bool], []),
    'putLoanRequest': IDL.Func([LoanRequest], [IDL.Bool], []),
    'removeApprovedCollections': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'removeApproved_Collections': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeBitcoinWallet': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'removeLoanRequest': IDL.Func([IDL.Nat32], [IDL.Nat], []),
    'removeWalletAsset': IDL.Func([IDL.Nat32, IDL.Text], [IDL.Nat], []),
    'removeWithDrawAssetsRequest': IDL.Func(
      [TransactionDetail],
      [IDL.Bool],
      [],
    ),
    'removeloanOffer': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'resetAPICall': IDL.Func([], [IDL.Bool], []),
    'resetSupply': IDL.Func([], [IDL.Bool], []),
    'restoreBackup': IDL.Func([], [IDL.Bool], []),
    'setActiveLending': IDL.Func([IDL.Principal, LendData__1], [IDL.Bool], []),
    'setAskRequest': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Principal],
      [IDL.Bool],
      [],
    ),
    'setCkBTC_oldest_tx_id': IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setCkEth_oldest_tx_id': IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setLatest_SupplyTime': IDL.Func([Time], [Time], []),
    'setPauseRequest': IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'setRepayment': IDL.Func([IDL.Text, RepaymentData], [IDL.Bool], []),
    'set_collections': IDL.Func([IDL.Text], [IDL.Bool], []),
    'transform': IDL.Func(
      [TransformArgs],
      [CanisterHttpResponsePayload],
      ['query'],
    ),
    'updateYieldNTerms': IDL.Func([Float, IDL.Nat, IDL.Nat], [IDL.Bool], []),
    'viewTransaction': IDL.Func([IDL.Text], [IDL.Text], []),
    'wallet_receive': IDL.Func(
      [],
      [IDL.Record({ 'accepted': IDL.Nat64 })],
      [],
    ),
    'withDrawProfit': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'withDrawckBTC': IDL.Func([IDL.Nat], [Result], []),
    'withDrawckEth': IDL.Func([IDL.Nat], [Result], []),
  });
};