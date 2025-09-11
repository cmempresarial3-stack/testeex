import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";

// Initialize Stripe - using the integration from blueprint:javascript_stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Christian App API is running" });
  });

  // Stripe payment route for one-time payments - from blueprint:javascript_stripe
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Stripe not configured. Please add STRIPE_SECRET_KEY environment variable." 
        });
      }

      const { amount, productName, productId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "brl", // Brazilian Real for Brazilian Christian store
        metadata: {
          productName: productName || "Produto Cristão",
          productId: productId || "unknown"
        },
        description: `Compra na loja cristã: ${productName || "Produto"}`
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        message: "Erro ao processar pagamento: " + error.message 
      });
    }
  });

  // Get product details for payment
  app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    
    // Mock product data - in real app this would come from database
    const products = [
      {
        id: "1",
        name: "Pulseira QR Cristã",
        description: "Conecte-se instantaneamente ao verso do dia",
        price: 29.90,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
      },
      {
        id: "2", 
        name: "Bíblia de Estudo",
        description: "Tradução ACF com notas",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "3",
        name: "Camiseta Fé", 
        description: "100% algodão cristão",
        price: 39.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "4",
        name: "Caneca Inspiração",
        description: "Para seus momentos com Deus", 
        price: 24.90,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "5",
        name: "Quadro Versículo",
        description: "Decoração cristã",
        price: 59.90,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(product);
  });

  // In a full implementation, these would be actual API endpoints:
  // - Daily verse API
  // - Devotional content API  
  // - Bible content API
  // - Hymn database API
  // - User notes sync API
  // - Notification scheduling API

  const httpServer = createServer(app);
  return httpServer;
}
