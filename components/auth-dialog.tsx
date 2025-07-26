"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, LogIn, Mail, UserIcon, Target, Wallet } from "lucide-react"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export default function AuthDialog({ isOpen, onClose, onLogin }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState("signup")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    monthlyBudget: "10000",
    savingsGoal: "5000",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) return

    const userData = {
      name: formData.name,
      email: formData.email,
      monthlyBudget: Number.parseInt(formData.monthlyBudget),
      savingsGoal: Number.parseInt(formData.savingsGoal),
    }

    onLogin(userData)
    onClose()
  }

  const handleQuickStart = () => {
    const userData = {
      name: "Student",
      email: "student@example.com",
      monthlyBudget: 10000,
      savingsGoal: 5000,
    }
    onLogin(userData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to MoneyMentor</DialogTitle>
          <DialogDescription className="text-center">
            Start your journey to better financial management
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Your Account</CardTitle>
                <CardDescription>Set up your profile and financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthlyBudget" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Monthly Budget (₹)
                      </Label>
                      <Input
                        id="monthlyBudget"
                        type="number"
                        placeholder="10000"
                        value={formData.monthlyBudget}
                        onChange={(e) => handleInputChange("monthlyBudget", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="savingsGoal" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Savings Goal (₹)
                      </Label>
                      <Input
                        id="savingsGoal"
                        type="number"
                        placeholder="5000"
                        value={formData.savingsGoal}
                        onChange={(e) => handleInputChange("savingsGoal", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Create Account & Start Tracking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome Back</CardTitle>
                <CardDescription>Sign in to your MoneyMentor account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Start Option */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Just want to try it out?</p>
          <Button
            variant="outline"
            onClick={handleQuickStart}
            className="w-full border-dashed border-2 hover:bg-gray-50 bg-transparent"
          >
            🚀 Quick Start (Demo Account)
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs text-gray-600">Track Expenses</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-xs text-gray-600">Set Goals</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-xs text-gray-600">Learn Finance</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
