'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Cpu } from 'lucide-react'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 pb-6 flex flex-col items-center border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
              <Cpu className="size-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold italic text-foreground text-lg tracking-tight">JR BECKMAN</span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-[0.2em] uppercase">Informática</span>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Seja bem-vindo</h1>
            <p className="text-sm text-muted-foreground">
              Por favor faça login utilizando sua credenciais.
            </p>
          </div>

          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground text-xs uppercase font-medium tracking-wide">Nome</Label>
              <Input 
                id="username" 
                name="username" 
                placeholder="Seu nome" 
                className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground/40 h-10"
              />
              {state?.errors?.username && (
                <p className="text-destructive text-xs">{state.errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-xs uppercase font-medium tracking-wide">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Sua senha" 
                className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground/40 h-10"
              />
              {state?.errors?.password && (
                <p className="text-destructive text-xs">{state.errors.password}</p>
              )}
            </div>

            {state?.message && (
              <p className="text-destructive text-sm text-center">{state.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 mt-2"
              disabled={isPending}
            >
              {isPending ? 'Entrando...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
