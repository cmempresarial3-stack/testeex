import { ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";

const products = [
  {
    id: 1,
    name: "Pulseira QR Cristã",
    description: "Conecte-se instantaneamente ao verso do dia",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    featured: true,
  },
  {
    id: 2,
    name: "Bíblia de Estudo",
    description: "Tradução ACF com notas",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  },
  {
    id: 3,
    name: "Camiseta Fé",
    description: "100% algodão cristão",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  },
  {
    id: 4,
    name: "Caneca Inspiração",
    description: "Para seus momentos com Deus",
    price: 24.90,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  },
  {
    id: 5,
    name: "Quadro Versículo",
    description: "Decoração cristã",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  },
];

export default function Store() {
  const featuredProduct = products.find(p => p.featured);
  const otherProducts = products.filter(p => !p.featured);

  const handlePurchase = (productId: number) => {
    // Redirect to checkout page with product ID
    window.location.href = `/checkout?product=${productId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Nossa Loja</h2>
          <p className="text-muted-foreground">Produtos que fortalecem sua fé</p>
        </div>

        {/* Featured Product */}
        {featuredProduct && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <img 
                src={featuredProduct.image} 
                alt={featuredProduct.name}
                className="w-full h-48 object-cover rounded-lg mb-4" 
              />
              <h3 className="text-xl font-bold mb-2">{featuredProduct.name}</h3>
              <p className="text-muted-foreground mb-4">{featuredProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(featuredProduct.price)}
                </span>
                <Button 
                  onClick={() => handlePurchase(featuredProduct.id)}
                  data-testid={`button-buy-${featuredProduct.id}`}
                >
                  Comprar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {otherProducts.map((product) => (
            <Card key={product.id} data-testid={`card-product-${product.id}`}>
              <CardContent className="p-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3" 
                />
                <h4 className="font-semibold mb-2">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePurchase(product.id)}
                    data-testid={`button-view-${product.id}`}
                  >
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">Pagamento Seguro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Aceitamos cartão, PIX e boleto via Mercado Pago
            </p>
          </CardContent>
        </Card>

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
