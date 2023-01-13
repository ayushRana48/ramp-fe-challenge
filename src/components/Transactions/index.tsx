import { useCallback, useEffect } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { fileURLToPath } from "url"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { Transaction } from "src/utils/types"

export const Transactions: TransactionsComponent = ({ transactions,callBackObj }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )

  useEffect(()=>{
    console.log("rendwr")
  },[])

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  function  handleToggle(id:any,value:any){
    if(transactions){
      for(let i=0;i<transactions.length;i++){
        if(transactions[i].id===id){
          callBackObj({...transactions[i],approved:value},5)
        }
      }
    }

  }





  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          callBack={handleToggle}
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
