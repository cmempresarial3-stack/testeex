import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, Bell, Target, ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'prayer' | 'reading' | 'devotional' | 'reminder';
  completed: boolean;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Oração matinal",
    description: "Momento de gratidão e pedidos",
    date: "2024-12-11",
    time: "07:00",
    type: "prayer",
    completed: true
  },
  {
    id: "2", 
    title: "Leitura bíblica",
    description: "Salmos 23",
    date: "2024-12-11",
    time: "19:00",
    type: "reading",
    completed: false
  },
  {
    id: "3",
    title: "Devocional semanal",
    description: "Reflexão sobre fé e esperança",
    date: "2024-12-12",
    time: "20:00",
    type: "devotional",
    completed: false
  }
];

export default function Calendar() {
  const { user } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    time: "19:00",
    type: "reminder" as CalendarEvent['type']
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();
  const isToday = (day: number) => {
    return currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'prayer': return 'bg-primary/20 text-primary-foreground';
      case 'reading': return 'bg-secondary/20 text-secondary-foreground';
      case 'devotional': return 'bg-accent/20 text-accent-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'prayer': return 'Oração';
      case 'reading': return 'Leitura';
      case 'devotional': return 'Devocional';
      default: return 'Lembrete';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) return;

    if (editingEvent) {
      // Editing existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: newEvent.title,
              description: newEvent.description,
              date: newEvent.date,
              time: newEvent.time,
              type: newEvent.type
            }
          : event
      ));
      setEditingEvent(null);
    } else {
      // Creating new event
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type,
        completed: false
      };
      setEvents([...events, event]);
    }

    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: "19:00",
      type: "reminder"
    });
    setIsDialogOpen(false);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja deletar este evento?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDate(dateStr);
    }
  };

  const getMonthEvents = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, completed: !event.completed }
        : event
    ));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const userName = user?.name || "Amigo";

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Calendário Espiritual</h2>
            <p className="text-muted-foreground">Organize sua jornada de fé, {userName}</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingEvent(null);
              setNewEvent({
                title: "",
                description: "",
                date: new Date().toISOString().split('T')[0],
                time: "19:00",
                type: "reminder"
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="icon" data-testid="button-create-event">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full mx-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Editar Evento' : 'Novo Lembrete'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Oração matinal"
                    data-testid="input-event-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Detalhes opcionais"
                    rows={3}
                    data-testid="textarea-event-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      data-testid="input-event-date"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      data-testid="input-event-time"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1" data-testid="button-save-event">
                    Salvar
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-event"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={previousMonth} data-testid="button-previous-month">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="text-lg font-semibold" data-testid="text-current-month">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <Button variant="ghost" size="icon" onClick={nextMonth} data-testid="button-next-month">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const hasCompletedEvents = dayEvents.some(e => e.completed);
                
                return (
                  <div
                    key={day}
                    className={`p-2 text-center text-sm cursor-pointer hover:bg-muted rounded ${
                      isToday(day) ? 'bg-primary text-primary-foreground font-bold' : ''
                    }`}
                    onClick={() => handleDayClick(day)}
                    data-testid={`calendar-day-${day}`}
                  >
                    <div>{day}</div>
                    {hasEvents && (
                      <div className="flex justify-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          hasCompletedEvents ? 'bg-green-500' : 'bg-secondary'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Eventos de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.filter(e => e.date === new Date().toISOString().split('T')[0]).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum evento agendado para hoje
              </p>
            ) : (
              <div className="space-y-3">
                {events
                  .filter(e => e.date === new Date().toISOString().split('T')[0])
                  .map(event => (
                    <div 
                      key={event.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        event.completed ? 'bg-muted/50 opacity-75' : 'bg-card'
                      }`}
                      data-testid={`event-${event.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleEventCompletion(event.id)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          event.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-muted-foreground hover:border-primary'
                        }`}
                        data-testid={`button-toggle-${event.id}`}
                      >
                        {event.completed && <span className="text-xs">✓</span>}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                            {event.title}
                          </h4>
                          <Badge className={getTypeColor(event.type)}>
                            {getTypeLabel(event.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.time} • {event.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                          className="w-8 h-8"
                          data-testid={`button-edit-${event.id}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-8 h-8 text-destructive hover:text-destructive"
                          data-testid={`button-delete-${event.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events of the Month */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
              Eventos do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getMonthEvents().length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum evento agendado para este mês
              </p>
            ) : (
              <div className="space-y-3">
                {getMonthEvents().slice(0, 5).map(event => {
                  const eventDate = new Date(event.date);
                  const dayOfMonth = eventDate.getDate();
                  return (
                    <div 
                      key={event.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        event.completed ? 'bg-muted/50 opacity-75' : 'bg-card'
                      }`}
                      data-testid={`monthly-event-${event.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{dayOfMonth}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                            {event.title}
                          </h4>
                          <Badge className={getTypeColor(event.type)}>
                            {getTypeLabel(event.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.time} • {event.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                          className="w-8 h-8"
                          data-testid={`button-edit-monthly-${event.id}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-8 h-8 text-destructive hover:text-destructive"
                          data-testid={`button-delete-monthly-${event.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spiritual Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Progresso Espiritual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  Olá, {userName}! 🙏
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Você visitou o app 3 dias consecutivos!
                </p>
                <p className="text-sm font-medium text-primary">
                  Parabéns por buscar se aproximar mais de Deus! ✨
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {events.filter(e => e.completed).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Atividades Concluídas</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">Dias Consecutivos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Day Events Dialog */}
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-[95vw] w-full mx-auto">
            <DialogHeader>
              <DialogTitle>
                Eventos de {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {selectedDate && getEventsForDay(new Date(selectedDate + 'T00:00:00').getDate()).map(event => (
                <div 
                  key={event.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    event.completed ? 'bg-muted/50 opacity-75' : 'bg-card'
                  }`}
                  data-testid={`day-event-${event.id}`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleEventCompletion(event.id)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      event.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                    data-testid={`button-toggle-day-${event.id}`}
                  >
                    {event.completed && <span className="text-xs">✓</span>}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                        {event.title}
                      </h4>
                      <Badge className={getTypeColor(event.type)}>
                        {getTypeLabel(event.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.time} • {event.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDate(null);
                        handleEditEvent(event);
                      }}
                      className="w-8 h-8"
                      data-testid={`button-edit-day-${event.id}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDate(null);
                        handleDeleteEvent(event.id);
                      }}
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      data-testid={`button-delete-day-${event.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileContainer>
  );
}