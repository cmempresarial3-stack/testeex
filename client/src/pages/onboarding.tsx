import { useState, useEffect } from "react";
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

  // Gerar avatar automaticamente quando o nome mudar
  useEffect(() => {
    if (name.trim()) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3b82f6&color=fff&size=128`;
      setPhoto(avatarUrl);
    } else {
      setPhoto(undefined);
    }
  }, [name]);

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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-semibold text-lg">
                  {name.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Seu avatar será gerado automaticamente
            </p>
          </div>
          
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
