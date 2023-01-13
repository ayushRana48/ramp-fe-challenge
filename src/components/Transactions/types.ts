import { FunctionComponent } from "react"
import { Transaction } from "../../utils/types"

export type SetTransactionApprovalFunction = (params: {
  transactionId: string
  newValue: boolean
}) => Promise<void>


type TransactionsProps = { 
  transactions: Transaction[] | null
  callBackObj: (a:any,b:any) =>any}

type TransactionPaneProps = {
  transaction: Transaction
  callBack: (a: any, b: any) => any;
  loading: boolean
  approved?: boolean
  setTransactionApproval: SetTransactionApprovalFunction
}

export type TransactionsComponent = FunctionComponent<TransactionsProps>
export type TransactionPaneComponent = FunctionComponent<TransactionPaneProps>
