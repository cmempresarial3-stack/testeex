import { useState, useEffect } from "react";
import { ArrowLeft, Heart, ExternalLink, User, Calendar, Star } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  useEffect(() => {
    try {
      if (params.productData) {
        const decodedData = decodeURIComponent(params.productData);
        const productData = JSON.parse(decodedData);
        setProduct(productData);
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
    if (!product) return;
    
    const confirmMessage = `Ótima escolha! 10% da sua compra são destinados a doações.\n\nVocê será redirecionado para finalizar sua compra.`;
    if (confirm(confirmMessage)) {
      window.open(product.linkLoja, '_blank', 'noopener,noreferrer');
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

        {/* Customer Comments */}
        {product.comentarios && product.comentarios.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Avaliações dos Clientes
              </h3>
              <div className="space-y-4">
                {product.comentarios.map((comment, index) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{comment.nome}</span>
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(comment.data)}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.texto}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donation Message */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2 text-primary">
              "Ótima escolha! 10% da sua compra são destinados a doações."
            </h3>
            <p className="text-sm text-muted-foreground">
              Para conhecer mais sobre nossa marca e propósito, siga-nos nas redes sociais.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}