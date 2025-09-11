import { useState } from "react";
import { User, Bell, Moon, MessageSquare, Store, Share2, Heart, Edit, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

export default function Settings() {
  const { user, setUser, settings, setSettings } = useApp();
  const { isDarkMode, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");

  const handleSaveFeedback = () => {
    if (feedback.trim()) {
      // In a real app, this would send feedback via email API
      alert("Feedback enviado! Obrigado por compartilhar suas sugestões conosco.");
      setFeedback("");
    }
  };

  const handleSaveProfile = () => {
    if (user && editName.trim()) {
      setUser({
        ...user,
        name: editName.trim(),
      });
      setIsEditingProfile(false);
    }
  };

  const handleNotificationToggle = (checked: boolean) => {
    setSettings({
      ...settings,
      notificationsEnabled: checked,
    });
  };

  const getMembershipDuration = () => {
    if (!user) return "Novo membro";
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Membro desde hoje";
    if (diffDays < 30) return `Membro há ${diffDays} dias`;
    const months = Math.floor(diffDays / 30);
    return `Membro há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <h2 className="text-2xl font-bold mb-6">Configurações</h2>

        {/* User Profile */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
              {user?.photo ? (
                <img src={user.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2" data-testid="text-user-name">
              {user?.name || "Usuário"}
            </h3>
            <p className="text-muted-foreground mb-3">
              {getMembershipDuration()}
            </p>
            
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditName(user?.name || "")}
                  data-testid="button-edit-profile"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full mx-auto">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Seu nome"
                      data-testid="input-edit-name"
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSaveProfile} className="flex-1" data-testid="button-save-profile">
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingProfile(false)}
                      data-testid="button-cancel-profile"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <div className="space-y-4">
          {/* Notifications */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-primary mr-3" />
                  <h4 className="font-semibold">Notificações</h4>
                </div>
                <Switch 
                  checked={settings.notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                  data-testid="switch-notifications"
                />
              </div>
              {settings.notificationsEnabled && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hora da manhã</span>
                    <span className="text-muted-foreground">{settings.morningTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora da noite</span>
                    <span className="text-muted-foreground">{settings.eveningTime}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-primary"
                    data-testid="button-configure-sounds"
                  >
                    Configurar Sons
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dark Mode */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="w-5 h-5 text-primary mr-3" />
                  <h4 className="font-semibold">Modo Escuro</h4>
                </div>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  data-testid="switch-dark-mode"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-primary mr-3" />
                <h4 className="font-semibold">Feedback</h4>
              </div>
              <Textarea 
                placeholder="Compartilhe suas sugestões..." 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="resize-none h-20 text-sm mb-2"
                data-testid="textarea-feedback"
              />
              <Button 
                size="sm" 
                onClick={handleSaveFeedback}
                disabled={!feedback.trim()}
                data-testid="button-send-feedback"
              >
                Enviar Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Store Link */}
          <Link href="/store">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Store className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <h4 className="font-semibold">Nossa Loja</h4>
                      <p className="text-sm text-muted-foreground">Produtos cristãos</p>
                    </div>
                  </div>
                  <div className="text-primary" data-testid="link-store-arrow">
                    →
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Social Media */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Share2 className="w-5 h-5 text-primary mr-3" />
                Redes Sociais
              </h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  data-testid="link-instagram-settings"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-sm">Instagram</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  data-testid="link-youtube-settings"
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span className="text-sm">YouTube</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inspirational Message */}
        <Card className="mt-8">
          <CardContent className="p-6 bg-gradient-to-r from-primary to-secondary text-white text-center rounded-lg">
            <Heart className="w-8 h-8 mx-auto mb-3" />
            <p className="font-medium">
              "Que Deus continue abençoando sua jornada espiritual. Você não caminha sozinho!"
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}
