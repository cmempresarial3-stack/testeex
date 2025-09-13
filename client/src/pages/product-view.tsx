import { useState, useEffect } from "react";
import { ArrowLeft, Heart, ExternalLink, User, Calendar, Star, MessageCircle, Send } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MobileContainer } from "@/components/ui/mobile-container";

type Product = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  precoOriginal: number;
  precoPromocional: number;
  estoque: boolean;
  linkLoja: string;
  comentarios: Array<{
    nome: string;
    texto: string;
    data: string;
  }>;
};

type WeeklyProduct = Product & {
  badge: string;
  urgencia: string;
};

export default function ProductView() {
  const [, setLocation] = useLocation();
  const params = useParams<{ productData: string }>();
  const [product, setProduct] = useState<Product | WeeklyProduct | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({ nome: '', email: '', texto: '' });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (params.productData) {
        const decodedData = decodeURIComponent(params.productData);
        const productData = JSON.parse(decodedData);
        setProduct(productData);
        // Scroll to top when product loads
        window.scrollTo(0, 0);
      } else {
        setLocation("/store");
      }
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      setLocation("/store");
    }
  }, [params.productData, setLocation]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateDiscount = (original: number, promotional: number) => {
    if (original === 0) return 0;
    return Math.round(((original - promotional) / original) * 100);
  };

  const handlePurchase = () => {
    setShowPurchaseDialog(true);
  };

  const confirmPurchase = () => {
    if (product) {
      window.open(product.linkLoja, '_blank', 'noopener,noreferrer');
      setShowPurchaseDialog(false);
    }
  };

  const handleCommentSubmit = () => {
    if (commentForm.nome && commentForm.email && commentForm.texto) {
      setCommentSubmitted(true);
      setShowCommentForm(false);
      setCommentForm({ nome: '', email: '', texto: '' });
      setTimeout(() => setCommentSubmitted(false), 3000);
    }
  };

  if (!product) {
    return (
      <MobileContainer>
        <div className="p-4">
          <p>Carregando produto...</p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/store")}
            className="mr-3"
            data-testid="button-back-store"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-lg font-semibold truncate">Detalhes do Produto</h1>
        </div>

        {/* Product Header */}
        <div className="mb-6">
          {('badge' in product) && (
            <div className="mb-3">
              <Badge variant="destructive" className="text-sm">
                {product.badge}
              </Badge>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2" data-testid="text-product-title">
            {product.nome}
          </h1>
        </div>

        {/* Product Image */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <img 
              src={product.imagem} 
              alt={product.nome}
              className="w-full h-64 object-cover rounded-lg" 
            />
          </CardContent>
        </Card>

        {/* Price Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                {product.precoOriginal > 0 && (
                  <span className="text-lg text-muted-foreground line-through block">
                    {formatPrice(product.precoOriginal)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.precoPromocional)}
                </span>
              </div>
              {product.precoOriginal > 0 && (
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {calculateDiscount(product.precoOriginal, product.precoPromocional)}% OFF
                </Badge>
              )}
            </div>
            
            {('urgencia' in product) && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  ⏰ {product.urgencia}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${product.estoque ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.estoque ? 'text-green-600' : 'text-red-600'}`}>
                {product.estoque ? 'Em estoque' : 'Produto esgotado'}
              </span>
            </div>

            <Button 
              onClick={handlePurchase}
              className="w-full text-lg py-6"
              disabled={!product.estoque}
              data-testid="button-buy-product"
            >
              {product.estoque ? (
                <>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Comprar Agora
                </>
              ) : (
                "Produto Esgotado"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Product Description */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.descricao}
            </p>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 text-primary mr-2" />
              Comentários
            </h3>
            
            {/* Fake Comments */}
            <div className="space-y-4 mb-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Maria Silva</span>
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">15/09/2025</span>
                </div>
                <p className="text-sm leading-relaxed">Produto excelente! A qualidade superou minhas expectativas. Recomendo muito!</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">João Santos</span>
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">12/09/2025</span>
                </div>
                <p className="text-sm leading-relaxed">Chegou rapidinho e bem embalado. Muito satisfeito com a compra!</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Ana Costa</span>
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">08/09/2025</span>
                </div>
                <p className="text-sm leading-relaxed">Linda peça! Vai ficar perfeita na minha casa. O atendimento também foi ótimo.</p>
              </div>
            </div>
            
            {/* Comment Success Message */}
            {commentSubmitted && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✅ Comentário enviado com sucesso!
                </p>
              </div>
            )}
            
            {/* Comment Button */}
            <Button 
              onClick={() => setShowCommentForm(true)}
              className="w-full"
              data-testid="button-add-comment"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Adicionar Comentário
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-[90vw] w-full mx-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
          </DialogHeader>
          {product && (
            <div className="space-y-4">
              <div className="text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-primary mb-2">
                  "Ótima escolha! 10% da sua compra são destinados a doações."
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Você será redirecionado para finalizar sua compra de forma segura.
                </p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={product.imagem} 
                    alt={product.nome}
                    className="w-16 h-16 object-cover rounded-lg" 
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.nome}</h4>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(product.precoPromocional)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPurchaseDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmPurchase}
                  className="flex-1"
                  data-testid="button-confirm-purchase"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ir para Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comment Form Dialog */}
      <Dialog open={showCommentForm} onOpenChange={setShowCommentForm}>
        <DialogContent className="max-w-[90vw] w-full mx-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Comentário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome *</label>
              <Input 
                value={commentForm.nome}
                onChange={(e) => setCommentForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Seu nome"
                data-testid="input-comment-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email *</label>
              <Input 
                type="email"
                value={commentForm.email}
                onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                data-testid="input-comment-email"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comentário *</label>
              <Textarea 
                value={commentForm.texto}
                onChange={(e) => setCommentForm(prev => ({ ...prev, texto: e.target.value }))}
                placeholder="Escreva seu comentário sobre o produto..."
                rows={4}
                data-testid="input-comment-text"
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCommentForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCommentSubmit}
                className="flex-1"
                disabled={!commentForm.nome || !commentForm.email || !commentForm.texto}
                data-testid="button-submit-comment"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Comentário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileContainer>
  );
}