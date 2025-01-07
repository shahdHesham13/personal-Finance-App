import React, { createContext, useEffect, useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "http://localhost:5000/api/v1/";


const GlobalContext = React.createContext()


export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    axios.defaults.withCredentials = true;

    //calculate incomes
    const addIncome = async (income) => {
        try {
          const response = await axios.post(`${BASE_URL}add-income`, income);
          getIncomes();
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };

    const getIncomes = async () => {
        try {
          const response = await axios.get(`${BASE_URL}get-incomes`);
          setIncomes(response.data);
          console.log(response.data);
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };

    const deleteIncome = async (id) => {
        try {
          const res = await axios.delete(`${BASE_URL}delete-income/${id}`);
          getIncomes();
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };
    
    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
          totalIncome = totalIncome + income.amount;
        });
        return totalIncome;
      };


    //calculate incomes
const addExpense = async (expense) => {
        try {
          const response = await axios.post(`${BASE_URL}add-expense`, expense);
          getExpenses();
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };
    
    const getExpenses = async () => {
        try {
          const response = await axios.get(`${BASE_URL}get-expenses`);
          setExpenses(response.data);
          console.log(response.data);
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };

    const deleteExpense = async (id) => {
        try {
          const res = await axios.delete(`${BASE_URL}delete-expense/${id}`);
          getExpenses();
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred");
        }
      };


    const totalExpenses = () => {
            let totalExpense = 0;
            expenses.forEach((expense) => {
              totalExpense = totalExpense + expense.amount;
            });
            return totalExpense;
          };


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}