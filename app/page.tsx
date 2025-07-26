"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Wallet, Target, TrendingUp, AlertTriangle, Trophy, Settings } from "lucide-react"
import AddTransactionDialog from "@/components/add-transaction-dialog"
import ExpenseList from "@/components/expense-list"
import SavingsChallenge from "@/components/savings-challenge"
import FinancialTips from "@/components/financial-tips"
import BudgetOverview from "@/components/budget-overview"
import AuthDialog from "@/components/auth-dialog"
import BudgetSettingsDialog from "@/components/budget-settings-dialog"
import UserProfile from "@/components/user-profile"

interface User {
  id: string
  name: string
  email: string
  monthlyBudget: number
  savingsGoal: number
  createdAt: string
}

interface Transaction {
  id: string
  date: string
  type: "income" | "expense"
  category: string
  amount: number
  paymentMethod: "cash" | "upi"
  notes?: string
  userId: string
}

interface BudgetData {
  totalIncome: number
  totalExpenses: number
  remainingBudget: number
  dailyBudget: number
  savingsGoal: number
  currentSavings: number
  monthlyBudget: number
}

export default function MoneyMentor() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false)
  const [budgetData, setBudgetData] = useState<BudgetData>({
    totalIncome: 0,
    totalExpenses: 0,
    remainingBudget: 0,
    dailyBudget: 0,
    savingsGoal: 5000,
    currentSavings: 0,
    monthlyBudget: 10000,
  })

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("moneymentor-user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadUserData(userData.id)
    }
  }, [])

  const loadUserData = (userId: string) => {
    const savedTransactions = localStorage.getItem(`moneymentor-transactions-${userId}`)
    const savedBudgetData = localStorage.getItem(`moneymentor-budget-${userId}`)

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedBudgetData) {
      setBudgetData(JSON.parse(savedBudgetData))
    }
  }

  // Calculate budget data whenever transactions or user changes
  useEffect(() => {
    if (!user) return

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const remainingBudget = user.monthlyBudget - totalExpenses
    const dailyBudget = remainingBudget > 0 ? remainingBudget / 30 : 0
    const currentSavings = Math.max(0, totalIncome - totalExpenses)

    const newBudgetData = {
      totalIncome,
      totalExpenses,
      remainingBudget,
      dailyBudget,
      currentSavings,
      savingsGoal: user.savingsGoal,
      monthlyBudget: user.monthlyBudget,
    }

    setBudgetData(newBudgetData)
    localStorage.setItem(`moneymentor-budget-${user.id}`, JSON.stringify(newBudgetData))
  }, [transactions, user])

  // Save transactions to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`moneymentor-transactions-${user.id}`, JSON.stringify(transactions))
    }
  }, [transactions, user])

  const handleLogin = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    localStorage.setItem("moneymentor-user", JSON.stringify(newUser))
    loadUserData(newUser.id)
  }

  const handleLogout = () => {
    setUser(null)
    setTransactions([])
    setBudgetData({
      totalIncome: 0,
      totalExpenses: 0,
      remainingBudget: 0,
      dailyBudget: 0,
      savingsGoal: 5000,
      currentSavings: 0,
      monthlyBudget: 10000,
    })
    localStorage.removeItem("moneymentor-user")
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "userId">) => {
    if (!user) return

    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user.id,
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const updateBudgetSettings = (monthlyBudget: number, savingsGoal: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      monthlyBudget,
      savingsGoal,
    }
    setUser(updatedUser)
    localStorage.setItem("moneymentor-user", JSON.stringify(updatedUser))
  }

  const getBudgetStatus = () => {
    const spentPercentage =
      budgetData.monthlyBudget > 0 ? (budgetData.totalExpenses / budgetData.monthlyBudget) * 100 : 0

    if (spentPercentage >= 90) return { status: "danger", message: "Budget Exceeded!" }
    if (spentPercentage >= 80) return { status: "warning", message: "Budget Alert!" }
    return { status: "good", message: "On Track" }
  }

  // Show auth dialog if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">MoneyMentor</h1>
            <p className="text-xl text-gray-600 mb-8">Smart Personal Finance for Students</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-semibold mb-2">Track Expenses</h3>
                <p className="text-sm text-gray-600">Monitor every rupee you spend</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold mb-2">Set Goals</h3>
                <p className="text-sm text-gray-600">Achieve your savings targets</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-semibold mb-2">Learn Finance</h3>
                <p className="text-sm text-gray-600">Build smart money habits</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsAuthDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg text-lg"
          >
            Get Started - It's Free!
          </Button>
        </div>

        <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} onLogin={handleLogin} />
      </div>
    )
  }

  const budgetStatus = getBudgetStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header with User Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MoneyMentor</h1>
            <p className="text-lg text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setIsBudgetSettingsOpen(true)} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Budget Settings
            </Button>
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        </div>

        {/* Budget Status Alert */}
        {budgetStatus.status !== "good" && (
          <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-800">{budgetStatus.message}</span>
                <span className="text-orange-700">
                  You've spent ₹{budgetData.totalExpenses.toLocaleString("en-IN")} out of ₹
                  {budgetData.monthlyBudget.toLocaleString("en-IN")} monthly budget
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Monthly Budget</p>
                  <p className="text-2xl font-bold">₹{budgetData.monthlyBudget.toLocaleString("en-IN")}</p>
                </div>
                <Wallet className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Total Expenses</p>
                  <p className="text-2xl font-bold">₹{budgetData.totalExpenses.toLocaleString("en-IN")}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Remaining</p>
                  <p className="text-2xl font-bold">₹{budgetData.remainingBudget.toLocaleString("en-IN")}</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Daily Budget</p>
                  <p className="text-2xl font-bold">₹{Math.round(budgetData.dailyBudget).toLocaleString("en-IN")}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Income / Expense
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BudgetOverview budgetData={budgetData} transactions={transactions} />
          </TabsContent>

          <TabsContent value="transactions">
            <ExpenseList transactions={transactions} />
          </TabsContent>

          <TabsContent value="savings">
            <SavingsChallenge currentSavings={budgetData.currentSavings} savingsGoal={budgetData.savingsGoal} />
          </TabsContent>

          <TabsContent value="tips">
            <FinancialTips />
          </TabsContent>

          <TabsContent value="challenges">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Weekly Challenges
                  </CardTitle>
                  <CardDescription>Complete these challenges to improve your financial habits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">₹10 Daily Challenge</h4>
                        <p className="text-sm text-gray-600">Save ₹10 every day for a week</p>
                      </div>
                      <Badge variant="secondary">7 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">No Impulse Buying</h4>
                        <p className="text-sm text-gray-600">Think twice before any purchase above ₹100</p>
                      </div>
                      <Badge variant="secondary">3 days</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Track Everything</h4>
                        <p className="text-sm text-gray-600">Record every expense for 5 days</p>
                      </div>
                      <Badge variant="secondary">5 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddTransactionDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddTransaction={addTransaction}
        />

        <BudgetSettingsDialog
          isOpen={isBudgetSettingsOpen}
          onClose={() => setIsBudgetSettingsOpen(false)}
          currentBudget={user.monthlyBudget}
          currentSavingsGoal={user.savingsGoal}
          onUpdate={updateBudgetSettings}
        />
      </div>
    </div>
  )
}
