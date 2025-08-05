'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  userRole: 'free' | 'pro' | 'elite' | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserRole: (role: 'free' | 'pro' | 'elite') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'free' | 'pro' | 'elite' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'free')
        } else {
          // Create new user document with free role
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: user.displayName || '',
            role: 'free',
            createdAt: new Date(),
            predictionsUsed: 0,
            maxPredictions: 2
          })
          setUserRole('free')
        }
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update display name
      await updateProfile(user, { displayName: name })
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        role: 'free',
        createdAt: new Date(),
        predictionsUsed: 0,
        maxPredictions: 2
      })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateUserRole = async (role: 'free' | 'pro' | 'elite') => {
    if (!user) throw new Error('No user logged in')
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: role,
        maxPredictions: role === 'free' ? 2 : role === 'pro' ? 1000 : 10000
      })
      setUserRole(role)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}