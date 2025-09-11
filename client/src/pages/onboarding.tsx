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
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
            alt="Sunrise over mountains" 
            className="w-full h-48 object-cover rounded-xl mb-6" 
          />
          
          <h1 className="text-3xl font-bold gradient-text mb-4">Bem-vindo ao seu</h1>
          <h1 className="text-3xl font-bold gradient-text mb-6">Momento com Deus</h1>
          <p className="text-muted-foreground text-lg mb-8">Sua jornada espiritual começa aqui</p>
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

          <div className="text-center">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors"
              data-testid="button-photo"
            >
              <Camera className="w-6 h-6 text-muted-foreground" />
            </button>
            <p className="text-sm text-muted-foreground">Foto opcional</p>
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
