import { useState } from "react";
import { useLocation } from "wouter";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";
import { UserProfile } from "@shared/schema";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const { setUser } = useApp();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Por favor, digite seu nome");
      return;
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      photo,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setLocation("/");
  };

  const handlePhotoClick = () => {
    // In a real app, this would open image picker
    alert("Funcionalidade de foto será implementada com Expo Image Picker");
  };

  return (
    <MobileContainer>
      <div className="min-h-screen flex flex-col justify-center p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl">💙</span>
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Verso & Paz</h1>
          <h1 className="text-2xl font-semibold mb-6">Você não está sozinho</h1>
          <p className="text-muted-foreground text-lg mb-4">Viva com propósito</p>
          <div className="p-4 bg-muted/50 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              Que bom ter você aqui! Este é o seu espaço para momentos com Deus, 
              reflexões diárias e crescimento espiritual. Vamos começar?
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-2 block">
              Como podemos te chamar?
            </Label>
            <Input 
              id="name"
              type="text" 
              placeholder="Seu nome" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-lg"
              data-testid="input-name"
            />
          </div>

          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              💡 Você pode adicionar sua foto depois nas configurações, se quiser.
            </p>
            <p className="text-xs text-muted-foreground">
              Por enquanto, vamos começar sua jornada!
            </p>
          </div>

          <Button 
            type="submit"
            className="w-full p-4 rounded-lg font-semibold"
            data-testid="button-start-journey"
          >
            Começar Jornada
          </Button>
        </form>
      </div>
    </MobileContainer>
  );
}
