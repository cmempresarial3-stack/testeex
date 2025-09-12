import { useState } from "react";
import { User, Bell, Moon, MessageSquare, Store, Share2, Heart, Edit, Instagram, Youtube, Clock, TestTube2, Camera } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";
import { useNotifications } from "@/context/notification-context";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

export default function Settings() {
  const { user, setUser, settings, setSettings } = useApp();
  const { requestPermission, sendTestNotification, scheduleNotifications, getPermissionStatus } = useNotifications();
  const { isDarkMode, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

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

  const handleAddPhoto = (photoUrl?: string) => {
    if (user) {
      // For now, we'll use a placeholder avatar or remove photo
      const newPhotoUrl = photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128`;
      setUser({
        ...user,
        photo: newPhotoUrl,
      });
    }
    setIsAddingPhoto(false);
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && getPermissionStatus() !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        alert("Precisamos da sua permissão para enviar notificações carinhosas! Por favor, permita nas configurações do navegador.");
        return;
      }
    }
    
    setSettings({
      ...settings,
      notificationsEnabled: checked,
    });
    
    scheduleNotifications(checked);
  };

  const handleTestNotification = () => {
    if (getPermissionStatus() === 'granted') {
      sendTestNotification();
    } else {
      alert("Por favor, ative as notificações primeiro.");
    }
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

        {/* User Profile */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  {user?.photo ? (
                    <img src={user.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <button
                  onClick={() => setIsAddingPhoto(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center border-2 border-background hover:bg-secondary/80"
                  data-testid="button-add-photo"
                >
                  <Camera className="w-3 h-3 text-secondary-foreground" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1" data-testid="text-user-name">
                  {user?.name || "Usuário"}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {getMembershipDuration()}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setEditName(user?.name || "");
                    setIsEditingProfile(true);
                  }}
                  className="p-0 h-auto text-primary"
                  data-testid="button-edit-profile"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar nome
                </Button>
              </div>
            </div>
            
            {/* Photo Dialog */}
            <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
              <DialogContent className="max-w-[95vw] w-full mx-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Foto</DialogTitle>
                </DialogHeader>
                <div className="text-center py-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Escolha uma opção para sua foto de perfil:
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAddPhoto()}
                      className="w-full"
                      data-testid="button-generate-avatar"
                    >
                      Gerar Avatar com Iniciais
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (user) {
                          setUser({ ...user, photo: undefined });
                        }
                        setIsAddingPhoto(false);
                      }}
                      className="w-full"
                      data-testid="button-remove-photo"
                    >
                      Remover Foto
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Name Dialog */}
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogContent className="max-w-[95vw] w-full mx-auto">
                <DialogHeader>
                  <DialogTitle>Editar Nome</DialogTitle>
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

          {/* Alarme de Oração */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-primary mr-3" />
                  <h4 className="font-semibold">Alarme de Oração</h4>
                </div>
                <Switch 
                  checked={settings.prayerAlarmEnabled || false}
                  onCheckedChange={(checked) => setSettings({...settings, prayerAlarmEnabled: checked})}
                  data-testid="switch-prayer-alarm"
                />
              </div>
              {settings.prayerAlarmEnabled && (
                <div className="space-y-3 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch 
                          checked={settings.morningPrayerEnabled || false}
                          onCheckedChange={(checked) => setSettings({...settings, morningPrayerEnabled: checked})}
                          data-testid="switch-morning-prayer"
                        />
                        <div>
                          <Label className="text-sm font-medium">Alarme da Manhã</Label>
                          <p className="text-xs text-muted-foreground">Lembrete matinal de oração</p>
                        </div>
                      </div>
                      {settings.morningPrayerEnabled && (
                        <Input 
                          type="time" 
                          value={settings.morningPrayerTime || '07:00'}
                          onChange={(e) => setSettings({...settings, morningPrayerTime: e.target.value})}
                          className="w-24"
                          data-testid="input-morning-prayer"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch 
                          checked={settings.eveningPrayerEnabled || false}
                          onCheckedChange={(checked) => setSettings({...settings, eveningPrayerEnabled: checked})}
                          data-testid="switch-evening-prayer"
                        />
                        <div>
                          <Label className="text-sm font-medium">Alarme da Noite</Label>
                          <p className="text-xs text-muted-foreground">Lembrete noturno de oração</p>
                        </div>
                      </div>
                      {settings.eveningPrayerEnabled && (
                        <Input 
                          type="time" 
                          value={settings.eveningPrayerTime || '19:00'}
                          onChange={(e) => setSettings({...settings, eveningPrayerTime: e.target.value})}
                          className="w-24"
                          data-testid="input-evening-prayer"
                        />
                      )}
                    </div>
                  </div>
                  {(settings.morningPrayerEnabled || settings.eveningPrayerEnabled) && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Som do Alarme</Label>
                        <select 
                          value={settings.prayerAlarmSound || 'bell'}
                          onChange={(e) => setSettings({...settings, prayerAlarmSound: e.target.value})}
                          className="w-full p-2 border rounded-md bg-background text-sm"
                          data-testid="select-prayer-sound"
                        >
                          <option value="bell">Sino Suave</option>
                          <option value="chime">Carrilhão</option>
                          <option value="nature">Sons da Natureza</option>
                          <option value="worship">Música de Adoração</option>
                          <option value="peaceful">Melodia Pacifica</option>
                        </select>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        data-testid="button-test-prayer-alarm"
                      >
                        Testar Som
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Link */}
          <div className="mt-4">
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
          </div>

          {/* Social Media */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Share2 className="w-5 h-5 text-primary mr-3" />
                Redes Sociais
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <a 
                  href="#" 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                  data-testid="link-instagram-settings"
                >
                  <Instagram className="w-6 h-6 text-pink-500" />
                  <span className="text-xs font-medium">Instagram</span>
                </a>
                <a 
                  href="#" 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                  data-testid="link-youtube-settings"
                >
                  <Youtube className="w-6 h-6 text-red-500" />
                  <span className="text-xs font-medium">YouTube</span>
                </a>
                <a 
                  href="#" 
                  className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                  data-testid="link-tiktok-settings"
                >
                  <SiTiktok className="w-6 h-6 text-black dark:text-white" />
                  <span className="text-xs font-medium">TikTok</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-primary mr-3" />
                <h4 className="font-semibold">Sugestões</h4>
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
                Enviar Sugestão
              </Button>
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
