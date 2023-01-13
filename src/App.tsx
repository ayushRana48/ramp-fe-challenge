import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee, Transaction } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [complete,setComplete] = useState(false)
  const [isEmptyEmp,setIsEmptyEmp]=useState(true)
  const [currentPage,setCurrentPage]=useState(5)
  const [knownChanges,setKnownChanges]=useState<Transaction[]>([]);
  
  useEffect(()=>{
    setComplete(paginatedTransactionsUtils.loading);
  },[paginatedTransactionsUtils.loading])

  useEffect(()=>{
    if(currentPage==null){
      setComplete(true)
    }
  },[currentPage])

  
  let transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )



  //fix bug 7
  //updates transaction to match known Changes, then transaction prop changes, which re renderes Transaction Pane,
  useEffect(()=>{
    //change num so transaction pane re renders
    if(transactions){
      for(let i=0;i<transactions?.length;i++){
        if(i==2){
          console.log(includes(knownChanges,transactions[2]))
        }
        if(includes(knownChanges,transactions[i])>=0){

          const knownChangesElem= knownChanges[includes(knownChanges,transactions[i])]
          console.log(knownChangesElem)


          transactions[i]=knownChangesElem

        }
      }
    }
    console.log(transactions)

  },[transactionsByEmployee,paginatedTransactions])

  useEffect(()=>{
    console.log("changeEmployee")
  },[transactionsByEmployee])


  const loadAllTransactions = useCallback(async (s: any) => {

    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll("s")
    await paginatedTransactionsUtils.fetchAll(s)

    //here we use the fetchAll method to check the page num if s ==="page"
    if(s==="page"){
      setCurrentPage(await paginatedTransactionsUtils.fetchAll(s))
    }


    
    
    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  //checks if obj in list based on id
  function includes(list:Transaction[],elem:any){
    for(let i=0;i<list.length;i++){
      if(elem.id===list[i].id){
        return i;
      }
    }
    return -1;

  }

  
  //changes known changes state to have all updated elements, ie. if I change approve from original, known
  //changes list adds object with new value. If obj already in known changes state it just updates elements 
  //value
  function fixTransactions(newObj:any){
      console.log(newObj)
    setKnownChanges((xList)=>{
      if(includes(xList,newObj)>=0){
        const index = includes(xList,newObj)
        xList[index]=newObj
      }
      else{
        xList.push(newObj)
      }

      return xList
    })
    
    console.log("knownChanges")
    console.log(knownChanges)
  }

  

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
      setComplete(true)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions("justShow")
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])


  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            //Fixed bug 3 by checking if empty employee load all else load id
            if(newValue==EMPTY_EMPLOYEE){
              await loadAllTransactions("justShow")
              setIsEmptyEmp(true)


            }
            else{
              await loadAllTransactions("reset")
              setIsEmptyEmp(false)
              await loadTransactionsByEmployee(newValue.id)

            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} callBackObj={fixTransactions}/>


          {transactions !== null && (
            <button
              className="RampButton"
              disabled={complete}
              onClick={async () => {
                await loadAllTransactions("new")
                await loadAllTransactions("page")
              }}
            >
              View More
            </button>
          )}
        </div>
        {/* <button onClick={changeZero}>Change </button> */}
      </main>
    </Fragment>
  )
}
