import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const[visibleTransactions,setVisibleTransactions]=useState<Transaction[]>([]);

  //fixed bug 4 by creating use state that appends new items to list of visible transactions
  const fetchAll = useCallback(async (s:any) => {
    console.log(s)
    if(s==="reset"){
      setVisibleTransactions([])
      return;
    }

    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    if(s==="page"){
      console.log(response?.nextPage)
      return response?.nextPage;
    }


    
    if(response!=null){
      setVisibleTransactions((visibleTransactions)=> visibleTransactions.concat(response?.data))
    }

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
      console.log(visibleTransactions)

      return { data: visibleTransactions.concat(response.data), nextPage: response.nextPage }
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll,invalidateData }
}
