import { useState } from "react";
import { Plus, Search, Edit, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";
import { Note } from "@shared/schema";

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "reflection" as Note['type'],
  });

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.title.trim() || !newNote.content.trim()) {
      return;
    }

    if (editingNote) {
      updateNote(editingNote.id, {
        title: newNote.title,
        content: newNote.content,
        type: newNote.type,
      });
    } else {
      addNote(newNote);
    }

    setNewNote({ title: "", content: "", type: "reflection" });
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      type: note.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (noteId: string) => {
    if (confirm("Tem certeza que deseja excluir esta anotação?")) {
      deleteNote(noteId);
    }
  };

  const getTypeColor = (type: Note['type']) => {
    switch (type) {
      case 'devotional': return 'bg-secondary/20 text-secondary-foreground';
      case 'prayer': return 'bg-primary/20 text-primary-foreground';
      case 'verses': return 'bg-accent/20 text-accent-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getTypeLabel = (type: Note['type']) => {
    switch (type) {
      case 'devotional': return 'Devocional';
      case 'prayer': return 'Oração';
      case 'verses': return 'Versículos';
      default: return 'Reflexão';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias atrás`;
    }
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Minhas Anotações</h2>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" data-testid="button-create-note">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full mx-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Título da anotação"
                    data-testid="input-note-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={newNote.type} 
                    onValueChange={(value: Note['type']) => setNewNote({ ...newNote, type: value })}
                  >
                    <SelectTrigger data-testid="select-note-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reflection">Reflexão</SelectItem>
                      <SelectItem value="devotional">Devocional</SelectItem>
                      <SelectItem value="prayer">Oração</SelectItem>
                      <SelectItem value="verses">Versículos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Escreva sua anotação aqui..."
                    rows={6}
                    data-testid="textarea-note-content"
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1" data-testid="button-save-note">
                    {editingNote ? 'Atualizar' : 'Salvar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingNote(null);
                      setNewNote({ title: "", content: "", type: "reflection" });
                    }}
                    data-testid="button-cancel-note"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Buscar anotações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-notes"
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'Nenhuma anotação encontrada.' : 'Você ainda não tem anotações.'}
                </p>
                {!searchQuery && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsDialogOpen(true)}
                    data-testid="button-first-note"
                  >
                    Criar primeira anotação
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow" data-testid={`card-note-${note.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{note.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(note.type)}>
                      {getTypeLabel(note.type)}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(note)}
                        data-testid={`button-edit-note-${note.id}`}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-share-note-${note.id}`}
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(note.id)}
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
