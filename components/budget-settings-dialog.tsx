"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Target, TrendingUp, PiggyBank } from "lucide-react"

interface BudgetSettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  currentBudget: number
  currentSavingsGoal: number
  onUpdate: (monthlyBudget: number, savingsGoal: number) => void
}

export default function BudgetSettingsDialog({
  isOpen,
  onClose,
  currentBudget,
  currentSavingsGoal,
  onUpdate,
}: BudgetSettingsDialogProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(currentBudget)
  const [savingsGoal, setSavingsGoal] = useState(currentSavingsGoal)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(monthlyBudget, savingsGoal)
    onClose()
  }

  const budgetPresets = [
    { label: "Basic Student", amount: 5000, description: "For minimal expenses" },
    { label: "Average Student", amount: 10000, description: "Most common budget" },
    { label: "Comfortable", amount: 15000, description: "With some extras" },
    { label: "Premium", amount: 25000, description: "Higher lifestyle" },
  ]

  const savingsPresets = [
    { label: "Starter", amount: 2000, description: "Small emergency fund" },
    { label: "Standard", amount: 5000, description: "Good safety net" },
    { label: "Ambitious", amount: 10000, description: "Strong savings habit" },
    { label: "Aggressive", amount: 20000, description: "Future planning" },
  ]

  const dailyBudget = monthlyBudget / 30
  const savingsPercentage = monthlyBudget > 0 ? (savingsGoal / monthlyBudget) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Budget Settings
          </DialogTitle>
          <DialogDescription>Customize your monthly budget and savings goals</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Budget Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                Monthly Budget
              </CardTitle>
              <CardDescription>How much money do you have available each month?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyBudget">Amount (₹)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number.parseInt(e.target.value) || 0)}
                  className="text-lg font-semibold"
                />
              </div>

              <div>
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {budgetPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant={monthlyBudget === preset.amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMonthlyBudget(preset.amount)}
                      className="flex flex-col h-auto p-3"
                    >
                      <span className="font-semibold">₹{preset.amount.toLocaleString("en-IN")}</span>
                      <span className="text-xs opacity-70">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Budget Breakdown</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Daily Budget:</span>
                    <span className="font-semibold ml-2">₹{Math.round(dailyBudget)}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Weekly Budget:</span>
                    <span className="font-semibold ml-2">₹{Math.round(dailyBudget * 7)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings Goal Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Savings Goal
              </CardTitle>
              <CardDescription>How much do you want to save each month?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="savingsGoal">Target Amount (₹)</Label>
                <Input
                  id="savingsGoal"
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number.parseInt(e.target.value) || 0)}
                  className="text-lg font-semibold"
                />
              </div>

              <div>
                <Label>Savings Presets</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {savingsPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant={savingsGoal === preset.amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSavingsGoal(preset.amount)}
                      className="flex flex-col h-auto p-3"
                    >
                      <span className="font-semibold">₹{preset.amount.toLocaleString("en-IN")}</span>
                      <span className="text-xs opacity-70">{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Savings Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Savings Rate:</span>
                    <span className="font-semibold ml-2">{savingsPercentage.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-green-700">Yearly Savings:</span>
                    <span className="font-semibold ml-2">₹{(savingsGoal * 12).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savingsPercentage < 10 && (
                  <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <p className="text-sm text-orange-800">
                      <strong>Low Savings Rate:</strong> Try to save at least 10-20% of your budget for emergencies.
                    </p>
                  </div>
                )}
                {savingsPercentage >= 10 && savingsPercentage < 20 && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Good Start:</strong> You're on track! Consider increasing to 20% for better financial
                      security.
                    </p>
                  </div>
                )}
                {savingsPercentage >= 20 && (
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Excellent!</strong> You're building strong financial habits with a{" "}
                      {savingsPercentage.toFixed(1)}% savings rate.
                    </p>
                  </div>
                )}
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                  <p className="text-sm text-purple-800">
                    <strong>Pro Tip:</strong> Follow the 50-30-20 rule: 50% needs, 30% wants, 20% savings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
