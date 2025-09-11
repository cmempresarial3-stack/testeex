// Checkout page for one-time payments - from blueprint:javascript_stripe
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, CreditCard, Shield, Check } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const CheckoutForm = ({ product }: { product: Product }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?product=${product.id}`,
        },
      });

      if (error) {
        toast({
          title: "Falha no Pagamento",
          description: error.message || "Ocorreu um erro ao processar o pagamento",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar pagamento",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/store">
            <Button variant="ghost" size="icon" data-testid="button-back-store">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-bold ml-4">Finalizar Compra</h2>
        </div>

        {/* Product Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="w-5 h-5 mr-2 text-primary" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(product.price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Pagamento Seguro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 border rounded-lg">
                <PaymentElement 
                  options={{
                    layout: "tabs"
                  }}
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Pagamento processado com segurança pela Stripe</span>
              </div>

              <Button 
                type="submit" 
                className="w-full p-4 text-lg font-semibold"
                disabled={!stripe || !elements || isProcessing}
                data-testid="button-complete-payment"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagar {formatPrice(product.price)}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Transação 100% segura e criptografada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Dados do cartão protegidos pela Stripe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Suporte via WhatsApp em caso de dúvidas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get product ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (!productId) {
      setError("Produto não especificado");
      setIsLoading(false);
      return;
    }

    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      setError("Stripe não configurado. Pagamentos temporariamente indisponíveis.");
      setIsLoading(false);
      return;
    }

    // Fetch product details and create payment intent
    const initializePayment = async () => {
      try {
        // Get product details
        const productResponse = await apiRequest("GET", `/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Produto não encontrado");
        }
        const productData = await productResponse.json();
        setProduct(productData);

        // Create payment intent
        const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: productData.price,
          productName: productData.name,
          productId: productData.id
        });
        
        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.message || "Erro ao processar pagamento");
        }
        
        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
      } catch (err: any) {
        console.error("Checkout initialization error:", err);
        setError(err.message || "Erro ao carregar checkout");
        toast({
          title: "Erro",
          description: err.message || "Não foi possível carregar o checkout",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [toast]);

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando checkout...</p>
          </div>
        </div>
      </MobileContainer>
    );
  }

  if (error || !product || !clientSecret || !stripePromise) {
    return (
      <MobileContainer>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Erro no Checkout</h3>
              <p className="text-muted-foreground mb-4">
                {error || "Não foi possível carregar a página de pagamento"}
              </p>
              <Link href="/store">
                <Button data-testid="button-back-to-store">
                  Voltar à Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MobileContainer>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm product={product} />
    </Elements>
  );
}