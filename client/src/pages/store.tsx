import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, Shield, Star, Clock, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MobileContainer } from "@/components/ui/mobile-container";
import storeData from "@/data/store-products.json";

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

export default function Store() {
  const [, setLocation] = useLocation();
  const [showFullStore, setShowFullStore] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<Product | WeeklyProduct | null>(null);
  
  const weeklyProduct = storeData.productOfWeek as WeeklyProduct;
  const featuredProducts = storeData.featuredProducts as Product[];
  const availableFeaturedProducts = featuredProducts.filter(p => p.estoque).slice(0, 9);
  
  const handlePurchase = (linkLoja: string) => {
    if (linkLoja) {
      window.open(linkLoja, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleViewProduct = (product: Product | WeeklyProduct) => {
    // Navegar para página interna de detalhes do produto
    const productData = encodeURIComponent(JSON.stringify(product));
    setLocation(`/product/${productData}`);
  };
  
  const handleWeeklyProductAction = (action: 'view' | 'buy') => {
    if (action === 'buy') {
      setSelectedProductToBuy(weeklyProduct);
      setShowPurchaseDialog(true);
    } else {
      handleViewProduct(weeklyProduct);
    }
  };
  
  const handleProductPurchase = (product: Product | WeeklyProduct) => {
    setSelectedProductToBuy(product);
    setShowPurchaseDialog(true);
  };
  
  const confirmPurchase = () => {
    if (selectedProductToBuy) {
      handlePurchase(selectedProductToBuy.linkLoja);
      setShowPurchaseDialog(false);
      setSelectedProductToBuy(null);
    }
  };

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

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Nossa Loja</h2>
          <p className="text-muted-foreground">Produtos que fortalecem sua fé</p>
        </div>

        {/* Produto da Semana */}
        <Card className="mb-6 relative overflow-hidden border-primary/20">
          <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
            {weeklyProduct.badge}
          </div>
          <CardContent className="p-6 pt-12">
            <img 
              src={weeklyProduct.imagem} 
              alt={weeklyProduct.nome}
              className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer" 
              onClick={() => handleViewProduct(weeklyProduct)}
            />
            <h3 className="text-xl font-bold mb-2">{weeklyProduct.nome}</h3>
            <p className="text-muted-foreground mb-4">{weeklyProduct.descricao}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                {weeklyProduct.precoOriginal > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(weeklyProduct.precoOriginal)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(weeklyProduct.precoPromocional)}
                </span>
                {weeklyProduct.precoOriginal > 0 && (
                  <Badge variant="destructive" className="w-fit mt-1">
                    {calculateDiscount(weeklyProduct.precoOriginal, weeklyProduct.precoPromocional)}% OFF
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">{weeklyProduct.urgencia}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => handleWeeklyProductAction('view')}
                variant="outline"
                className="flex-1"
                data-testid="button-view-weekly"
              >
                Ver Detalhes
              </Button>
              <Button 
                onClick={() => handleWeeklyProductAction('buy')}
                className="flex-1"
                data-testid="button-buy-weekly"
              >
                Comprar Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Produtos em Destaque */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Produtos em Destaque
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {availableFeaturedProducts.map((product) => (
              <Card key={product.id} data-testid={`card-product-${product.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  {!product.estoque && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Esgotado
                    </div>
                  )}
                  <img 
                    src={product.imagem} 
                    alt={product.nome}
                    className="w-full h-32 object-cover rounded-lg mb-3 cursor-pointer" 
                    onClick={() => handleViewProduct(product)}
                  />
                  <h4 className="font-semibold mb-2 text-sm">{product.nome}</h4>
                  
                  <div className="mb-3">
                    {product.precoOriginal > 0 && (
                      <span className="text-xs text-muted-foreground line-through block">
                        {formatPrice(product.precoOriginal)}
                      </span>
                    )}
                    <span className="font-bold text-primary">{formatPrice(product.precoPromocional)}</span>
                    {product.precoOriginal > 0 && (
                      <Badge variant="destructive" className="ml-1 text-xs">
                        -{calculateDiscount(product.precoOriginal, product.precoPromocional)}%
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 text-xs"
                      data-testid={`button-view-${product.id}`}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleProductPurchase(product)}
                      className="flex-1 text-xs"
                      disabled={!product.estoque}
                      data-testid={`button-buy-${product.id}`}
                    >
                      Comprar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Banner Final */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-bold mb-2">"Descubra itens que contam sua história e fortalecem sua fé."</h3>
            <Button 
              onClick={() => setShowFullStore(true)}
              className="mt-4"
              data-testid="button-full-store"
            >
              Loja completa
            </Button>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">Pagamento Seguro</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Aceitamos cartão, PIX e boleto
            </p>
            <p className="text-xs text-muted-foreground flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              10% da sua compra são destinados a doações
            </p>
          </CardContent>
        </Card>


        {/* Purchase Confirmation Dialog */}
        <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
          <DialogContent className="max-w-[90vw] w-full mx-auto">
            <DialogHeader>
              <DialogTitle>Confirmar Compra</DialogTitle>
            </DialogHeader>
            {selectedProductToBuy && (
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
                      src={selectedProductToBuy.imagem} 
                      alt={selectedProductToBuy.nome}
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{selectedProductToBuy.nome}</h4>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(selectedProductToBuy.precoPromocional)}
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
                    data-testid="button-go-to-payment"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir para Pagamento
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Full Store Modal */}
        <Dialog open={showFullStore} onOpenChange={setShowFullStore}>
          <DialogContent className="max-w-[95vw] w-full mx-auto max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Loja Completa - Todos os Produtos</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-auto">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <img 
                      src={product.imagem} 
                      alt={product.nome}
                      className="w-full h-24 object-cover rounded-lg mb-2" 
                    />
                    <h4 className="font-semibold text-sm mb-1">{product.nome}</h4>
                    <div className="mb-2">
                      <span className="font-bold text-primary text-sm">{formatPrice(product.precoPromocional)}</span>
                      {!product.estoque && (
                        <Badge variant="destructive" className="ml-1 text-xs">Esgotado</Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowFullStore(false);
                        setTimeout(() => handleViewProduct(product), 100);
                      }}
                      className="w-full text-xs"
                    >
                      Ver
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Shopping Cart Float */}
        <Button 
          className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg"
          data-testid="button-cart"
        >
          <ShoppingBag className="w-6 h-6" />
        </Button>
      </div>
    </MobileContainer>
  );
}
